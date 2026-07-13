const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Real generated campaigns produced in the Mehfil studio */
export const studio = {
  creator: "/studio/creator.png",
  campaigns: [
    {
      id: "earring",
      category: "Jewelry",
      product: "/studio/earring-product.png",
      video: "/studio/earring-reel.mp4",
      poster: "/studio/earring-poster.jpg",
      caption: "Unboxing the jhumkas everyone asked about",
      handle: "@mahnoor.mehfil",
      likes: "531K",
      shares: "64K",
    },
    {
      id: "clothes",
      category: "Clothing",
      product: "/studio/clothes-product.jpg",
      video: "/studio/clothes-reel.mp4",
      poster: "/studio/clothes-poster.jpg",
      caption: "This lawn print in person?? Uff.",
      handle: "@mahnoor.mehfil",
      likes: "356K",
      shares: "29K",
    },
    {
      id: "chai",
      category: "Chai",
      product: null,
      video: "/studio/chai-reel.mp4",
      poster: "/studio/chai-poster.jpg",
      caption: "The secret blend in my nani's chai",
      handle: "@mahnoor.mehfil",
      likes: "689K",
      shares: "92K",
    },
    {
      id: "lipstick",
      category: "Lipstick",
      product: "/studio/lipstick-product.jpg",
      video: "/studio/lipstick-reel.mp4",
      poster: "/studio/lipstick-poster.jpg",
      caption: "This shade under wedding lights?? Obsessed.",
      handle: "@mahnoor.mehfil",
      likes: "447K",
      shares: "51K",
    },
    {
      id: "perfume",
      category: "Fragrance",
      product: "/studio/perfume-product.webp",
      video: "/studio/perfume-reel.mp4",
      poster: "/studio/perfume-poster.jpg",
      caption: "Scentoir smells like a Sunday in Lahore",
      handle: "@mahnoor.mehfil",
      likes: "382K",
      shares: "33K",
    },
    {
      id: "skincare",
      category: "Skincare",
      product: "/studio/skincare-product.jpg",
      video: "/studio/skincare-reel.mp4",
      poster: "/studio/skincare-poster.jpg",
      caption: "14 nights with this vitamin C serum. Results?",
      handle: "@mahnoor.mehfil",
      likes: "298K",
      shares: "26K",
    },
    {
      id: "icecream",
      category: "Ice Cream",
      product: null,
      video: "/studio/icecream-reel.mp4",
      poster: "/studio/icecream-poster.jpg",
      caption: "Malai Magic — the first scoop says it all",
      handle: "@mahnoor.mehfil",
      likes: "512K",
      shares: "47K",
    },
  ],
} as const;

export type StudioCampaign = (typeof studio.campaigns)[number];

export type Reel = {
  id: string;
  creator: string;
  handle: string;
  category: string;
  caption: string;
  image: string;
  video?: string;
  /** The single input photo this reel was generated from */
  product?: string;
  likes: string;
  shares: string;
};

/** Film-strip of generated "reels" for the showcase experience */
export const reels: Reel[] = [
  {
    id: "studio-earring",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Jewelry",
    caption: "Unboxing the jhumkas everyone asked about",
    image: "/studio/earring-poster.jpg",
    video: "/studio/earring-reel.mp4",
    product: "/studio/earring-product.png",
    likes: "531K",
    shares: "64K",
  },
  {
    id: "studio-clothes",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Clothing",
    caption: "This lawn print in person?? Uff.",
    image: "/studio/clothes-poster.jpg",
    video: "/studio/clothes-reel.mp4",
    product: "/studio/clothes-product.jpg",
    likes: "356K",
    shares: "29K",
  },
  {
    id: "studio-chai",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Chai",
    caption: "The secret blend in my nani's chai",
    image: "/studio/chai-poster.jpg",
    video: "/studio/chai-reel.mp4",
    likes: "689K",
    shares: "92K",
  },
  {
    id: "studio-lipstick",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Lipstick",
    caption: "This shade under wedding lights?? Obsessed.",
    image: "/studio/lipstick-poster.jpg",
    video: "/studio/lipstick-reel.mp4",
    product: "/studio/lipstick-product.jpg",
    likes: "447K",
    shares: "51K",
  },
  {
    id: "studio-perfume",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Fragrance",
    caption: "Scentoir smells like a Sunday in Lahore",
    image: "/studio/perfume-poster.jpg",
    video: "/studio/perfume-reel.mp4",
    product: "/studio/perfume-product.webp",
    likes: "382K",
    shares: "33K",
  },
  {
    id: "studio-skincare",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Skincare",
    caption: "14 nights with this vitamin C serum. Results?",
    image: "/studio/skincare-poster.jpg",
    video: "/studio/skincare-reel.mp4",
    product: "/studio/skincare-product.jpg",
    likes: "298K",
    shares: "26K",
  },
  {
    id: "studio-icecream",
    creator: "Mahnoor",
    handle: "@mahnoor.mehfil",
    category: "Ice Cream",
    caption: "Malai Magic — the first scoop says it all",
    image: "/studio/icecream-poster.jpg",
    video: "/studio/icecream-reel.mp4",
    likes: "512K",
    shares: "47K",
  },
  {
    id: "facecream",
    creator: "Alizeh",
    handle: "@alizeh.adorned",
    category: "Face Cream",
    caption: "30 nights with one jar. Here's the truth.",
    image: u("1610030469983-98e550d6193c", 900),
    likes: "154K",
    shares: "11K",
  },
  {
    id: "eyewear",
    creator: "Hira",
    handle: "@hira.hues",
    category: "Eyewear",
    caption: "Frames for every desi face shape",
    image: u("1572635196237-14b3f281503f", 900),
    likes: "221K",
    shares: "18K",
  },
];

export type Category = {
  id: string;
  name: string;
  urdu: string;
  stat: string;
  image: string;
};

/** Category switcher for the categories experience */
export const categories: Category[] = [
  {
    id: "chai",
    name: "Chai",
    urdu: "چائے",
    stat: "Steam, pour and first-sip shots",
    image: "/studio/chai-poster.jpg",
  },
  {
    id: "beauty",
    name: "Beauty",
    urdu: "حسن",
    stat: "Swatches under wedding light",
    image: "/studio/lipstick-poster.jpg",
  },
  {
    id: "clothing",
    name: "Clothing",
    urdu: "لباس",
    stat: "Lawn, unstitched, try-on hauls",
    image: "/studio/clothes-poster.jpg",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    urdu: "زیور",
    stat: "Unboxings and close-up sparkle",
    image: "/studio/earring-poster.jpg",
  },
  {
    id: "skincare",
    name: "Skincare",
    urdu: "جلد",
    stat: "48hr concept to campaign",
    image: "/studio/skincare-poster.jpg",
  },
  {
    id: "fragrance",
    name: "Fragrance",
    urdu: "عطر",
    stat: "Scent stories told in Urdu",
    image: "/studio/perfume-poster.jpg",
  },
  {
    id: "icecream",
    name: "Ice Cream",
    urdu: "آئس کریم",
    stat: "B-roll shot before it melts",
    image: "/studio/icecream-poster.jpg",
  },
];

/** The AI creators referenced across the experience. Mahnoor is real. */
export const creators = [
  { name: "Mahnoor", image: "/studio/creator.png" },
  { name: "Zoya", image: u("1611601322175-ef8ec8c85f01", 700) },
  { name: "Alizeh", image: u("1618085219724-c59ba48e08cd", 700) },
  { name: "Hira", image: u("1567532939604-b6b5b0db2604", 700) },
] as const;

export const heroImages = {
  product: "/studio/earring-product.png",
  creator: "/studio/creator.png",
  video: "/studio/earring-reel.mp4",
  videoPoster: "/studio/earring-poster.jpg",
  variations: [
    "/studio/clothes-poster.jpg",
    "/studio/lipstick-poster.jpg",
    "/studio/perfume-poster.jpg",
    "/studio/skincare-poster.jpg",
  ],
} as const;
