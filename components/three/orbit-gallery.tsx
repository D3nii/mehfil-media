"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const POSTERS = [
  "/studio/earring-poster.jpg",
  "/studio/clothes-poster.jpg",
  "/studio/chai-poster.jpg",
  "/studio/lipstick-poster.jpg",
  "/studio/perfume-poster.jpg",
  "/studio/skincare-poster.jpg",
  "/studio/icecream-poster.jpg",
];

const RADIUS = 5.2;

function PosterCard({
  url,
  index,
  total,
}: {
  url: string;
  index: number;
  total: number;
}) {
  const texture = useTexture(url);
  const angle = (index / total) * Math.PI * 2;

  const geometry = useMemo(() => {
    // gently curved plane so the ring reads as a drum, not a heptagon
    const geo = new THREE.PlaneGeometry(2.5, 4.4, 24, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, -(x * x) * 0.055);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group
      position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
      rotation={[0, angle, 0]}
    >
      <mesh geometry={geometry}>
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* floor reflection — mirrored, faded copy */}
      <mesh
        geometry={geometry}
        position={[0, -4.55, 0]}
        scale={[1, -1, 1]}
      >
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Ring() {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(0.0026);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      velocity.current = dx * 0.00045;
      if (groupRef.current) groupRef.current.rotation.y += dx * 0.004;
    };
    const up = () => {
      dragging.current = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
    };
  }, [gl]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    if (!dragging.current) {
      // inertial glide back toward the idle drift speed
      velocity.current += (0.0026 - velocity.current) * 0.02;
      group.rotation.y += velocity.current;
    }
  });

  return (
    <group ref={groupRef}>
      {POSTERS.map((url, i) => (
        <PosterCard key={url} url={url} index={i} total={POSTERS.length} />
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame(({ camera, pointer, size }) => {
    // dolly back on narrow screens so the drum stays in frame
    const aspect = size.width / size.height;
    const z = aspect >= 1 ? 13.5 : 13.5 + (1 / aspect) * 4.2;
    camera.position.z += (z - camera.position.z) * 0.05;
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.8 + 1.1 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function OrbitGallery() {
  return (
    <>
      <color attach="background" args={["#0b0908"]} />
      <fog attach="fog" args={["#0b0908", 10, 24]} />
      <CameraRig />
      <Suspense fallback={null}>
        <Ring />
      </Suspense>
    </>
  );
}
