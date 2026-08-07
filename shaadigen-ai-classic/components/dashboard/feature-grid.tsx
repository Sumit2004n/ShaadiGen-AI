import { DASHBOARD_FEATURES } from "@/lib/constants/dashboard-features";
import { BudgetCalculatorWidget } from "@/components/dashboard/budget-calculator-widget";
import { FeatureCard } from "@/components/dashboard/feature-card";

export function FeatureGrid() {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
        Five AI modules. One dream wedding.
      </h2>
      <p className="mt-1 text-stone-500">
        Jump into any module — everything stays in sync with your budget.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_FEATURES.map((feature, i) => (
          <FeatureCard
            key={feature.href}
            {...feature}
            animationDelayMs={i * 70}
          />
        ))}
        <BudgetCalculatorWidget />
      </div>
    </section>
  );
}
