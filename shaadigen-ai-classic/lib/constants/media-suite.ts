export const GENRES = [
  { id: "arijit", name: "Arijit-style Acoustic", emoji: "🎸" },
  { id: "bollypop", name: "Romantic Bolly-Pop", emoji: "🎤" },
  { id: "sufi", name: "Soulful Sufi Fusion", emoji: "🪕" },
] as const;

export type GenreOption = (typeof GENRES)[number];

export const SONG_DURATION = 30;

export const BAR_HEIGHTS = [
  40, 70, 55, 90, 65, 80, 45, 95, 60, 75, 50, 85, 42, 68, 88, 58, 72, 47, 92, 63,
];

export const THEME_COLORS = [
  {
    id: "gold",
    name: "Royal Gold",
    card: "from-amber-100 via-yellow-50 to-amber-200 border-amber-400",
    text: "text-amber-900",
    accent: "text-amber-700",
  },
  {
    id: "emerald",
    name: "Mehendi Emerald",
    card: "from-emerald-100 via-teal-50 to-emerald-200 border-emerald-400",
    text: "text-emerald-950",
    accent: "text-emerald-700",
  },
  {
    id: "rose",
    name: "Gulaab Rose",
    card: "from-rose-100 via-pink-50 to-rose-200 border-rose-400",
    text: "text-rose-950",
    accent: "text-rose-700",
  },
] as const;

export type InviteThemeColor = (typeof THEME_COLORS)[number];
