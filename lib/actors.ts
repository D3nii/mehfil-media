export type PresetActor = {
  id: string;
  name: string;
  vibe: string;
  image: string;
};

/** In-house AI creators users can pick instead of uploading their own actor. */
export const PRESET_ACTORS: PresetActor[] = [
  {
    id: "mahnoor",
    name: "Mahnoor",
    vibe: "Warm, girl-next-door energy. Best for jewelry, fashion, chai.",
    image: "/studio/creator.png",
  },
  {
    id: "zoya",
    name: "Zoya",
    vibe: "Clean-glow aesthetic. Best for skincare and beauty.",
    image:
      "https://images.unsplash.com/photo-1611601322175-ef8ec8c85f01?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "alizeh",
    name: "Alizeh",
    vibe: "Editorial and polished. Best for premium launches.",
    image:
      "https://images.unsplash.com/photo-1618085219724-c59ba48e08cd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "hira",
    name: "Hira",
    vibe: "Playful and fast-cut. Best for food and lifestyle.",
    image:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=700&q=80",
  },
];
