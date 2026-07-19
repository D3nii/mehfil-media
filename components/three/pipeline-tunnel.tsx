"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import { createRng } from "@/components/three/shaders";
import { useGlowSprite } from "@/components/three/use-glow-sprite";

const TUNNEL_LENGTH = 90;
const RING_COUNT = 26;
const RANI = new THREE.Color("#e01a68");
const GOLD = new THREE.Color("#daa54a");
const IVORY = new THREE.Color("#faf6f0");

/** Wireframe gates the camera punches through */
function Rings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    const rng = createRng(4207);
    return Array.from({ length: RING_COUNT }, (_, i) => ({
      z: -(i / RING_COUNT) * TUNNEL_LENGTH,
      rotation: rng() * Math.PI,
      scale: 3.4 + Math.sin(i * 1.7) * 0.7,
      color: i % 5 === 0 ? GOLD : i % 2 === 0 ? RANI : IVORY,
      opacity: i % 2 === 0 ? 0.5 : 0.18,
    }));
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((ring, i) => {
      ring.rotation.z += 0.0012 * (i % 2 === 0 ? 1 : -1);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6 + i) * 0.02;
      ring.scale.setScalar(rings[i].scale * pulse);
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          position={[0, 0, ring.z]}
          rotation={[0, 0, ring.rotation]}
          scale={ring.scale}
        >
          <torusGeometry args={[1, 0.006, 8, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Star-field dust streaming past the camera */
function TunnelDust() {
  const sprite = useGlowSprite();
  const geometry = useMemo(() => {
    const rng = createRng(8823);
    const count = 2600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 1.6 + rng() * 5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = -rng() * (TUNNEL_LENGTH + 20) + 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#faf6f0"
        size={0.05}
        map={sprite ?? undefined}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const POSTER_URLS = [
  "/studio/earring-product.png",
  "/studio/creator.png",
  "/studio/lipstick-poster.jpg",
  "/studio/perfume-poster.jpg",
  "/studio/earring-poster.jpg",
];

/** Campaign frames drifting past like stations on the assembly line */
function TunnelPosters() {
  const textures = useTexture(POSTER_URLS);
  const groupRef = useRef<THREE.Group>(null);

  const placements = useMemo(
    () =>
      POSTER_URLS.map((_, i) => ({
        z: -8 - i * ((TUNNEL_LENGTH - 18) / POSTER_URLS.length),
        x: (i % 2 === 0 ? -1 : 1) * (2.1 + (i % 3) * 0.4),
        y: Math.sin(i * 2.4) * 1.1,
        rotY: (i % 2 === 0 ? 1 : -1) * 0.5,
      })),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, i) => {
      child.position.y =
        placements[i].y + Math.sin(state.clock.elapsedTime * 0.8 + i * 2) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {textures.map((texture, i) => (
        <mesh
          key={POSTER_URLS[i]}
          position={[placements[i].x, placements[i].y, placements[i].z]}
          rotation={[0, placements[i].rotY, 0]}
        >
          <planeGeometry args={[1.7, 2.5]} />
          <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function ScrollCamera({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  useFrame((state) => {
    const p = progress.current ?? 0;
    const z = 4 - p * (TUNNEL_LENGTH - 4);
    state.camera.position.z += (z - state.camera.position.z) * 0.09;
    state.camera.position.x +=
      (state.pointer.x * 0.5 - state.camera.position.x) * 0.04;
    state.camera.position.y +=
      (state.pointer.y * 0.35 - state.camera.position.y) * 0.04;
    state.camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.06;
  });

  return null;
}

export function PipelineTunnel({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  return (
    <>
      <color attach="background" args={["#0b0908"]} />
      <fog attach="fog" args={["#0b0908", 6, 26]} />
      <ScrollCamera progress={progress} />
      <Rings />
      <TunnelDust />
      <Suspense fallback={null}>
        <TunnelPosters />
      </Suspense>
    </>
  );
}
