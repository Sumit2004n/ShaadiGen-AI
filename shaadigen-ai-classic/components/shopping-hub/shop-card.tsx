import { MapPin, Navigation, ShieldCheck, Star } from "lucide-react";
import { GRADIENTS } from "@/lib/constants/gradients";
import { cn } from "@/lib/utils";
import type { ShoppingGuideItem } from "@/types/wedding";

type ShopCardProps = {
  shop: ShoppingGuideItem;
  booked: boolean;
  onBookEscort: (id: string, shopName: string) => void;
  animationDelayMs?: number;
};

export function ShopCard({
  shop,
  booked,
  onBookEscort,
  animationDelayMs = 0,
}: ShopCardProps) {
  return (
    <article
      className="animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:flex-row"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div
        className={`flex min-h-32 items-center justify-center bg-gradient-to-br text-5xl sm:w-36 sm:shrink-0 ${GRADIENTS[shop.image] ?? GRADIENTS["gradient:rose"]}`}
      >
        👗
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-stone-900">{shop.shopName}</h3>
            <p className="flex items-center gap-1 text-xs text-stone-500">
              <MapPin className="h-3.5 w-3.5" /> {shop.hubLocation}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {shop.rating}
          </span>
        </div>
        <span className="mt-2 w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
          {shop.priceBucket}
        </span>
        <p className="mt-2 text-sm font-medium text-stone-700">
          ✨ {shop.specialty}
        </p>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-stone-500">
          &ldquo;{shop.featuredArticleSnippet}&rdquo;
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-stone-500">
          <Navigation className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
          {shop.address}
        </p>
        <button
          type="button"
          disabled={booked}
          onClick={() => onBookEscort(shop.id, shop.shopName)}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
            booked
              ? "cursor-default bg-emerald-100 text-emerald-800"
              : "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow hover:-translate-y-0.5 hover:shadow-lg",
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          {booked ? "Escort Booked ✓" : "Book Store Escort"}
        </button>
      </div>
    </article>
  );
}
