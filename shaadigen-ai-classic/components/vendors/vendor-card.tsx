import { BadgeCheck, Bot, Gift, MapPin, Star } from "lucide-react";
import { GRADIENTS } from "@/lib/constants/gradients";
import { formatINR } from "@/lib/utils";
import type { Vendor } from "@/types/wedding";

type VendorCardProps = {
  vendor: Vendor;
  onNegotiate: (vendor: Vendor) => void;
  animationDelayMs?: number;
};

export function VendorCard({
  vendor,
  onNegotiate,
  animationDelayMs = 0,
}: VendorCardProps) {
  return (
    <article
      className="animate-fade-up group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div
        className={`relative flex h-36 items-end bg-gradient-to-br p-4 ${GRADIENTS[vendor.imageUrl] ?? GRADIENTS["gradient:amber"]}`}
      >
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow">
          <BadgeCheck className="h-3.5 w-3.5" /> Verified Pricing
        </span>
        <h3 className="text-xl font-bold text-white drop-shadow-md">
          {vendor.name}
        </h3>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-stone-500">
            <MapPin className="h-4 w-4" /> {vendor.location}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {vendor.rating}{" "}
            <span className="font-normal text-amber-700/70">
              ({vendor.reviewsCount})
            </span>
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-stone-800">
          {formatINR(vendor.priceRange.min)} – {formatINR(vendor.priceRange.max)}
          {vendor.category === "Caterer" && (
            <span className="font-normal text-stone-500"> / plate</span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vendor.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <Gift className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>AI-Negotiated Perk:</strong> {vendor.negotiatedDeal}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNegotiate(vendor)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Bot className="h-4 w-4" /> Negotiate Quote via AI
        </button>
      </div>
    </article>
  );
}
