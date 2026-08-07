"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { InviteCardPreview } from "@/components/media-suite/invite-card-preview";
import { useToast } from "@/components/toast";
import {
  THEME_COLORS,
  type InviteThemeColor,
} from "@/lib/constants/media-suite";
import { cn } from "@/lib/utils";
import type { AIInviteCard } from "@/types/wedding";

export function InvitationStudioSection() {
  const toast = useToast();
  const [inviteNames, setInviteNames] = useState("Aarav & Meera");
  const [inviteDate, setInviteDate] = useState("Sunday, 22 November 2026");
  const [inviteVenue, setInviteVenue] = useState(
    "Lotus Mandap, ITC Maurya, New Delhi",
  );
  const [themeColor, setThemeColor] = useState<InviteThemeColor>(THEME_COLORS[0]);

  const inviteCard: AIInviteCard = {
    id: "invite-1",
    coupleNames: inviteNames || "Your Names",
    eventDate: inviteDate || "Date TBD",
    venue: inviteVenue || "Venue TBD",
    themeColor: themeColor.id,
    personalizedAudioGreeting: "mock://shaadigen/greeting.mp3",
  };

  return (
    <section className="mt-10 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
        <Heart className="h-5 w-5 text-rose-500" /> AI Invitation Card Studio
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        The card updates live as you type. Includes a personalized AI voice
        greeting for every guest.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="inv-names"
              className="text-xs font-bold uppercase tracking-wider text-stone-500"
            >
              Couple Names
            </label>
            <input
              id="inv-names"
              type="text"
              value={inviteNames}
              onChange={(e) => setInviteNames(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label
              htmlFor="inv-date"
              className="text-xs font-bold uppercase tracking-wider text-stone-500"
            >
              Event Date
            </label>
            <input
              id="inv-date"
              type="text"
              value={inviteDate}
              onChange={(e) => setInviteDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label
              htmlFor="inv-venue"
              className="text-xs font-bold uppercase tracking-wider text-stone-500"
            >
              Venue
            </label>
            <input
              id="inv-venue"
              type="text"
              value={inviteVenue}
              onChange={(e) => setInviteVenue(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Theme Color
            </p>
            <div className="mt-1.5 flex gap-2">
              {THEME_COLORS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeColor(theme)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-xs font-semibold transition-all",
                    themeColor.id === theme.id
                      ? "bg-stone-900 text-amber-50 shadow"
                      : "border border-stone-300 bg-white text-stone-600 hover:border-amber-400",
                  )}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              toast(
                `Invite for ${inviteCard.coupleNames} exported to WhatsApp with AI voice greeting! 📲`,
                "success",
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" /> Export to WhatsApp
          </button>
        </div>

        <InviteCardPreview
          invite={inviteCard}
          theme={themeColor}
          onPlayGreeting={() =>
            toast(
              "Playing AI voice greeting: “Namaste! You're invited…” 🔊",
              "ai",
            )
          }
        />
      </div>
    </section>
  );
}
