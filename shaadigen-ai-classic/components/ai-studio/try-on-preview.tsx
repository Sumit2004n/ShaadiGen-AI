import type { LightingOption, OutfitOption } from "@/lib/constants/ai-studio";

type TryOnPreviewProps = {
  outfit: OutfitOption;
  lighting: LightingOption;
};

export function TryOnPreview({ outfit, lighting }: TryOnPreviewProps) {
  return (
    <>
      <div
        className={`relative mt-4 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b transition-all duration-500 ${lighting.ambience}`}
      >
        <div
          className={`flex h-52 w-40 flex-col items-center justify-center rounded-t-full bg-gradient-to-b shadow-2xl transition-all duration-500 sm:h-64 sm:w-48 ${outfit.swatch}`}
        >
          <span className="text-6xl drop-shadow-lg">{outfit.emoji}</span>
          <span className="mt-3 max-w-[85%] text-center text-xs font-bold text-white drop-shadow">
            {outfit.name}
          </span>
        </div>
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-700 ${lighting.overlay}`}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {lighting.icon} {lighting.name}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-700">
          Live Preview
        </span>
      </div>
      <p className="mt-3 text-xs text-stone-500">✨ {outfit.note}</p>
    </>
  );
}
