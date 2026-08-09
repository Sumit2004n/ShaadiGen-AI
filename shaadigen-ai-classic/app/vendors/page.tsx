"use client";

import { useEffect, useState } from "react";
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
import { formatINR } from "@/lib/utils";
import { matchVendors } from "@/lib/vendors/api";
import type { Vendor, VendorCategory } from "@/types/wedding";

export default function VendorsPage() {
  const { budget, setBudget } = useBudget();
  const [category, setCategory] = useState<VendorCategory>("Photographer");
  const [negotiating, setNegotiating] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const matched = await matchVendors({ budget, category, guests: 300 });
        if (!cancelled) setVendors(matched);
      } catch (err) {
        if (!cancelled) {
          setVendors([]);
          setError(
            err instanceof Error
              ? err.message
              : "Could not load vendors from the API",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [budget, category]);

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

      {loading ? (
        <p className="mt-8 text-center text-sm text-stone-500">
          Matching vendors to your budget…
        </p>
      ) : null}

      {error ? (
        <EmptyState
          emoji="⚠️"
          title="Backend unavailable"
          hint={`${error}. Start the API with Docker Compose, then refresh.`}
        />
      ) : null}

      {!loading && !error ? (
        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor, i) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onNegotiate={setNegotiating}
              animationDelayMs={i * 60}
            />
          ))}
        </section>
      ) : null}

      {!loading && !error && vendors.length === 0 ? (
        <EmptyState
          emoji="🪔"
          title={`No ${CATEGORY_LABELS[category].replace(/^\S+\s/, "")} match this allocation yet.`}
          hint="Try raising the budget slider — premium vendors unlock at higher allocations."
        />
      ) : null}

      <NegotiationModal
        vendor={negotiating}
        budgetTotal={budget}
        onClose={() => setNegotiating(null)}
      />
    </PageContainer>
  );
}
