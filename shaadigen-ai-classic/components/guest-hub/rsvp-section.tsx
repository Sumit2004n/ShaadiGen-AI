"use client";

import { useState } from "react";
import { Check, PartyPopper, Users } from "lucide-react";
import { useToast } from "@/components/toast";
import { DIETARY_OPTIONS } from "@/lib/constants/guest-hub";
import { cn } from "@/lib/utils";

type Attending = "yes" | "no" | "maybe";

export function RsvpSection() {
  const toast = useToast();
  const [attending, setAttending] = useState<Attending | null>(null);
  const [dietary, setDietary] = useState(DIETARY_OPTIONS[0]);
  const [guestCount, setGuestCount] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    if (!attending) {
      toast("Please select your attending status first!", "info");
      return;
    }
    setSubmitted(true);
    toast(
      attending === "yes"
        ? `RSVP confirmed for ${guestCount} guest${guestCount > 1 ? "s" : ""}! See you at the shaadi 🎉`
        : "RSVP recorded — you'll be missed! 💌",
      "success",
    );
  }

  return (
    <section className="mt-10 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900 sm:text-2xl">
        <PartyPopper className="h-6 w-6 text-rose-500" /> RSVP
      </h2>
      {submitted ? (
        <div className="animate-fade-up mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center">
          <p className="text-5xl">🎊</p>
          <h3 className="mt-3 text-lg font-bold text-emerald-900">
            Shukriya! Your RSVP is in.
          </h3>
          <p className="mt-1 text-sm text-emerald-800">
            {attending === "yes"
              ? `${guestCount} guest${guestCount > 1 ? "s" : ""} · ${dietary} meals reserved. Watch WhatsApp for your personalized itinerary!`
              : "We've let the couple know. You'll still receive the highlights album!"}
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 rounded-full border border-emerald-400 px-4 py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100"
          >
            Edit my RSVP
          </button>
        </div>
      ) : (
        <form onSubmit={submitRsvp} className="mt-6 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Will you be attending?
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  {
                    key: "yes" as const,
                    label: "🎉 Joyfully Accept",
                    ring: "border-emerald-500 bg-emerald-50 text-emerald-900",
                  },
                  {
                    key: "maybe" as const,
                    label: "🤔 Might Attend",
                    ring: "border-amber-500 bg-amber-50 text-amber-900",
                  },
                  {
                    key: "no" as const,
                    label: "💌 Regretfully Decline",
                    ring: "border-rose-500 bg-rose-50 text-rose-900",
                  },
                ]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAttending(opt.key)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5",
                    attending === opt.key
                      ? `${opt.ring} shadow-md`
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400",
                  )}
                >
                  {opt.label}
                  {attending === opt.key ? <Check className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dietary"
                className="text-xs font-bold uppercase tracking-wider text-stone-500"
              >
                Dietary Preference
              </label>
              <select
                id="dietary"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              >
                {DIETARY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="guest-count"
                className="text-xs font-bold uppercase tracking-wider text-stone-500"
              >
                Number of Guests
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                  className="h-10 w-10 rounded-xl border border-stone-300 text-lg font-bold text-stone-700 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                  aria-label="Decrease guest count"
                >
                  −
                </button>
                <span
                  id="guest-count"
                  className="flex h-10 min-w-16 items-center justify-center rounded-xl bg-stone-100 px-4 text-sm font-bold text-stone-900"
                >
                  <Users className="mr-1.5 h-4 w-4 text-stone-500" />
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                  className="h-10 w-10 rounded-xl border border-stone-300 text-lg font-bold text-stone-700 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                  aria-label="Increase guest count"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <PartyPopper className="h-4 w-4" /> Submit RSVP
          </button>
        </form>
      )}
    </section>
  );
}
