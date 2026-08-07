import { OUTFITS, type OutfitOption } from "@/lib/constants/ai-studio";
import { cn } from "@/lib/utils";

type OutfitPickerProps = {
  selected: OutfitOption;
  onSelect: (outfit: OutfitOption) => void;
};

export function OutfitPicker({ selected, onSelect }: OutfitPickerProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
        Select Outfit Style
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {OUTFITS.map((outfit) => (
          <button
            key={outfit.id}
            type="button"
            onClick={() => onSelect(outfit)}
            className={cn(
              "rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5",
              selected.id === outfit.id
                ? "border-rose-500 bg-rose-50 shadow-md"
                : "border-stone-200 bg-white hover:border-rose-300",
            )}
          >
            <div
              className={`h-10 w-full rounded-lg bg-gradient-to-r ${outfit.swatch}`}
            />
            <p className="mt-2 text-xs font-bold text-stone-800">
              {outfit.emoji} {outfit.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
