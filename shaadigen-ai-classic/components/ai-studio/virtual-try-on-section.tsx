"use client";

import { useState } from "react";
import { Shirt } from "lucide-react";
import { LightingPicker } from "@/components/ai-studio/lighting-picker";
import { OutfitPicker } from "@/components/ai-studio/outfit-picker";
import { TryOnPreview } from "@/components/ai-studio/try-on-preview";
import { useToast } from "@/components/toast";
import {
  LIGHTING,
  OUTFITS,
  type LightingOption,
  type OutfitOption,
} from "@/lib/constants/ai-studio";

export function VirtualTryOnSection() {
  const toast = useToast();
  const [outfit, setOutfit] = useState<OutfitOption>(OUTFITS[0]);
  const [lighting, setLighting] = useState<LightingOption>(LIGHTING[0]);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-5">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
          <Shirt className="h-5 w-5 text-rose-500" /> Virtual Try-On & Lighting
          Simulator
        </h2>
        <TryOnPreview outfit={outfit} lighting={lighting} />
      </div>

      <div className="flex flex-col gap-5 lg:col-span-3">
        <OutfitPicker
          selected={outfit}
          onSelect={(next) => {
            setOutfit(next);
            toast(`Draped: ${next.name}`, "info");
          }}
        />
        <LightingPicker selected={lighting} onSelect={setLighting} />
      </div>
    </section>
  );
}
