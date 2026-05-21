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
│   ├── home/                # Landing-page sections (`HomePage.tsx`; legacy `LovableHome.tsx`)
│   ├── HeroVideo.tsx        # Landing hero (carousel: remote video + stills)
│   ├── HomeSafetyBanner.tsx
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

**Note:** This app uses PostgreSQL (not MySQL). The `pg` driver is configured via `PG_CONNECTION_STRING` or individual `PG_*` env vars (see `.env.example`). Supabase migrations in `supabase/migrations/` are legacy — the running schema is managed by `scripts/migrate.mjs`.

If you see **`ChunkLoadError`** / “Loading chunk … failed” after edits or crashes: stop dev, run **`npm run clean`**, start **`npm run dev`** again, then **hard refresh** (Ctrl+Shift+R). Avoid deleting `.next` while `npm run dev` is running, and keep only **one** dev server.

## Scripts

- `npm run migrate` — run PostgreSQL schema migrations (creates all tables)
- `npm run dev` — start the development server
- `npm run clean` — delete `.next` (fixes stale webpack chunks / ENOENT vendor-chunks)
- `npm run dev:fresh` — `clean` then `dev`
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint with Next ESLint config
- `npm run typecheck` — TypeScript-only check
- `npm test` — run Vitest test suite

## Roadmap — Quick-Wins Status

- [x] Split `app/page.tsx` into per-section components under `components/home/`
- [x] Honour `prefers-reduced-motion` via `useConsistentReducedMotion`
- [x] Crisis Support routed to dedicated `/crisis` page
- [x] Remove unused imports (ongoing)
- [x] Build matching engine with multi-step form + API + algorithm
- [x] Add public user registration (`/register`)
- [x] Comprehensive test suite (36+ tests covering matching, auth, rate-limit, CSRF, utils)
- [x] Update App Store links to use env vars
- [ ] Fix dynamic Tailwind class names in pillar cards
- [ ] Make pillar cards fully clickable + add `focus-visible` states
- [ ] Mark decorative icons / gradients `aria-hidden`; label star ratings
- [ ] Replace placeholder dashboard marketing metrics with real data or TODO markers
- [ ] Add i18n/localization (next-intl or similar)
