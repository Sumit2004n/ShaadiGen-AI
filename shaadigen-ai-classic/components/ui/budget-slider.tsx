import { formatINR } from "@/lib/utils";

type BudgetSliderProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showTicks?: boolean;
  tickLabels?: [string, string] | [string, string, string];
  hint?: React.ReactNode;
  valueTone?: "dark" | "emerald";
};

export function BudgetSlider({
  id = "budget-slider",
  value,
  onChange,
  min = 500000,
  max = 10000000,
  step = 100000,
  label = "Total Wedding Budget",
  showTicks = true,
  tickLabels = ["₹5 Lakhs", "₹50L", "₹1 Crore"],
  hint,
  valueTone = "dark",
}: BudgetSliderProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-stone-700">
          {label}
        </label>
        <span
          className={
            valueTone === "emerald"
              ? "rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800"
              : "rounded-full bg-stone-900 px-4 py-1.5 text-lg font-bold text-amber-300"
          }
        >
          {formatINR(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="gold-slider mt-4 w-full"
        aria-label={label}
      />
      {showTicks ? (
        <div className="mt-1 flex justify-between text-xs font-medium text-stone-400">
          {tickLabels.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      ) : null}
      {hint ? <div className="mt-3 text-xs text-stone-500">{hint}</div> : null}
    </section>
  );
}
