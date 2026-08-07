import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export function DashboardHero() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
          <Sparkles className="h-3.5 w-3.5" /> Multimodal GenAI · Weddings
        </span>
        <h1 className="font-serif mt-6 text-4xl font-bold leading-tight text-amber-50 sm:text-6xl">
          Reimagining Indian Weddings
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300 bg-clip-text text-transparent">
            with Multimodal AI
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-stone-300 sm:text-lg">
          From budget-matched vendors and Chandni Chowk shopping trails to
          AI-generated pre-wedding shoots, custom love songs and multilingual
          guest experiences — plan your entire shaadi in one place.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/vendors"
            className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-amber-400/40"
          >
            Start Planning{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/ai-studio"
            className="inline-flex items-center gap-2 rounded-full border border-stone-500 px-6 py-3 text-sm font-semibold text-stone-200 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-200"
          >
            <Heart className="h-4 w-4 text-rose-400" /> Try the AI Studio
          </Link>
        </div>
      </div>
    </section>
  );
}
