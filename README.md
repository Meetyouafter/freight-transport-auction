# Freight Transport Auction

Frontend for a freight transport auction platform.

## Stack

- **React 19 + TypeScript + Vite** — app shell and dev/build tooling.
- **TanStack Router** — type-safe, file-based routing (`src/routes`, codegen into `src/app/routeTree.gen.ts`).
- **TanStack Query** — all server state (fetching, caching, mutations).
- **React Hook Form + Zod** — all forms; Zod schemas are the single source of truth for validation and inferred TS types.
- **Zustand** — small, point-in client UI state only (dialog open/close, active tab, etc). Never server data.
- **MUI (Material UI)** — the only source of UI components and styling. See [Design tokens & MUI theme](#design-tokens--mui-theme).
- **MSW (Mock Service Worker)** — every feature is built against mocked HTTP handlers first; the app never depends on a real backend to be developed or demoed.

Architecture follows **Feature-Sliced Design (FSD)** — see [Project structure](#project-structure).

A Claude Code project skill describing these conventions in more depth lives at
[.claude/skills/project-conventions/SKILL.md](.claude/skills/project-conventions/SKILL.md).

## Getting started

```bash
npm install
npm run dev
```

The dev server starts an MSW worker automatically (`src/mocks`), so the UI is fully interactive without any backend running.

## Scripts

| Script              | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Start the Vite dev server with MSW mocking enabled           |
| `npm run build`     | Type-check (`tsc -b`) and build for production               |
| `npm run preview`   | Preview the production build locally                         |
| `npm run typecheck` | Type-check only, no build output                             |
| `npm run lint`      | ESLint + Stylelint + Prettier, all with autofix, in one pass |

## Project structure

```
src/
  app/          bootstrapping: providers, router instance, routeTree.gen.ts (generated)
  routes/       thin TanStack Router route files — import and render pages, no logic
  pages/        route-level screens, composed from widgets/features/entities
  widgets/      composite, reusable UI blocks spanning several features/entities
  features/     user scenarios (e.g. bid-form): a UI + the logic behind one user action
  entities/     business domain objects (e.g. auction-lot): types, API calls, schemas
  shared/       reusable code with no business meaning: ui kit wrappers, theme, lib, api client
  mocks/        MSW handlers, browser/server setup — lives outside the FSD layers on purpose,
                since handlers need to reference entities/features types across slices
```

Import rules (enforced by `eslint-plugin-boundaries`, see `eslint.config.js`):

- A layer may only import from itself and layers below it: `app/routes → pages → widgets → features → entities → shared`.
- Cross-slice imports (e.g. one feature importing another entity) must go through that slice's
  `index.ts` public API — never reach into another slice's internal folders.
- `shared` never imports from `entities`/`features`/`pages`/`app` — that's why MSW handlers,
  which need entity types, live in the top-level `mocks/` folder instead of `shared/api/mocks`.

## Design tokens & MUI theme

Colors come from a fixed 4-color palette and are defined once as tokens in
`src/shared/theme/tokens.ts`. The MUI theme (`src/shared/theme/theme.ts`) is built from those
tokens and provided via `ThemeProvider` in `src/app/providers/AppProviders.tsx`.

**Rule: never hardcode hex colors or raw CSS in components.** Use MUI components and the `sx` prop
referencing `theme.palette.*` / `theme.spacing()` / `theme.shape.borderRadius`, so the whole app
stays reskinnable from one file.

Browser reset: MUI's `<CssBaseline />` handles the standard reset (margins, box-sizing, base
typography). `src/shared/theme/GlobalReset.tsx` adds the few app-level additions CssBaseline
intentionally leaves out (full-height root, responsive media defaults).

## Testing MSW handlers

- `src/mocks/handlers.ts` aggregates all handlers (currently `src/mocks/handlers/auctions.ts` and
  `src/mocks/handlers/bets.ts`).
- `src/mocks/browser.ts` — used by the app in the browser (dev mode).
- `src/mocks/server.ts` — Node-side MSW server, ready to wire into a test runner (e.g. Vitest) once one is added.

## Auctions API

Implements `src/mocks/openapi.auctions.v0.json`: `POST /auctions/list`, `GET /auctions/{auctionUuid}`,
`GET /auctions/{auctionUuid}/bets`, `POST /auctions/{auctionUuid}/bets` (base path `/api/v1`).

- `src/entities/auction/` — `model/enums.ts`, `model/list.ts`, `model/show.ts` hold Zod schemas mirroring the
  OpenAPI `components/schemas` 1:1 (field names kept in the API's own `snake_case`); TS types are inferred from
  them. `api/listAuctions.ts` and `api/getAuction.ts` are the request functions, one file per endpoint (per
  "skill"/scenario), exported through `index.ts`.
- `src/entities/bet/` — same pattern for `BetItem` / `BetListResponse` / `SetBetRequest`, with
  `api/listBets.ts` and `api/setBet.ts`.
- `src/shared/api/http.ts` — a small `apiFetch` wrapper (base URL, JSON headers, error mapping) shared by all
  entity API functions. `src/shared/api/problemDetail.ts` holds the generic `ProblemDetail`/`ValidationProblem`
  error schemas from the OpenAPI spec.
- `src/mocks/fixtures/auctions.ts` and `src/mocks/fixtures/bets.ts` hold the in-memory mock state (typed
  against the real entity schemas). `src/mocks/handlers/auctions.ts` and `src/mocks/handlers/bets.ts` are the
  MSW handlers; `POST /auctions/{auctionUuid}/bets` mutates that in-memory state (new bet, updated current
  price, `your` bet info, trading status), so placing a bid is reflected by subsequent `listAuctions` /
  `getAuction` / `listBets` calls in the same session. Request bodies are validated with the same Zod schemas
  the client uses, returning a `422` shaped like `ValidationProblem` on mismatch.

Notes on two spec quirks preserved deliberately in the schemas (see comments in `entities/auction/model/enums.ts`):
the list endpoint's inline `status_mobile` enum has fewer values than the reusable `TradingStatus` component used
by the detail endpoint and the list filter, and the list filter's `auc_type` enum omits `Unknown`. The two are
modeled as separate schemas rather than merged, to stay exact to the spec.
