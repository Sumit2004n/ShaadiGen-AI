import { Check, Sun } from "lucide-react";
import { LIGHTING, type LightingOption } from "@/lib/constants/ai-studio";
import { cn } from "@/lib/utils";

type LightingPickerProps = {
  selected: LightingOption;
  onSelect: (lighting: LightingOption) => void;
};

export function LightingPicker({ selected, onSelect }: LightingPickerProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500">
        <Sun className="h-4 w-4" /> Lighting Mode
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {LIGHTING.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5",
              selected.id === option.id
                ? "border-amber-500 bg-amber-50 text-stone-900 shadow-md"
                : "border-stone-200 bg-white text-stone-600 hover:border-amber-300",
            )}
          >
            <span className="text-xl">{option.icon}</span> {option.name}
            {selected.id === option.id ? (
              <Check className="ml-auto h-4 w-4 text-amber-600" />
            ) : null}
          </button>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-500">
        💡 The simulator re-lights the fabric in real time so you can see how
        your outfit photographs at each event — golden-hour haldi, spotlight
        sangeet or a diya-lit night mandap.
      </p>
    </div>
  );
}
