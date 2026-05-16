# My Siblings

> A lifetime platform for belonging — turning loneliness into connection, one sibling at a time.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** primitives
- **framer-motion** for accessible motion
- **lucide-react** for iconography

## Project structure

```
.
├── app/                     # Next.js App Router routes
│   ├── layout.tsx           # Root layout (html/body, metadata)
│   ├── page.tsx             # Home / landing page (the Index)
│   ├── globals.css          # Tailwind directives + design tokens
│   ├── adult-safe-place/    # Pillar route: 18+ safe space
│   ├── sibling-connect/     # Pillar route: youth + general community
│   ├── inclusive-support-hub/  # Pillar route: disability inclusion
│   ├── crisis/              # High-visibility crisis support
│   ├── contact/
│   ├── match/
│   ├── volunteer/
│   └── corporate-partnership/
├── components/
│   ├── ui/                  # shadcn primitives (Button, etc.)
│   ├── home/                # (reserved) per-section landing-page components
│   ├── HeroVideo.tsx        # Landing hero (real-human video)
│   └── MatchingAlgorithmFlow.tsx
├── lib/
│   └── utils.ts             # cn() helper
└── hooks/                   # (reserved) shared React hooks
```

## Getting started

```bash
npm install
npm run migrate     # One-time schema setup (creates tables & columns)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run migrate` — run MySQL schema migrations (one-time setup)
- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint with Next ESLint config
- `npm run typecheck` — TypeScript-only check

## Roadmap — Quick-Wins Status

- [x] Split `app/page.tsx` into per-section components under `components/home/`
- [x] Honour `prefers-reduced-motion` via `useConsistentReducedMotion`
- [x] Crisis Support routed to dedicated `/crisis` page
- [x] Remove unused imports (ongoing)
- [ ] Fix dynamic Tailwind class names in pillar cards
- [ ] Make pillar cards fully clickable + add `focus-visible` states
- [ ] Mark decorative icons / gradients `aria-hidden`; label star ratings
- [ ] Replace fabricated marketing metrics with real data or TODO markers
