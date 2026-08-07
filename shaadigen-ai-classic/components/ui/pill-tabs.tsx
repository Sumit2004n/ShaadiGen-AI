import { cn } from "@/lib/utils";

export type PillTabOption<T extends string = string> = {
  key: T;
  label: string;
};

type PillTabsProps<T extends string> = {
  options: PillTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  activeClassName?: string;
};

export function PillTabs<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  activeClassName = "bg-stone-900 text-amber-50 shadow-md",
}: PillTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          className={cn(
            "rounded-full font-semibold transition-all",
            size === "sm" ? "px-3.5 py-2 text-xs" : "px-4 py-2 text-sm",
            value === option.key
              ? activeClassName
              : "border border-stone-300 bg-white text-stone-600 hover:border-amber-400 hover:text-stone-900",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
