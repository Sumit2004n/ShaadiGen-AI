import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_TONES = {
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
  emerald: "bg-emerald-100 text-emerald-800",
} as const;

type ModuleHeaderProps = {
  moduleLabel: string;
  title: string;
  description?: string;
  badgeTone?: keyof typeof BADGE_TONES;
  centered?: boolean;
};

export function ModuleHeader({
  moduleLabel,
  title,
  description,
  badgeTone = "amber",
  centered = false,
}: ModuleHeaderProps) {
  return (
    <section className={cn("mt-8", centered && "text-center")}>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
          BADGE_TONES[badgeTone],
        )}
      >
        <Sparkles className="h-3.5 w-3.5" /> {moduleLabel}
      </span>
      <h1 className="font-serif mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-2 max-w-2xl text-stone-500",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </section>
  );
}
