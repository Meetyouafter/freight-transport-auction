---
name: project-conventions
description: Feature-Sliced Design layout, MSW-first development, and MUI design-token rules for this repo. Use whenever adding or moving code, adding a route/page/feature/entity, styling anything, or wiring new API calls.
---

# Project conventions: freight-transport-auction

Stack: React 19, TypeScript, Vite, TanStack Router (file-based), TanStack Query, React Hook Form

- Zod, Zustand, MUI, MSW. Full rationale and script list: see [README.md](../../../README.md).

## Feature-Sliced Design (FSD)

Layers, top to bottom (a layer may only import itself and layers strictly below):

```
app  →  pages  →  widgets  →  features  →  entities  →  shared
```

- **app/** — bootstrapping only: providers (`AppProviders.tsx`), the router instance
  (`router.ts`), root layout (`RootLayout.tsx`), the generated `routeTree.gen.ts`. No business
  logic here.
- **routes/** — TanStack Router file-based routes. Each route file is a thin wrapper that imports
  a page component from `pages/` and sets it as `component`. Never put JSX logic directly in a
  route file beyond that.
- **pages/** — one folder per route/screen. Composes widgets/features/entities. A page is not
  imported by anything except a route file.
- **widgets/** — composite, reusable UI blocks used across more than one page (e.g. a page header,
  a lot card). If something is only ever used on one page, it likely belongs in `pages/`, not
  `widgets/`.
- **features/** — one user scenario per folder (e.g. `bid-form`): the UI plus the logic behind a
  single user action. A feature may use one or more entities but shouldn't know about pages.
- **entities/** — business domain objects (e.g. `auction-lot`): Zod schema + inferred type in
  `model/`, fetch functions in `api/`. No UI beyond maybe a small display atom.
- **shared/** — reusable code with zero business meaning: the MUI theme/tokens (`shared/theme`),
  the TanStack Query client (`shared/api/query-client.ts`), small Zustand stores
  (`shared/lib/store`), generic UI wrappers. `shared` must never import from `entities`,
  `features`, `pages`, or `app`.

**Slice folder shape** (`pages/*`, `widgets/*`, `features/*`, `entities/*`): each slice exposes a
single `index.ts` barrel as its public API (see `entities/auction-lot/index.ts` or
`features/bid-form/index.ts`). Other slices/layers must import through that barrel — never reach
into `some-slice/ui/SomeComponent` directly from outside the slice. This is enforced by
`eslint-plugin-boundaries` (`boundaries/dependencies` and `boundaries/entry-point` rules in
`eslint.config.js`); a lint error there almost always means code landed in the wrong layer or
bypassed a slice's barrel.

**mocks/** is intentionally outside the FSD layers, at `src/mocks/`, not under `shared/`. MSW
handlers need to reference `entities`/`features` types, and `shared` is not allowed to depend on
those layers — so handlers live in their own top-level folder instead. Don't move them into
`shared/api` even though that might feel more "shared-like".

## MSW-first development

Every feature is built against a mocked backend before (or instead of) a real one:

- `src/mocks/handlers/*.ts` — one file per domain area, exporting an array of `http.*` handlers.
- `src/mocks/handlers.ts` — aggregates all handler arrays; register new handler files here.
- `src/mocks/browser.ts` — `setupWorker`, started in dev via `src/mocks/enableMocking.ts` (called
  from `main.tsx` before the app renders).
- `src/mocks/server.ts` — `setupServer` for Node-side tests (Vitest + MSW), ready to wire in once a
  test runner is added — import `server` and call `server.listen()`/`server.resetHandlers()` in
  test setup rather than hand-mocking `fetch`.

When adding a new entity's `api/` function, add a matching handler in `mocks/handlers/` in the
same PR — don't let entity code assume a live endpoint exists.

## Design tokens & MUI — the only styling system

**Never write raw hex colors, inline `style={}` colors, or plain `.css` files with hand-picked
colors/spacing.** Everything visual goes through MUI components + the theme:

- `src/shared/theme/tokens.ts` — the 4-color palette (`colorTokens`) and the derived MUI
  `paletteTokens`/`shapeTokens`. This is the _only_ file where hex values should appear.
- `src/shared/theme/theme.ts` — `createTheme()` built from those tokens. If a new color, spacing
  unit, or radius is needed, add it as a token here first, then reference
  `theme.palette.*` / `theme.spacing()` / `theme.shape.borderRadius` from components via the `sx`
  prop or `styled()` — never a new hardcoded value in a component.
- `src/shared/theme/GlobalReset.tsx` — the small set of app-level resets layered on top of MUI's
  own `<CssBaseline />` (full-height root, responsive media defaults). Don't add another global
  stylesheet; extend this component instead if a new global reset rule is genuinely needed.
- Build UI out of MUI components (`Button`, `TextField`, `Dialog`, `Container`, `Stack`, …), not
  bespoke `<div>` + CSS. If MUI doesn't have the right primitive, compose one from MUI primitives
  in `shared/ui/` rather than writing custom CSS.

Stylelint (`.stylelintrc.json`, `stylelint-config-standard` + `stylelint-config-recess-order`)
runs over any `.css` that does get added, as part of `npm run lint` — but the expectation is that
this stays close to empty, since MUI + the theme should cover styling needs.

## Forms, server state, and client state — pick the right tool

- **Any form** → React Hook Form + a Zod schema in the feature's `model/schema.ts`, resolved with
  `@hookform/resolvers/zod`. The Zod schema is the single source of truth — infer the TS type from
  it (`z.infer<typeof schema>`), don't hand-write a parallel interface.
- **Any data from the network** → TanStack Query (`useQuery`/`useMutation`), never `useEffect` +
  `useState` fetching. Query functions live in `entities/*/api/`.
- **Small, local UI state that isn't server data** (a dialog's open/closed flag, an active tab) →
  a Zustand store in `shared/lib/store/` (see `useUiStore.ts`). Don't reach for Zustand for
  anything that's actually server state — that's Query's job — and don't put it in `entities` or
  `features` unless the state is genuinely scoped to one feature (in which case colocate it in
  that feature's `model/`, following the same small-store pattern).
