import { Check, Loader2 } from "lucide-react";
import { GENERATION_STEPS } from "@/lib/constants/ai-studio";
import { cn } from "@/lib/utils";

type GenerationProgressProps = {
  stepIndex: number;
};

export function GenerationProgress({ stepIndex }: GenerationProgressProps) {
  return (
    <div className="animate-fade-up mt-6 rounded-2xl border border-emerald-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        <p className="text-sm font-bold text-stone-800">
          {GENERATION_STEPS[stepIndex]}
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700"
          style={{
            width: `${((stepIndex + 1) / GENERATION_STEPS.length) * 100}%`,
          }}
        />
      </div>
      <ul className="mt-4 space-y-1.5">
        {GENERATION_STEPS.map((step, i) => (
          <li
            key={step}
            className={cn(
              "flex items-center gap-2 text-xs",
              i < stepIndex
                ? "text-emerald-700"
                : i === stepIndex
                  ? "font-semibold text-stone-800"
                  : "text-stone-400",
            )}
          >
            {i < stepIndex ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <span className="inline-block h-3.5 w-3.5 rounded-full border border-stone-300" />
            )}
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
