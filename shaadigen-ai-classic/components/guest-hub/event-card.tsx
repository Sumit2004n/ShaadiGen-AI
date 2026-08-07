import { Calendar, ChevronDown, Clock, Languages, MapPin, Shirt } from "lucide-react";
import { RITUAL_EXPLAINERS, type ExplainerLanguage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { EventDetail } from "@/types/wedding";

type EventCardProps = {
  event: EventDetail;
  emoji: string;
  accent: string;
  language: ExplainerLanguage;
  open: boolean;
  onToggle: () => void;
  animationDelayMs?: number;
};

export function EventCard({
  event,
  emoji,
  accent,
  language,
  open,
  onToggle,
  animationDelayMs = 0,
}: EventCardProps) {
  return (
    <article
      className={`animate-fade-up rounded-2xl border bg-gradient-to-r p-5 shadow-sm transition-all hover:shadow-md sm:p-6 ${accent}`}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{event.name}</h3>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {event.time}
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all",
            open
              ? "bg-stone-900 text-amber-50 shadow"
              : "border border-stone-400/50 bg-white/70 text-stone-700 hover:bg-white",
          )}
          aria-expanded={open}
        >
          <Languages className="h-3.5 w-3.5" />
          Multicultural Explainer
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-600">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {event.venue}
        </span>
        <span className="flex items-center gap-1">
          <Shirt className="h-3.5 w-3.5" /> Dress code: {event.dressCode}
        </span>
      </div>

      {open ? (
        <div className="animate-fade-up mt-4 rounded-xl border border-white/80 bg-white/80 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {language} · Ritual Meaning
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
            {RITUAL_EXPLAINERS[event.name]?.[language] ?? event.culturalMeaning}
          </p>
        </div>
      ) : null}
    </article>
  );
}
