---
name: project-conventions
description: Feature-Sliced Design layout, MSW-first development, and MUI design-token rules for this repo. Use whenever adding or moving code, adding a route/page/feature/entity, styling anything, or wiring new API calls.
---

# Project conventions: freight-transport-auction

Stack: React 19, TypeScript, Vite, TanStack Router (file-based), TanStack Query, React Hook Form, Zod, Zustand, MUI, MSW.

## FSD layers (import only downward)

`app → routes → pages → widgets → features → entities → shared`

- **app/** — providers, router instance, root layout only. No business logic.
- **routes/** — thin wrapper importing a page from `pages/`, no inline JSX logic.
- **pages/** — one per route, composes widgets/features/entities, only used by a route file.
- **widgets/** — reusable composite UI used on 2+ pages. Single-page-only UI belongs in `pages/`.
- **features/** — one user scenario per folder (UI + logic for one action).
- **entities/** — domain objects: Zod schema + type in `model/`, fetchers in `api/`.
- **shared/** — theme, query client, small Zustand stores, generic UI. Never imports from entities/features/pages/app.
- Each slice (`pages/*`, `widgets/*`, `features/*`, `entities/*`) exposes one `index.ts` barrel; import through it, never reach into internal files. Enforced by `eslint-plugin-boundaries`.
- `src/mocks/` sits outside FSD (top-level, not under `shared/`) because handlers need entity/feature types.

## MSW-first

- `src/mocks/handlers/*.ts` per domain, registered in `src/mocks/handlers.ts`.
- Add a matching handler whenever adding an `entities/*/api/` function, same PR.

## Styling: MUI + tokens only

- No raw hex, inline `style={}` colors, or hand-written CSS.
- `src/shared/theme/tokens.ts` is the only place hex/rgba values appear. New colors/spacing/radius go there first, then `theme.palette.*`/`theme.spacing()`/`theme.shape.borderRadius` via `sx`/`styled()`.
- `accentTokens` is reserved for the primary CTA (the contained MUI button); borders and elevations come from `surfaceTokens`, not raw `boxShadow: 4`.
- Build from MUI components; compose custom primitives in `shared/ui/` if needed.

## Forms / server state / client state

- Forms → React Hook Form + Zod schema in `model/schema.ts`, infer type via `z.infer`.
- Network data → TanStack Query only, query fns in `entities/*/api/`, calling `shared/api/http.ts`'s `apiFetch`. No direct `fetch`/`axios` elsewhere.
- Local UI-only state → Zustand in `shared/lib/store/` (or feature's `model/` if feature-scoped). Not for server state.
