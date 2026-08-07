import {
  Handshake,
  Music,
  Palette,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardFeature = {
  href: string;
  emoji: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  iconColor: string;
};

export const DASHBOARD_FEATURES: DashboardFeature[] = [
  {
    href: "/vendors",
    emoji: "🤝",
    icon: Handshake,
    title: "Budget Vendor Matchmaker",
    desc: "Slide your budget and let AI shortlist verified photographers, caterers, decorators & MUAs — with pre-negotiated deals.",
    accent: "from-amber-100 to-amber-50 border-amber-200 hover:border-amber-400",
    iconColor: "text-amber-600",
  },
  {
    href: "/shopping-hub",
    emoji: "🛍️",
    icon: ShoppingBag,
    title: "Local Shopping Discovery",
    desc: "Curated Chandni Chowk lehenga guide — Asiana Couture, Om Prakash Jawahar Lal & hidden gems, filtered by your budget.",
    accent: "from-rose-100 to-rose-50 border-rose-200 hover:border-rose-400",
    iconColor: "text-rose-600",
  },
  {
    href: "/ai-studio",
    emoji: "🎨",
    icon: Palette,
    title: "AI Visual Studio",
    desc: "Virtual outfit try-on with lighting simulation, plus a 4K pre-wedding photoshoot generator in dream destinations.",
    accent:
      "from-emerald-100 to-emerald-50 border-emerald-200 hover:border-emerald-400",
    iconColor: "text-emerald-600",
  },
  {
    href: "/media-suite",
    emoji: "🎵",
    icon: Music,
    title: "AI Media Suite",
    desc: "Generate a custom love song from your story and design animated invitation cards — export straight to WhatsApp.",
    accent: "from-amber-100 to-rose-50 border-amber-200 hover:border-rose-400",
    iconColor: "text-amber-700",
  },
  {
    href: "/guest-hub",
    emoji: "💒",
    icon: Users,
    title: '"Join My Wedding" Guest Portal',
    desc: "A shareable guest hub with event schedules, multicultural ritual explainers in 4 languages, and one-tap RSVP.",
    accent:
      "from-emerald-100 to-amber-50 border-emerald-200 hover:border-emerald-400",
    iconColor: "text-emerald-700",
  },
];
