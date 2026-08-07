import type { PriceBucket } from "@/types/wedding";

export const PRICE_BUCKETS: { key: PriceBucket | "All"; label: string }[] = [
  { key: "All", label: "All Budgets" },
  { key: "Budget (₹20k-50k)", label: "Budget (₹20k–50k)" },
  { key: "Mid-Range (₹50k-1.5L)", label: "Mid-Range (₹50k–1.5L)" },
  { key: "Luxury (₹1.5L+)", label: "Luxury (₹1.5L+)" },
];
