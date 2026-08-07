import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type FeatureCardProps = {
  href: string;
  emoji: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  iconColor: string;
  animationDelayMs?: number;
};

export function FeatureCard({
  href,
  emoji,
  icon: Icon,
  title,
  desc,
  accent,
  iconColor,
  animationDelayMs = 0,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`animate-fade-up group rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${accent}`}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{emoji}</span>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800">
        Open module{" "}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
