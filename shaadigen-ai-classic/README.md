# 💍 ShaadiGen AI (Classic)

Interactive MVP web prototype for a Generative AI-powered Indian wedding platform.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **lucide-react**. AI behaviour is simulated client-side with realistic loaders.

## Modules

| Route | Module |
| --- | --- |
| `/` | Landing dashboard with hero, feature cards & live budget calculator |
| `/vendors` | Budget Vendor Matchmaker |
| `/shopping-hub` | Local Shopping Discovery |
| `/ai-studio` | AI Visual Studio (try-on + pre-wedding shoot) |
| `/media-suite` | AI Media Suite (love song + invite studio) |
| `/guest-hub` | Guest Portal (rituals + RSVP) |

## Component structure

Pages are thin orchestrators. UI lives under `components/` by domain:

```
components/
├── layout/          # PageContainer, ModuleHeader, SiteFooter
├── ui/              # BudgetSlider, PillTabs, Modal, EmptyState, SearchInput, AudioEqBars
├── dashboard/       # Hero, FeatureGrid, BudgetCalculatorWidget
├── vendors/         # VendorCard, NegotiationModal
├── shopping-hub/    # FeaturedGuideBanner, ShopCard
├── ai-studio/       # VirtualTryOnSection, PreWeddingShootSection, …
├── media-suite/     # LoveSongSection, InvitationStudioSection, …
├── guest-hub/       # WelcomeCard, EventScheduleSection, RsvpSection
├── navbar.tsx
├── budget-context.tsx
└── toast.tsx

lib/
├── constants/       # Module configs (features, outfits, genres, …)
├── vendors/         # Budget allocation helpers
├── media-suite/     # Lyrics builder
└── mock-data.ts
```

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL` points at the FastAPI backend (default `http://localhost:8000`).
