# SocialApp — Enterprise-grade Next.js (App Router)

A production-ready starter for a large social network, organized with **Feature-Sliced Design (FSD)**.

## Tech stack

| Concern            | Choice                                                |
| ------------------ | ----------------------------------------------------- |
| Framework          | Next.js 14 (App Router) + TypeScript (strict)         |
| Styling            | Tailwind CSS + shadcn/ui (CSS-variable design tokens) |
| Global state       | Zustand                                               |
| Server state       | TanStack Query v5                                     |
| Forms / validation | React Hook Form + Zod                                 |
| HTTP               | Axios instance with refresh-token interceptor         |
| Toasts             | Sonner (via `toastService`)                           |
| Env safety         | `@t3-oss/env-nextjs`                                  |
| DX                 | Husky + lint-staged + Prettier + ESLint               |

## Folder structure (FSD)

```
src/
├─ app/                      # Next.js routes, layout, error.tsx (composition root)
│  ├─ layout.tsx             # mounts ErrorBoundary + AppProviders
│  ├─ error.tsx             # route-level error UI (no white screen)
│  ├─ page.tsx
│  └─ globals.css            # ← DESIGN TOKENS (CSS variables)
│
├─ processes/               # cross-feature flows (e.g. auth, onboarding)
├─ widgets/                 # composite UI blocks built from features
│  └─ Newsfeed.tsx          # uses next/dynamic for the heavy composer
│
├─ features/                # user-facing capabilities (the heart of FSD)
│  └─ posts/
│     ├─ api/               # post.service.ts (factory) + post.queries.ts (hooks)
│     ├─ model/             # post.schema.ts (Zod = types + validation)
│     ├─ ui/                # PostCard.tsx, CreatePostComposer.tsx
│     └─ index.ts           # PUBLIC API barrel (only entry point)
│
├─ entities/                # business entities shared across features (User…)
└─ shared/                  # reusable, domain-agnostic code
   ├─ api/                  # api.ts (axios), create-service.ts, token-storage.ts
   ├─ config/               # env.mjs
   ├─ lib/                  # cn.ts, toast.ts, query-client.tsx, auth.store.ts
   ├─ ui/                   # ErrorBoundary.tsx, design-system primitives
   └─ types/
```

### Why this layout lets teams work in parallel

Layers have a **strict one-way dependency rule**: `app → widgets → features → entities → shared`.
A layer may only import from layers _below_ it, and a feature may only be imported through its
`index.ts` barrel. The result:

- **Isolation.** Two engineers can build `features/posts` and `features/chat` simultaneously
  without touching shared files or each other's internals.
- **UI/logic separation.** Inside every feature, `model` (data + Zod), `api` (services + hooks),
  and `ui` (components) are split — so a designer can iterate on `ui` while a backend-focused dev
  reshapes `api`/`model`.
- **Safe refactors.** Because consumers depend only on the barrel, you can rewrite a feature's
  internals freely. Nothing outside breaks.
- **Predictable reviews.** A PR's blast radius is visible from its folder — feature changes can't
  silently leak into global code.

## Architecture highlights

### Axios + automatic refresh token (`shared/api/api.ts`)

On a `401`, the response interceptor pauses the failed request, refreshes the token **exactly once**
(a single-flight queue parks any concurrent 401s so we never hammer `/auth/refresh`), then **replays
the original request** with the new token. If refresh fails, it clears the session, toasts, and
redirects to `/login`. All other errors are normalized and toasted globally.

### Service Factory (`shared/api/create-service.ts`)

The only module allowed to touch axios. Each domain builds a typed client
(`createService("/posts")`); components never import axios. Every method can take a Zod schema and
**validates the response at the boundary**, so an unexpected backend payload throws a loud, handled
error instead of crashing the UI.

### Response validation with Zod (`features/posts/model/post.schema.ts`)

Schemas are the single source of truth: TS types are _derived_ from Zod (`z.infer`), the same schema
validates API responses **and** powers the React Hook Form. No hand-written interfaces, no drift.

### Toast service (`shared/lib/toast.ts`)

A thin facade over Sonner callable from anywhere — including the axios interceptor and services —
not just React components. Swap the toast lib in one file.

### Global error handling

Two layers: a class `ErrorBoundary` (render crashes) in the root layout, plus Next.js's route-level
`app/error.tsx`. Network errors are handled centrally by the interceptor. The app never white-screens.

## Design-system tokens — how to customize

All visual primitives are **CSS variables** defined in `src/app/globals.css` (`:root` for light,
`.dark` for dark). `tailwind.config.ts` maps semantic Tailwind classes (`bg-primary`,
`text-muted-foreground`, `rounded-lg`) onto those variables. To re-skin the entire network:

- **Colors:** edit the HSL triples under `:root` (e.g. `--primary`). Values are raw HSL (no
  `hsl()` wrapper) so `bg-primary/50` opacity works.
- **Shape:** change `--radius` — every component's roundness follows.
- **Typography:** set `--font-sans` / `--font-display` (wire real fonts via `next/font`).
- **New brand themes:** add a scoped block like `[data-theme="brand"] { --primary: … }` and toggle
  the attribute at runtime — zero component changes.

## Performance

- `next/image` everywhere (responsive sources, lazy load, AVIF/WebP) — see `PostCard.tsx`.
- `next/dynamic` for heavy, below-the-fold chunks — the post composer in `Newsfeed.tsx` is code-split
  with `ssr: false` and a skeleton fallback, keeping initial JS small.
- TanStack Query `staleTime` prevents refetch storms while scrolling the infinite feed.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_URL
npm run dev
```

`npm run prepare` installs the Husky hook; commits then auto-run ESLint + Prettier on staged files.

```

> Note: `app/login`, shadcn/ui primitives, and `entities/user` are stubs to fill in — the patterns
> above are the template to copy for every new feature.
```
