import { cn } from "@/lib/utils";

type AudioEqBarsProps = {
  heights: number[];
  active?: boolean;
  className?: string;
  barClassName?: string;
};

export function AudioEqBars({
  heights,
  active = true,
  className,
  barClassName,
}: AudioEqBarsProps) {
  return (
    <div className={cn("flex items-end justify-center gap-1", className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full bg-gradient-to-t from-rose-500 to-amber-400 transition-all duration-300",
            active && "eq-bar",
            barClassName,
          )}
          style={{
            height: active ? `${h}%` : "18%",
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}
