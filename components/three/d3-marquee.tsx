const WORDS = [
  "WebGL",
  "GLSL",
  "Particles",
  "Simplex Noise",
  "Fresnel",
  "Raymarch",
  "Vertex Displacement",
  "Bloom",
  "60 FPS",
];

function Track({ className }: { className: string }) {
  return (
    <div className={`flex w-max items-center gap-8 pr-8 ${className}`}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
          {WORDS.map((word) => (
            <span key={word} className="flex items-center gap-8">
              <span className="whitespace-nowrap text-4xl font-semibold tracking-tight md:text-6xl">
                {word}
              </span>
              <span className="text-2xl text-[#e01a68]">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Double counter-scrolling tech ticker between acts */
export function D3Marquee() {
  return (
    <section
      aria-label="Capabilities ticker"
      className="relative overflow-hidden border-y border-[#faf6f0]/10 py-10"
    >
      <div className="d3-aurora" />
      <div className="space-y-4">
        <Track className="d3-marquee-track text-[#faf6f0]" />
        <Track className="d3-marquee-track-reverse d3-stroke" />
      </div>
    </section>
  );
}
