export const OUTFITS = [
  {
    id: "lehenga",
    name: "Red Velvet Sabyasachi Lehenga",
    emoji: "👰",
    swatch: "from-red-600 via-rose-500 to-red-800",
    note: "Hand-embroidered zardozi, 9m flare",
  },
  {
    id: "jewelry",
    name: "Temple Jewelry Set",
    emoji: "💎",
    swatch: "from-amber-400 via-yellow-300 to-amber-600",
    note: "Antique gold, Nakshi kasu haram",
  },
  {
    id: "sherwani",
    name: "Royal Ivory Sherwani",
    emoji: "🤵",
    swatch: "from-stone-200 via-amber-100 to-stone-300",
    note: "Chikankari with emerald brooch",
  },
] as const;

export type OutfitOption = (typeof OUTFITS)[number];

export const LIGHTING = [
  {
    id: "sunset",
    name: "Sunset Golden Hour",
    icon: "🌅",
    overlay: "bg-gradient-to-t from-orange-500/50 via-amber-300/25 to-transparent",
    ambience: "from-amber-200 to-orange-100",
  },
  {
    id: "stage",
    name: "Stage Spotlights",
    icon: "🎤",
    overlay: "bg-gradient-to-b from-fuchsia-500/40 via-transparent to-blue-500/30",
    ambience: "from-purple-200 to-fuchsia-100",
  },
  {
    id: "mandap",
    name: "Night Mandap",
    icon: "🪔",
    overlay: "bg-gradient-to-t from-indigo-900/60 via-amber-500/20 to-indigo-950/40",
    ambience: "from-indigo-200 to-slate-200",
  },
] as const;

export type LightingOption = (typeof LIGHTING)[number];

export const THEMES = [
  {
    id: "udaipur",
    name: "Udaipur Palace",
    emoji: "🏰",
    palette: [
      "from-amber-300 to-rose-400",
      "from-orange-300 to-amber-500",
      "from-rose-300 to-red-400",
      "from-yellow-200 to-orange-400",
    ],
    captions: [
      "Lake Pichola dusk",
      "Jharokha silhouettes",
      "Marble courtyard twirl",
      "Royal chhatri frame",
    ],
  },
  {
    id: "alps",
    name: "Swiss Alps",
    emoji: "🏔️",
    palette: [
      "from-sky-300 to-blue-500",
      "from-slate-200 to-sky-400",
      "from-cyan-200 to-blue-400",
      "from-blue-300 to-indigo-400",
    ],
    captions: [
      "Snowfield embrace",
      "Alpine meadow run",
      "Cable-car window kiss",
      "Glacier golden light",
    ],
  },
  {
    id: "santorini",
    name: "Santorini Sunset",
    emoji: "🌊",
    palette: [
      "from-blue-400 to-indigo-500",
      "from-rose-300 to-orange-400",
      "from-sky-300 to-blue-600",
      "from-amber-200 to-rose-400",
    ],
    captions: [
      "Blue-dome backdrop",
      "Caldera cliff walk",
      "Oia sunset silhouette",
      "Whitewashed stairway",
    ],
  },
] as const;

export type ShootTheme = (typeof THEMES)[number];

export const GENERATION_STEPS = [
  "Extracting facial landmarks…",
  "Matching couple pose library…",
  "Rendering lighting & atmosphere…",
  "Upscaling to 4K & color grading…",
];
