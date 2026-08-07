import type { VendorCategory } from "@/types/wedding";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  "Photographer",
  "Decorator",
  "Caterer",
  "Makeup Artist",
];

export const CATEGORY_LABELS: Record<string, string> = {
  Photographer: "📸 Photographers",
  Decorator: "🌸 Decorators",
  Caterer: "🍽️ Caterers",
  "Makeup Artist": "💄 Makeup Artists",
};

/** Share of total budget typically allocated to each category. */
export const CATEGORY_BUDGET_SHARE: Record<string, number> = {
  Photographer: 0.1,
  Decorator: 0.15,
  Caterer: 0.25,
  "Makeup Artist": 0.05,
};
