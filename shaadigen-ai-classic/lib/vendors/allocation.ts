import { CATEGORY_BUDGET_SHARE } from "@/lib/constants/vendors";
import type { Vendor } from "@/types/wedding";

export function vendorAllocation(vendor: Vendor, budget: number): number {
  // Caterers price per plate; assume 300 guests when comparing.
  const alloc = budget * (CATEGORY_BUDGET_SHARE[vendor.category] ?? 0.1);
  return vendor.category === "Caterer" ? alloc / 300 : alloc;
}
