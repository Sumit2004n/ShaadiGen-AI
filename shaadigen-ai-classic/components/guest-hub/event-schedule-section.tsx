"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { EventCard } from "@/components/guest-hub/event-card";
import { EVENT_STYLES, LANGUAGES } from "@/lib/constants/guest-hub";
import { EVENTS, type ExplainerLanguage } from "@/lib/mock-data";

export function EventScheduleSection() {
  const [language, setLanguage] = useState<ExplainerLanguage>("English");
  const [openExplainers, setOpenExplainers] = useState<string[]>([]);

  function toggleExplainer(name: string) {
    setOpenExplainers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  return (
    <>
      <section className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-stone-900 sm:text-2xl">
          📅 Event Schedule & Ritual Guide
        </h2>
        <label className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm">
          <Languages className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold text-stone-500">
            Explainer language:
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ExplainerLanguage)}
            className="bg-transparent text-sm font-bold text-stone-800 outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="mt-5 space-y-4">
        {EVENTS.map((event, i) => {
          const style = EVENT_STYLES[event.name] ?? EVENT_STYLES.Haldi;
          return (
            <EventCard
              key={event.id}
              event={event}
              emoji={style.emoji}
              accent={style.accent}
              language={language}
              open={openExplainers.includes(event.name)}
              onToggle={() => toggleExplainer(event.name)}
              animationDelayMs={i * 70}
            />
          );
        })}
      </section>
    </>
  );
}
