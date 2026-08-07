import type { ExplainerLanguage } from "@/lib/mock-data";

export const LANGUAGES: ExplainerLanguage[] = [
  "English",
  "हिन्दी",
  "Español",
  "Français",
];

export const EVENT_STYLES: Record<string, { emoji: string; accent: string }> = {
  Haldi: { emoji: "💛", accent: "from-yellow-100 to-amber-50 border-amber-300" },
  Mehendi: {
    emoji: "🌿",
    accent: "from-emerald-100 to-teal-50 border-emerald-300",
  },
  Sangeet: { emoji: "💃", accent: "from-rose-100 to-pink-50 border-rose-300" },
  Pheras: {
    emoji: "🔥",
    accent: "from-amber-100 to-orange-50 border-orange-300",
  },
};

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Jain (no onion/garlic)",
  "Vegan",
  "Non-Vegetarian",
  "Gluten-Free",
];
