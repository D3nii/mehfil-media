"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import { createRng, PALETTE, SIMPLEX_3D } from "@/components/three/shaders";
import { useGlowSprite } from "@/components/three/use-glow-sprite";

const vertexShader = /* glsl */ `
${SIMPLEX_3D}

uniform float uTime;
uniform float uPulse;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

void main() {
  float n = fbm(normal * 1.7 + uTime * 0.32);
  float swell = 0.24 + uPulse * 0.2;
  vec3 displaced = position + normal * n * swell;

  vNormal = normalize(normalMatrix * normal);
  vView = normalize((modelViewMatrix * vec4(displaced, 1.0)).xyz);
  vNoise = n;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const fragmentShader = /* glsl */ `
${PALETTE}

varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

void main() {
  float fresnel = pow(1.0 - abs(dot(vNormal, -vView)), 1.8);

  vec3 body = mix(RANI * 0.32, RANI * 0.8, smoothstep(-0.5, 0.8, vNoise));
  vec3 color = mix(body * 0.22, body, fresnel);
  color += GOLD * pow(fresnel, 3.0) * 0.45;
  color += IVORY * pow(fresnel, 6.0) * 0.3;

  gl_FragColor = vec4(color, 1.0);
}
`;

function Blob() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      // heartbeat: two quick swells, then rest
      const beat = Math.pow(Math.max(Math.sin(t * 2.4), 0), 6);
      materialRef.current.uniforms.uPulse.value = beat;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12;
      meshRef.current.position.x += (pointer.x * 0.5 - meshRef.current.position.x) * 0.02;
      meshRef.current.position.y += (pointer.y * 0.3 - meshRef.current.position.y) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.2]}>
      <icosahedronGeometry args={[1.45, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/** Sparks orbiting the heart */
function Embers() {
  const pointsRef = useRef<THREE.Points>(null);
  const sprite = useGlowSprite();

  const geometry = useMemo(() => {
    const rng = createRng(7719);
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const tilt = (rng() - 0.5) * 1.6;
      const radius = 2.6 + rng() * 2.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = tilt;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#e01a68"
        size={0.04}
        map={sprite ?? undefined}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function FinaleBlob() {
  return (
    <>
      <color attach="background" args={["#0b0908"]} />
      <Blob />
      <Embers />
      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
