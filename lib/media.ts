/** Warm the browser cache for an image without rendering it. */
export function preloadImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

/** Warm the browser cache for a video (metadata only). */
export function preloadVideo(src: string) {
  if (typeof window === "undefined") return;
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = src;
}
