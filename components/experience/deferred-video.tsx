"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useInView } from "@/hooks/use-in-view";

type DeferredVideoProps = {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  /** How far before the element enters the viewport to start loading. */
  rootMargin?: string;
  /** Start loading even when off-screen (e.g. hero video revealed on scroll). */
  eager?: boolean;
  autoPlay?: boolean;
};

/**
 * Shows a poster image first; loads and plays the video only when near-viewport
 * (or immediately when `eager` is set).
 */
export function DeferredVideo({
  src,
  poster,
  alt,
  className,
  rootMargin = "240px 0px",
  eager = false,
  autoPlay = true,
}: DeferredVideoProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin,
    once: true,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoad = eager || inView;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !autoPlay) return;

    void video.play().catch(() => {
      // Autoplay can be blocked until user gesture; poster remains visible.
    });
  }, [shouldLoad, autoPlay]);

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={poster}
          alt={alt}
          fill
          className="object-cover"
          sizes="320px"
          loading="lazy"
          fetchPriority="low"
        />
      )}
    </div>
  );
}
