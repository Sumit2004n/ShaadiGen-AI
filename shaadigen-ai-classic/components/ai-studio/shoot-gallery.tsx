import { Download } from "lucide-react";
import type { ShootTheme } from "@/lib/constants/ai-studio";
import type { PreWeddingShoot } from "@/types/wedding";

type ShootGalleryProps = {
  shoot: PreWeddingShoot;
  theme: ShootTheme;
  onExport: () => void;
};

export function ShootGallery({ shoot, theme, onExport }: ShootGalleryProps) {
  return (
    <div className="animate-fade-up mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-stone-900">
          📸 {shoot.coupleNames} · {shoot.theme} — 4 Concept Portraits
        </h3>
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-all hover:border-emerald-400 hover:text-emerald-700"
        >
          <Download className="h-3.5 w-3.5" /> Export 4K Album
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {theme.palette.map((grad, i) => (
          <figure
            key={grad + i}
            className="animate-fade-up group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div
              className={`relative flex aspect-[3/4] items-center justify-center bg-gradient-to-br ${grad}`}
            >
              <span className="text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                {theme.emoji}
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                4K · AI
              </span>
              <div className="animate-shimmer pointer-events-none absolute inset-0" />
            </div>
            <figcaption className="p-3 text-xs font-semibold text-stone-700">
              {theme.captions[i]}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
