"use client";

import { BUDGET_ALLOCATION } from "@/lib/mock-data";
import { useBudget } from "@/components/budget-context";
import { formatINR } from "@/lib/utils";

export function BudgetCalculatorWidget() {
  const { budget, setBudget } = useBudget();

  return (
    <div className="animate-fade-up rounded-2xl border border-stone-300 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-900">
          💰 Live Budget Calculator
        </h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
          {formatINR(budget)}
        </span>
      </div>
      <input
        type="range"
        min={500000}
        max={10000000}
        step={100000}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="gold-slider mt-4 w-full"
        aria-label="Total wedding budget"
      />
      <div className="mt-1 flex justify-between text-xs text-stone-400">
        <span>₹5L</span>
        <span>₹1 Cr</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {BUDGET_ALLOCATION.map((row) => (
          <li key={row.label}>
            <div className="flex items-center justify-between text-xs font-medium text-stone-600">
              <span>
                {row.emoji} {row.label}
              </span>
              <span className="font-bold text-stone-800">
                {formatINR((budget * row.pct) / 100)}{" "}
                <span className="font-normal text-stone-400">({row.pct}%)</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${row.pct * 3}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
