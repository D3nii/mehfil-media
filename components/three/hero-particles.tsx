"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { createRng, PALETTE, SIMPLEX_3D } from "@/components/three/shaders";

const COUNT = 16000;

/** Sample particle targets from 2D canvas text — the word becomes matter. */
function sampleText(
  text: string,
  count: number,
  rng: () => number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  if (typeof document === "undefined") return positions;

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 260;
  const ctx = canvas.getContext("2d");
  if (!ctx) return positions;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "900 190px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const lit: Array<[number, number]> = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[(y * canvas.width + x) * 4] > 128) lit.push([x, y]);
    }
  }
  if (lit.length === 0) return positions;

  const scale = 0.0148;
  for (let i = 0; i < count; i++) {
    const [x, y] = lit[Math.floor(rng() * lit.length)];
    positions[i * 3] = (x - canvas.width / 2) * scale;
    positions[i * 3 + 1] = -(y - canvas.height / 2) * scale;
    positions[i * 3 + 2] = (rng() - 0.5) * 0.5;
  }
  return positions;
}

function sampleSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere for an even shell
    const t = i / count;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function sampleTorusKnot(count: number, rng: () => number): Float32Array {
  const positions = new Float32Array(count * 3);
  const R = 2.4;
  const r = 0.75;
  const p = 2;
  const q = 3;
  for (let i = 0; i < count; i++) {
    const u = rng() * Math.PI * 2;
    const cu = Math.cos(q * u);
    const radius = R + r * cu;
    const x = radius * Math.cos(p * u);
    const y = radius * Math.sin(p * u);
    const z = r * Math.sin(q * u);
    const jitter = 0.22;
    positions[i * 3] = x + (rng() - 0.5) * jitter;
    positions[i * 3 + 1] = y * 0.75 + (rng() - 0.5) * jitter;
    positions[i * 3 + 2] = z + (rng() - 0.5) * jitter;
  }
  return positions;
}

const vertexShader = /* glsl */ `
${SIMPLEX_3D}

attribute vec3 aText;
attribute vec3 aSphere;
attribute vec3 aKnot;
attribute float aSeed;

uniform float uTime;
uniform float uPhase;      // 0..3 cycling between shapes
uniform vec3 uMouse;       // pointer in world space
uniform float uMouseForce;
uniform float uScroll;     // 0..1 page-out progress

varying float vGlow;
varying float vSeed;

vec3 shapeAt(float phase) {
  float p = mod(phase, 3.0);
  if (p < 1.0) return mix(aText, aSphere, smoothstep(0.0, 1.0, p));
  if (p < 2.0) return mix(aSphere, aKnot, smoothstep(0.0, 1.0, p - 1.0));
  return mix(aKnot, aText, smoothstep(0.0, 1.0, p - 2.0));
}

void main() {
  vec3 target = shapeAt(uPhase);

  // breathing noise drift
  float n = snoise(target * 0.6 + uTime * 0.18 + aSeed * 7.0);
  target += normalize(target + 0.0001) * n * 0.14;

  // pointer repulsion — the crowd parts around the cursor
  vec3 toMouse = target - uMouse;
  float dist = length(toMouse);
  float force = uMouseForce * exp(-dist * 1.4);
  target += normalize(toMouse + 0.0001) * force;

  // scroll pulls the field apart like dust
  target *= 1.0 + uScroll * 2.2;
  target.y += uScroll * -1.4 * (0.5 + fract(aSeed * 13.7));

  vec4 mv = modelViewMatrix * vec4(target, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = mix(1.6, 4.2, fract(aSeed * 3.1));
  gl_PointSize = size * (26.0 / -mv.z);

  vGlow = force * 2.0 + abs(n);
  vSeed = aSeed;
}
`;

const fragmentShader = /* glsl */ `
${PALETTE}

uniform float uScroll;
varying float vGlow;
varying float vSeed;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.05, d);
  vec3 base = mix(IVORY, RANI, step(0.72, fract(vSeed * 5.3)));
  base = mix(base, GOLD, step(0.93, fract(vSeed * 9.1)));
  vec3 color = mix(base, RANI, clamp(vGlow, 0.0, 1.0));

  float alpha = core * (1.0 - uScroll * 0.85);
  gl_FragColor = vec4(color, alpha);
}
`;

export function HeroParticles({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const mouseTarget = useRef(new THREE.Vector3(0, 0, 0));

  const { geometry, uniforms } = useMemo(() => {
    const rng = createRng(1913);
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = rng();

    // draw positions are irrelevant — the vertex shader owns placement
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3),
    );
    geo.setAttribute(
      "aText",
      new THREE.BufferAttribute(sampleText("MEHFIL", COUNT, rng), 3),
    );
    geo.setAttribute(
      "aSphere",
      new THREE.BufferAttribute(sampleSphere(COUNT, 2.6), 3),
    );
    geo.setAttribute(
      "aKnot",
      new THREE.BufferAttribute(sampleTorusKnot(COUNT, rng), 3),
    );
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    // shader-driven placement can escape the CPU-side bounds; never cull
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uMouse: { value: new THREE.Vector3(999, 999, 0) },
        uMouseForce: { value: 0.9 },
        uScroll: { value: 0 },
      },
    };
  }, []);

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;

    // hold each shape ~4.4s, morph over ~1.8s
    const cycle = 6.2;
    const local = (t % cycle) / cycle;
    const held = Math.min(local / 0.29, 1);
    mat.uniforms.uPhase.value = Math.floor(t / cycle) + held;

    // fit the ~13-unit wordmark inside narrow viewports
    const fit = Math.min(1, viewport.width / 14.5);

    // pointer mapped into the scaled object space so repulsion stays true
    mouseTarget.current.set(
      (pointer.x * viewport.width) / 2 / fit,
      (pointer.y * viewport.height) / 2 / fit,
      0,
    );
    (mat.uniforms.uMouse.value as THREE.Vector3).lerp(
      mouseTarget.current,
      0.08,
    );
    mat.uniforms.uScroll.value = scrollProgress.current ?? 0;

    if (pointsRef.current) {
      pointsRef.current.scale.setScalar(fit);
      pointsRef.current.rotation.y = Math.sin(t * 0.1) * 0.12;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
