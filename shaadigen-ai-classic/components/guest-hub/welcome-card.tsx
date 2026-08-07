"use client";

import { useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { AudioEqBars } from "@/components/ui/audio-eq-bars";
import { useToast } from "@/components/toast";

export function WelcomeCard() {
  const toast = useToast();
  const [greetingPlaying, setGreetingPlaying] = useState(false);

  function playGreeting() {
    if (greetingPlaying) return;
    setGreetingPlaying(true);
    toast(
      "Playing: “Namaste! Aarav & Meera can't wait to celebrate with you…” 🔊",
      "ai",
    );
    setTimeout(() => setGreetingPlaying(false), 4000);
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 p-8 text-center shadow-sm">
      <p className="text-5xl">🙏</p>
      <h2 className="font-serif mt-4 text-2xl font-bold text-stone-900 sm:text-3xl">
        Namaste! You&apos;re invited to
        <br />
        <span className="bg-gradient-to-r from-amber-600 via-rose-500 to-emerald-600 bg-clip-text text-transparent">
          Aarav & Meera&apos;s Wedding
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-stone-600">
        20–22 November 2026 · New Delhi, India. Three days of colour, music and
        rituals — this portal explains everything, in your language.
      </p>
      <button
        type="button"
        onClick={playGreeting}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-amber-50 shadow transition-all hover:-translate-y-0.5 hover:bg-stone-700"
      >
        {greetingPlaying ? (
          <>
            <Volume2 className="h-4 w-4 animate-pulse text-amber-300" />
            Playing greeting…
          </>
        ) : (
          <>
            <Play className="h-4 w-4" /> Play Audio Greeting from the Couple
          </>
        )}
      </button>
      {greetingPlaying ? (
        <AudioEqBars
          heights={[60, 90, 45, 80, 55, 95, 70, 85, 50, 75]}
          active
          className="mt-4 h-8"
          barClassName="w-1.5 from-amber-500 to-rose-400"
        />
      ) : null}
    </section>
  );
}
