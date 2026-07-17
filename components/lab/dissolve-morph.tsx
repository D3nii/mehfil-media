"use client";

import { useEffect, useRef } from "react";

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/**
 * fbm-driven dissolve: pixels of image A liquefy along a turbulent front
 * and re-condense as image B. A rani-colored emissive edge traces the
 * reaction line; both textures get a subtle flow-map displacement.
 */
const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uTime;
uniform float uCanvasAspect;
uniform float uFromAspect;
uniform float uToAspect;

/* object-fit: cover for a texture of aspect texAspect inside the canvas */
vec2 coverUv (vec2 uv, float texAspect) {
  vec2 scale = uCanvasAspect > texAspect
    ? vec2(1.0, texAspect / uCanvasAspect)
    : vec2(uCanvasAspect / texAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

float hash (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise (vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm (vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return v;
}

void main () {
  vec2 uv = vUv;

  float n = fbm(uv * 4.0 + uTime * 0.05);
  // dissolve front sweeps bottom-to-top with turbulence
  float front = uProgress * 1.35 - 0.175;
  float d = (1.0 - uv.y) * 0.55 + n * 0.45;
  float edgeWidth = 0.09;
  float m = smoothstep(front - edgeWidth, front + edgeWidth, d);

  // displacement grows near the reaction line
  float agitation = (1.0 - abs(m * 2.0 - 1.0));
  vec2 flow = vec2(
    fbm(uv * 6.0 + uTime * 0.13) - 0.5,
    fbm(uv * 6.0 - uTime * 0.11 + 31.7) - 0.5
  ) * agitation * 0.05;

  vec4 from = texture(uFrom, coverUv(uv + flow * (1.0 - uProgress), uFromAspect));
  vec4 to = texture(uTo, coverUv(uv - flow * uProgress, uToAspect));
  vec4 color = mix(to, from, m);

  // emissive rani edge along the front
  float edge = smoothstep(0.55, 1.0, agitation);
  vec3 rani = vec3(0.77, 0.05, 0.33);
  color.rgb += rani * edge * 0.55 * sin(uProgress * 3.14159);

  fragColor = color;
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

function loadTexture(
  gl: WebGL2RenderingContext,
  url: string,
  onAspect: (aspect: number) => void,
): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // 1px placeholder until the image resolves
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([23, 19, 16, 255]),
  );
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    onAspect(img.naturalWidth / Math.max(img.naturalHeight, 1));
  };
  img.src = url;
  return tex;
}

type DissolveMorphProps = {
  from: string;
  to: string;
  /** 0..1 morph progress — pass a ref that a scroll driver mutates. */
  progressRef: React.RefObject<number>;
  className?: string;
};

/** GPU crossfade between two images, driven externally via progressRef. */
export function DissolveMorph({
  from,
  to,
  progressRef,
  className,
}: DissolveMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // canvas frame is 3:4; assume that until each image reports its true ratio
    let fromAspect = 0.75;
    let toAspect = 0.75;
    const texFrom = loadTexture(gl, from, (a) => (fromAspect = a));
    const texTo = loadTexture(gl, to, (a) => (toAspect = a));

    const uFrom = gl.getUniformLocation(program, "uFrom");
    const uTo = gl.getUniformLocation(program, "uTo");
    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uCanvasAspect = gl.getUniformLocation(program, "uCanvasAspect");
    const uFromAspect = gl.getUniformLocation(program, "uFromAspect");
    const uToAspect = gl.getUniformLocation(program, "uToAspect");

    let raf = 0;
    let running = true;
    const loop = (time: number) => {
      if (!running) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texFrom);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texTo);
      gl.uniform1i(uFrom, 0);
      gl.uniform1i(uTo, 1);
      gl.uniform1f(uProgress, progressRef.current ?? 0);
      gl.uniform1f(uTime, time / 1000);
      gl.uniform1f(uCanvasAspect, canvas.width / Math.max(canvas.height, 1));
      gl.uniform1f(uFromAspect, fromAspect);
      gl.uniform1f(uToAspect, toAspect);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [from, to, progressRef]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
