import { Newspaper } from "lucide-react";

export function FeaturedGuideBanner() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Newspaper className="h-6 w-6 text-rose-600" />
        <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Featured Guide
        </span>
      </div>
      <h2 className="font-serif mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
        Top 10 Chandni Chowk Lehenga Shops
        <span className="text-rose-600"> (2026 Discovery Guide)</span>
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
        Old Delhi&apos;s legendary bridal bazaar, decoded by AI — from
        century-old Banarasi silk houses in Kucha Mahajani to Instagram-famous
        pastel organza ateliers in Katra Babel. Every shop below is geo-verified
        with real addresses, crowd-sourced ratings and bargaining intel.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
          📍 Dariba Kalan
        </span>
        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
          📍 Kinari Bazar
        </span>
        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
          📍 Katra Neel
        </span>
        <span className="rounded-full bg-white px-3 py-1 shadow-sm">
          📍 Kucha Mahajani
        </span>
      </div>
    </section>
  );
}
