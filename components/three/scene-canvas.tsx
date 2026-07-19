"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";

type SceneCanvasProps = {
  children: ReactNode;
  className?: string;
  /** Extra viewport margin before the canvas starts/stops rendering */
  rootMargin?: string;
  camera?: ComponentProps<typeof Canvas>["camera"];
};

/**
 * A lazy, self-pausing R3F canvas. The WebGL context is only created the
 * first time the wrapper scrolls near the viewport, and the frameloop is
 * suspended whenever it scrolls away — so seven scenes can coexist on one
 * page without melting the GPU.
 */
export function SceneCanvas({
  children,
  className,
  rootMargin = "40% 0px 40% 0px",
  camera,
}: SceneCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [everInView, setEverInView] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEverInView(true);
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrapperRef} className={className} aria-hidden>
      {everInView ? (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={camera}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </Canvas>
      ) : null}
    </div>
  );
}
