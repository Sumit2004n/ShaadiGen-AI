"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Wand2 } from "lucide-react";
import { GenerationProgress } from "@/components/ai-studio/generation-progress";
import { ShootGallery } from "@/components/ai-studio/shoot-gallery";
import { useToast } from "@/components/toast";
import {
  GENERATION_STEPS,
  THEMES,
  type ShootTheme,
} from "@/lib/constants/ai-studio";
import { cn } from "@/lib/utils";
import type { PreWeddingShoot } from "@/types/wedding";

export function PreWeddingShootSection() {
  const toast = useToast();
  const [coupleNames, setCoupleNames] = useState("Aarav & Meera");
  const [theme, setTheme] = useState<ShootTheme>(THEMES[0]);
  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [shoot, setShoot] = useState<PreWeddingShoot | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function generateShoot() {
    if (!coupleNames.trim()) {
      toast("Please enter the couple's names first!", "info");
      return;
    }
    setGenerating(true);
    setShoot(null);
    setStepIndex(0);

    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step < GENERATION_STEPS.length) {
        setStepIndex(step);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setGenerating(false);
        setShoot({
          id: `shoot-${Date.now()}`,
          coupleNames: coupleNames.trim(),
          theme: theme.name,
          generatedImages: [...theme.captions],
        });
        toast("4K Pre-Wedding Photoshoot generated! 🎉", "ai");
      }
    }, 750);
  }

  return (
    <section className="mt-10 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
        <Camera className="h-5 w-5 text-emerald-600" /> AI Pre-Wedding Shoot
        Generator
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        Upload two selfies (simulated) and teleport to a dream destination.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <label
            htmlFor="couple-names"
            className="text-xs font-bold uppercase tracking-wider text-stone-500"
          >
            Couple Names
          </label>
          <input
            id="couple-names"
            type="text"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            placeholder="e.g. Aarav & Meera"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={generateShoot}
            disabled={generating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {generating ? "Generating…" : "Generate 4K Pre-Wedding Photoshoot"}
          </button>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Theme
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {THEMES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option)}
                className={cn(
                  "rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5",
                  theme.id === option.id
                    ? "border-emerald-500 bg-white shadow-md"
                    : "border-stone-200 bg-white/60 hover:border-emerald-300",
                )}
              >
                <div
                  className={`flex h-14 items-center justify-center rounded-lg bg-gradient-to-br text-2xl ${option.palette[0]}`}
                >
                  {option.emoji}
                </div>
                <p className="mt-2 text-xs font-bold text-stone-800">
                  {option.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {generating ? <GenerationProgress stepIndex={stepIndex} /> : null}
      {shoot && !generating ? (
        <ShootGallery
          shoot={shoot}
          theme={theme}
          onExport={() => toast("4K album exported to your gallery!", "success")}
        />
      ) : null}
    </section>
  );
}
