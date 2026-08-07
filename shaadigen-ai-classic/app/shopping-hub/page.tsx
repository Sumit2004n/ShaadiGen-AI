"use client";

import { useMemo, useState } from "react";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageContainer } from "@/components/layout/page-container";
import { FeaturedGuideBanner } from "@/components/shopping-hub/featured-guide-banner";
import { ShopCard } from "@/components/shopping-hub/shop-card";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { PillTabs } from "@/components/ui/pill-tabs";
import { SearchInput } from "@/components/ui/search-input";
import { PRICE_BUCKETS } from "@/lib/constants/shopping-hub";
import { SHOPPING_GUIDE } from "@/lib/mock-data";
import type { PriceBucket } from "@/types/wedding";

export default function ShoppingHubPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState<PriceBucket | "All">("All");
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHOPPING_GUIDE.filter((s) => {
      const bucketOk = bucket === "All" || s.priceBucket === bucket;
      const queryOk =
        !q ||
        s.shopName.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.hubLocation.toLowerCase().includes(q);
      return bucketOk && queryOk;
    });
  }, [query, bucket]);

  function bookEscort(id: string, shopName: string) {
    setBookedIds((prev) => [...prev, id]);
    toast(
      `Store escort booked for ${shopName}! Your local shopping guide will WhatsApp you shortly.`,
      "success",
    );
  }

  return (
    <PageContainer>
      <ModuleHeader
        moduleLabel="Module 02"
        badgeTone="rose"
        title="🛍️ Local Shopping Discovery"
        description="AI-curated hyperlocal shopping trails with verified addresses, honest price buckets and on-ground store escorts."
      />

      <FeaturedGuideBanner />

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search shops, specialties (e.g. Zardozi, Organza)…"
        />
        <PillTabs
          options={PRICE_BUCKETS}
          value={bucket}
          onChange={setBucket}
          size="sm"
          activeClassName="bg-stone-900 text-amber-50 shadow"
        />
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {filtered.map((shop, i) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            booked={bookedIds.includes(shop.id)}
            onBookEscort={bookEscort}
            animationDelayMs={i * 60}
          />
        ))}
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🔎"
          title="No shops match your search."
          hint='Try "Zardozi", "Organza" or clear the budget filter.'
        />
      ) : null}
    </PageContainer>
  );
}
