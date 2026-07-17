/**
 * Minimal, dependency-free stable-fluids solver on WebGL2.
 * Runs the classic Stam pipeline into half-float ping-pong buffers and
 * composites the dye field over a transparent canvas.
 */
import {
  ADVECTION_FRAG,
  BASE_VERTEX,
  CLEAR_FRAG,
  CURL_FRAG,
  DISPLAY_FRAG,
  DIVERGENCE_FRAG,
  GRADIENT_SUBTRACT_FRAG,
  PRESSURE_FRAG,
  SPLAT_FRAG,
  VORTICITY_FRAG,
} from "./shaders";

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap(): void;
};

class Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(
    private gl: WebGL2RenderingContext,
    vertexSrc: string,
    fragmentSrc: string,
  ) {
    const vs = compile(gl, gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    const program = gl.createProgram();
    if (!program) throw new Error("createProgram failed");
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
    }
    this.program = program;

    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const loc = gl.getUniformLocation(program, info.name);
      if (loc) this.uniforms[info.name] = loc;
    }
  }

  bind() {
    this.gl.useProgram(this.program);
  }
}

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "compile failed");
  }
  return shader;
}

export type FluidOptions = {
  /** Simulation grid resolution (short edge). */
  simResolution?: number;
  /** Dye texture resolution (short edge). */
  dyeResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressureIterations?: number;
  curl?: number;
  splatRadius?: number;
};

export type SplatInput = {
  /** 0..1, origin bottom-left (GL space) */
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: [number, number, number];
};

export class FluidSim {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private opts: Required<FluidOptions>;

  private clearProgram: Program;
  private splatProgram: Program;
  private advectionProgram: Program;
  private divergenceProgram: Program;
  private curlProgram: Program;
  private vorticityProgram: Program;
  private pressureProgram: Program;
  private gradientProgram: Program;
  private displayProgram: Program;

  private dye!: DoubleFBO;
  private velocity!: DoubleFBO;
  private divergence!: FBO;
  private curl!: FBO;
  private pressure!: DoubleFBO;

  private raf = 0;
  private lastTime = 0;
  private running = false;
  private pendingSplats: SplatInput[] = [];
  private halfFloatLinear: boolean;

  constructor(canvas: HTMLCanvasElement, options: FluidOptions = {}) {
    this.canvas = canvas;
    this.opts = {
      simResolution: options.simResolution ?? 128,
      dyeResolution: options.dyeResolution ?? 512,
      densityDissipation: options.densityDissipation ?? 1.1,
      velocityDissipation: options.velocityDissipation ?? 0.35,
      pressureIterations: options.pressureIterations ?? 18,
      curl: options.curl ?? 22,
      splatRadius: options.splatRadius ?? 0.0035,
    };

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;

    gl.getExtension("EXT_color_buffer_float");
    this.halfFloatLinear = !!gl.getExtension("OES_texture_float_linear")
      || !!gl.getExtension("OES_texture_half_float_linear");

    // fullscreen triangle-strip quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.clearProgram = new Program(gl, BASE_VERTEX, CLEAR_FRAG);
    this.splatProgram = new Program(gl, BASE_VERTEX, SPLAT_FRAG);
    this.advectionProgram = new Program(gl, BASE_VERTEX, ADVECTION_FRAG);
    this.divergenceProgram = new Program(gl, BASE_VERTEX, DIVERGENCE_FRAG);
    this.curlProgram = new Program(gl, BASE_VERTEX, CURL_FRAG);
    this.vorticityProgram = new Program(gl, BASE_VERTEX, VORTICITY_FRAG);
    this.pressureProgram = new Program(gl, BASE_VERTEX, PRESSURE_FRAG);
    this.gradientProgram = new Program(gl, BASE_VERTEX, GRADIENT_SUBTRACT_FRAG);
    this.displayProgram = new Program(gl, BASE_VERTEX, DISPLAY_FRAG);

    this.initFramebuffers();
  }

  /** Queue a splat; consumed on the next simulation step. */
  splat(input: SplatInput) {
    this.pendingSplats.push(input);
    if (this.pendingSplats.length > 40) this.pendingSplats.shift();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      if (!this.running) return;
      const dt = Math.min((time - this.lastTime) / 1000, 1 / 30);
      this.lastTime = time;
      this.resizeIfNeeded();
      this.step(dt);
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    const ext = this.gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();
  }

  // ── internals ────────────────────────────────────────────────

  private resolution(shortEdge: number) {
    const gl = this.gl;
    const aspect = gl.drawingBufferWidth / Math.max(gl.drawingBufferHeight, 1);
    const min = Math.round(shortEdge);
    const max = Math.round(shortEdge * Math.max(aspect, 1 / aspect));
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  private createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    filter: number,
  ): FBO {
    const gl = this.gl;
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture: texture!,
      fbo: fbo!,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach: (id: number) => {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  private createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    filter: number,
  ): DoubleFBO {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, filter);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, filter);
    return {
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      get read() {
        return fbo1;
      },
      get write() {
        return fbo2;
      },
      swap() {
        const tmp = fbo1;
        fbo1 = fbo2;
        fbo2 = tmp;
      },
    };
  }

  private initFramebuffers() {
    const gl = this.gl;
    const sim = this.resolution(this.opts.simResolution);
    const dye = this.resolution(this.opts.dyeResolution);
    const filter = this.halfFloatLinear ? gl.LINEAR : gl.NEAREST;

    this.dye = this.createDoubleFBO(
      dye.width, dye.height, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, filter,
    );
    this.velocity = this.createDoubleFBO(
      sim.width, sim.height, gl.RG16F, gl.RG, gl.HALF_FLOAT, filter,
    );
    this.divergence = this.createFBO(
      sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST,
    );
    this.curl = this.createFBO(
      sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST,
    );
    this.pressure = this.createDoubleFBO(
      sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST,
    );
  }

  private resizeIfNeeded() {
    const canvas = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      this.initFramebuffers();
    }
  }

  private blit(target: FBO | null) {
    const gl = this.gl;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private applySplats() {
    const gl = this.gl;
    const aspect = this.canvas.width / Math.max(this.canvas.height, 1);
    for (const s of this.pendingSplats) {
      this.splatProgram.bind();
      gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
      gl.uniform1f(this.splatProgram.uniforms.aspectRatio, aspect);
      gl.uniform2f(this.splatProgram.uniforms.point, s.x, s.y);
      gl.uniform3f(this.splatProgram.uniforms.color, s.dx, s.dy, 0);
      gl.uniform1f(this.splatProgram.uniforms.radius, this.opts.splatRadius);
      this.blit(this.velocity.write);
      this.velocity.swap();

      gl.uniform1i(this.splatProgram.uniforms.uTarget, this.dye.read.attach(0));
      gl.uniform3f(
        this.splatProgram.uniforms.color,
        s.color[0], s.color[1], s.color[2],
      );
      this.blit(this.dye.write);
      this.dye.swap();
    }
    this.pendingSplats.length = 0;
  }

  private step(dt: number) {
    const gl = this.gl;
    gl.disable(gl.BLEND);

    this.applySplats();

    // curl + vorticity confinement
    this.curlProgram.bind();
    gl.uniform2f(
      this.curlProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.curl);

    this.vorticityProgram.bind();
    gl.uniform2f(
      this.vorticityProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
    gl.uniform1f(this.vorticityProgram.uniforms.curl, this.opts.curl);
    gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocity.write);
    this.velocity.swap();

    // divergence
    this.divergenceProgram.bind();
    gl.uniform2f(
      this.divergenceProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.divergence);

    // pressure solve
    this.clearProgram.bind();
    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressure.read.attach(0));
    gl.uniform1f(this.clearProgram.uniforms.value, 0.8);
    this.blit(this.pressure.write);
    this.pressure.swap();

    this.pressureProgram.bind();
    gl.uniform2f(
      this.pressureProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < this.opts.pressureIterations; i++) {
      gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
      this.blit(this.pressure.write);
      this.pressure.swap();
    }

    // subtract pressure gradient
    this.gradientProgram.bind();
    gl.uniform2f(
      this.gradientProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.gradientProgram.uniforms.uPressure, this.pressure.read.attach(0));
    gl.uniform1i(this.gradientProgram.uniforms.uVelocity, this.velocity.read.attach(1));
    this.blit(this.velocity.write);
    this.velocity.swap();

    // advect velocity then dye
    this.advectionProgram.bind();
    gl.uniform2f(
      this.advectionProgram.uniforms.texelSize,
      this.velocity.texelSizeX, this.velocity.texelSizeY,
    );
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(this.advectionProgram.uniforms.uSource, this.velocity.read.attach(0));
    gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    gl.uniform1f(
      this.advectionProgram.uniforms.dissipation,
      this.opts.velocityDissipation,
    );
    this.blit(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(this.advectionProgram.uniforms.uSource, this.dye.read.attach(1));
    gl.uniform1f(
      this.advectionProgram.uniforms.dissipation,
      this.opts.densityDissipation,
    );
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private render() {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.displayProgram.bind();
    gl.uniform2f(
      this.displayProgram.uniforms.texelSize,
      this.dye.texelSizeX, this.dye.texelSizeY,
    );
    gl.uniform1i(this.displayProgram.uniforms.uTexture, this.dye.read.attach(0));
    this.blit(null);
  }
}
