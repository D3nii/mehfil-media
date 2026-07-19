"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { PALETTE, SIMPLEX_3D } from "@/components/three/shaders";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
${SIMPLEX_3D}
${PALETTE}

uniform float uTime;
uniform vec2 uPointer;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12;

  // domain-warped fbm — liquid dupatta silk
  vec2 drift = uPointer * 0.25;
  float q = fbm(vec3(uv * 2.4 + drift, t));
  float r = fbm(vec3(uv * 3.1 - q * 0.8, t * 1.4 + 4.0));
  float folds = fbm(vec3(uv * 1.8 + vec2(q, r) * 1.2, t * 0.8));

  // thread highlights along the fold ridges
  float ridge = smoothstep(0.16, 0.0, abs(folds - 0.12));
  float shimmer = smoothstep(0.3, 0.0, abs(r - 0.2)) * 0.5;

  vec3 color = INK * 0.9;
  color = mix(color, RANI * 0.55, smoothstep(-0.4, 0.7, folds));
  color = mix(color, RANI, ridge * 0.85);
  color = mix(color, GOLD, shimmer * ridge);

  // vignette + global dim so the HTML copy stays legible
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.6);
  color *= mix(0.35, 0.8, vig);

  gl_FragColor = vec4(color, 1.0);
}
`;

/** Full-viewport silk shader — the "digital dupatta" behind the manifesto */
export function SilkPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    (mat.uniforms.uPointer.value as THREE.Vector2).lerp(pointer, 0.04);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
