"use client";

import { useMemo, useState } from "react";
import { useBudget } from "@/components/budget-context";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageContainer } from "@/components/layout/page-container";
import { BudgetSlider } from "@/components/ui/budget-slider";
import { EmptyState } from "@/components/ui/empty-state";
import { PillTabs } from "@/components/ui/pill-tabs";
import { NegotiationModal } from "@/components/vendors/negotiation-modal";
import { VendorCard } from "@/components/vendors/vendor-card";
import {
  CATEGORY_BUDGET_SHARE,
  CATEGORY_LABELS,
  VENDOR_CATEGORIES,
} from "@/lib/constants/vendors";
import { VENDORS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { vendorAllocation } from "@/lib/vendors/allocation";
import type { Vendor, VendorCategory } from "@/types/wedding";

export default function VendorsPage() {
  const { budget, setBudget } = useBudget();
  const [category, setCategory] = useState<VendorCategory>("Photographer");
  const [negotiating, setNegotiating] = useState<Vendor | null>(null);

  const filtered = useMemo(
    () =>
      VENDORS.filter(
        (v) =>
          v.category === category &&
          v.priceRange.min <= vendorAllocation(v, budget),
      ),
    [category, budget],
  );

  return (
    <PageContainer>
      <ModuleHeader
        moduleLabel="Module 01"
        badgeTone="amber"
        title="🤝 Budget Vendor Matchmaker"
        description="Move the slider — our AI instantly re-matches verified vendors that fit your allocation, complete with pre-negotiated perks."
      />

      <div className="mt-8">
        <BudgetSlider
          value={budget}
          onChange={setBudget}
          hint={
            <>
              {CATEGORY_LABELS[category]} allocation at this budget:{" "}
              <strong className="text-emerald-700">
                {formatINR(budget * (CATEGORY_BUDGET_SHARE[category] ?? 0.1))}
              </strong>
              {category === "Caterer" && " (≈300 guests, per-plate pricing)"}
            </>
          }
        />
      </div>

      <div className="mt-6">
        <PillTabs
          options={VENDOR_CATEGORIES.map((c) => ({
            key: c,
            label: CATEGORY_LABELS[c],
          }))}
          value={category}
          onChange={setCategory}
        />
      </div>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor, i) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onNegotiate={setNegotiating}
            animationDelayMs={i * 60}
          />
        ))}
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🪔"
          title={`No ${CATEGORY_LABELS[category].replace(/^\S+\s/, "")} match this allocation yet.`}
          hint="Try raising the budget slider — premium vendors unlock at higher allocations."
        />
      ) : null}

      <NegotiationModal
        vendor={negotiating}
        onClose={() => setNegotiating(null)}
      />
    </PageContainer>
  );
}
