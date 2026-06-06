# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-06
**Commit:** inspect locally with `git rev-parse --short HEAD`
**Branch:** inspect locally with `git branch --show-current`

## OVERVIEW

ClearKorea is an AGPL-3.0-only civic-tech platform for lawful online participation, rally support, livestream aggregation, verified posts, and foreign press tracking around Korean election transparency. This repository is the v1 planning/prototype baseline: product docs, SVG-first brand assets, one portable React JSX widget, one feed config, and one Node feed-liveness checker.

## STRUCTURE

```text
clearkorea/
├── README.md          # English product summary and operating principles
├── README.ko.md       # Korean product summary; keep in sync with README.md
├── PLAN.md            # Source of truth for v1 scope, stack, safety, data model
├── IMAGE.md           # Prompts and rules for raster brand/marketing assets
├── assets/            # SVG/PNG/JPG brand, PWA, OG, and SNS assets
├── config/
│   └── feeds.json     # Foreign press feed and keyword-filter config
├── prototypes/
│   └── affected-stations/
│       └── AffectedStations.jsx  # Portable React affected-polling-stations board
└── scripts/
    └── check-feeds.mjs           # Node 18+ RSS/Google News liveness checker
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Product scope and architecture | `PLAN.md` | Planned stack is Next.js 16.2, React 19, TypeScript, Tailwind, Supabase, Vercel, Cloudflare, PostHog, pnpm. |
| User-facing copy and principles | `README.md`, `README.ko.md` | Keep English/Korean meaning aligned when editing product claims. |
| Brand assets and generation rules | `IMAGE.md`, `assets/` | SVG-first for app/docs/open-source surfaces; raster only for PWA/OG/SNS/marketing needs. |
| Affected polling station UI | `prototypes/affected-stations/AffectedStations.jsx` | Self-contained JSX component with inline CSS and hardcoded station data. |
| Foreign press feed validation | `config/feeds.json`, `scripts/check-feeds.mjs` | `checked: true` feeds are required and make the checker fail if dead. |

## IMPLEMENTATION BASELINE

- There is no `package.json`, framework config, local dev server, or test runner in this workspace.
- `PLAN.md` describes the v1 production app; do not assume framework dependencies exist until they are scaffolded.
- `src/` is reserved for the future Next.js app scaffold. Keep pre-scaffold prototypes, scripts, and config outside `src/`.
- If `AGENTS.local.md` exists, read it for local-only service/project context. It is ignored by git and must not be committed.
- `prototypes/affected-stations/AffectedStations.jsx` is written as a component to port into the app. Keep `STATIONS`, `SUMMARY`, and `UPDATED_AT` easy to extract into data files or a DB table.
- `scripts/check-feeds.mjs` has no external dependencies and relies on Node 18+ global `fetch`.
- No child `AGENTS.md` files are warranted yet; current subdirectories are small and root guidance covers them.

## CONVENTIONS

- Korean civic copy should avoid stating "organized election fraud" as established fact. Use investigation, recurrence prevention, election transparency, and fair re-vote framing.
- Keep safety language explicit: no doxxing, no tracking specific individuals, no organizing unlawful acts, no private retaliation.
- For Seoul crowd data, label it as regional real-time congestion, not rally headcount.
- For affected polling stations, keep the disclaimer that the list summarizes confirmed administrative failures and does not itself prove election fraud.
- UI labels in the planned app bottom dock are English-only: `Home`, `Rallies`, `Square`, `Live`, `News`.
- Brand palette is dark civic-tech: `#0A0A0A`, white, Korean-flag red `#CD2E3A`, and Korean-flag blue `#0047A0`; use red/blue as accents.
- Brand direction is SVG-first. Use `assets/readme-banner.svg` and `assets/pwa-icon.svg` as the clean vector style references.
- Preserve generated asset names from `PLAN.md` and `IMAGE.md`: `pwa-icon.svg`, `pwa-icon.png`, `pwa-icon.jpg`, `hero.png`, `hero-mobile.png`, `splash.png`, `og.png`, `readme-banner.svg`, `square.png`, `ig-feed.png`, `ig-story.png`, `x-header.png`, `tile.png`.

## ANTI-PATTERNS (THIS PROJECT)

- Do not defer v1 items out of the initial scope when implementing `PLAN.md`; the full listed v1 scope is one initial scope.
- Do not copy secrets or env values into docs or code. `SUPER_ADMIN_EMAILS` and `ADMIN_EMAILS` are env-only identifiers.
- Do not introduce Sentry as the default observability path; the plan uses PostHog error tracking.
- Do not add Redis or a separate in-memory cache as baseline infrastructure unless measured bottlenecks justify it.
- Do not convert the feed checker to depend on npm packages without a concrete reason; its current value is dependency-free CI use.
- Do not add `assets/pwa-icon.ico`; `pwa-icon.svg` is the canonical icon source, with PNG/JPG variants only.

## COMMANDS

```bash
# Check RSS/Google News feed liveness; required checked:true feeds fail the run.
node scripts/check-feeds.mjs config/feeds.json
```

No build, lint, test, or dev-server command exists before the app scaffold is added.

## NOTES

- Use `git status --short` before edits and avoid reverting user changes.
- `.env` exists; inspect variable names only when needed and avoid printing values.
- `AGENTS.local.md`, when present, records local service setup facts without secret values.
- `IMAGE.md` allows rendered text in generated marketing images, but `PLAN.md` notes real app landing text should eventually use HTML for responsiveness, SEO, and localization.
