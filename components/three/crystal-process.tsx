"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { createRng, PALETTE, SIMPLEX_3D } from "@/components/three/shaders";
import { useGlowSprite } from "@/components/three/use-glow-sprite";

const vertexShader = /* glsl */ `
${SIMPLEX_3D}

uniform float uTime;
uniform float uChaos;   // 1 = raw noise blob, 0 = cut gem
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPosView;
varying float vDisp;

void main() {
  float n = fbm(normal * 1.4 + uTime * 0.25);
  float displacement = n * mix(0.05, 0.85, uChaos);
  vec3 displaced = position + normal * displacement;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vPosView = (modelViewMatrix * vec4(displaced, 1.0)).xyz;
  vView = normalize(vPosView);
  vDisp = n;

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
${PALETTE}

uniform float uChaos;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPosView;
varying float vDisp;

void main() {
  // facets emerge as the raw matter is cut: blend smooth normals toward
  // screen-space flat normals as chaos falls away
  vec3 flatNormal = normalize(cross(dFdx(vPosView), dFdy(vPosView)));
  vec3 normal = normalize(mix(flatNormal, vNormal, uChaos));

  float fresnel = pow(1.0 - abs(dot(normal, -vView)), 2.2);
  float facetSpark = pow(max(dot(normal, normalize(vec3(0.4, 0.7, 0.6))), 0.0), 8.0);

  vec3 deep = mix(RANI * 0.35, INK + 0.05, uChaos * 0.6);
  vec3 edge = mix(RANI, GOLD, clamp(vDisp * 1.4, 0.0, 1.0));
  vec3 color = mix(deep, edge, fresnel);
  color += IVORY * fresnel * fresnel * 0.35;
  color += GOLD * facetSpark * (1.0 - uChaos) * 0.6;

  gl_FragColor = vec4(color, 0.92);
}
`;

/**
 * The refinement crystal: a shape that starts as raw shader chaos and is
 * cut, step by step, into a gem — the product story told in geometry.
 */
export function CrystalProcess({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const haloRef = useRef<THREE.Points>(null);
  const sprite = useGlowSprite();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: 1 },
    }),
    [],
  );

  const haloGeometry = useMemo(() => {
    const rng = createRng(3141);
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 2.4 + rng() * 1.8;
      const y = (rng() - 0.5) * 0.7;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    const t = state.clock.elapsedTime;

    // dolly back on narrow screens so the gem never fills the frame
    const aspect = state.size.width / state.size.height;
    const z = aspect >= 1 ? 5.5 : 5.5 + (1 / aspect) * 3.4;
    state.camera.position.z += (z - state.camera.position.z) * 0.06;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      // chaos falls away as the visitor scrubs through the five steps
      const target = 1 - Math.min(p * 1.15, 1);
      const current = materialRef.current.uniforms.uChaos.value as number;
      materialRef.current.uniforms.uChaos.value +=
        (target - current) * Math.min(delta * 4, 1);
    }

    const spin = t * 0.25 + p * Math.PI * 2;
    if (meshRef.current) {
      meshRef.current.rotation.y = spin;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -spin * 0.6;
      wireRef.current.rotation.z = Math.cos(t * 0.2) * 0.3;
      const wireScale = 1.25 + Math.sin(t * 0.9) * 0.03;
      wireRef.current.scale.setScalar(wireScale);
    }
    if (haloRef.current) {
      haloRef.current.rotation.y = t * 0.12;
    }
  });

  return (
    <>
      <color attach="background" args={["#0b0908"]} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 6]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {/* orbiting wire cage — the "machine" around the material */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#e01a68"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      <points ref={haloRef} geometry={haloGeometry}>
        <pointsMaterial
          color="#daa54a"
          size={0.028}
          map={sprite ?? undefined}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  );
}
