# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # SvelteKit sync + svelte-check type checking
pnpm check:watch  # Type check in watch mode
pnpm lint         # prettier --check + eslint
pnpm format       # Auto-format with prettier
```

### Database

```bash
pnpm db:generate  # Generate migrations from schema changes (src/lib/server/db/schema.ts)
pnpm db:push      # Push schema directly to database (skip migration file)
pnpm db:migrate   # Run pending migrations
pnpm db:studio    # Open Drizzle Studio GUI
pnpm auth:schema  # Regenerate better-auth tables into src/lib/server/db/auth.schema.ts
```

## Architecture

**Full-stack SvelteKit app** with server-side rendering, SQLite database, and email/password auth.

### Request Lifecycle

1. `src/hooks.server.ts` — intercepts every request, validates session via Better-Auth, sets `event.locals.user` and `event.locals.session`
2. `+page.server.ts` load functions — access `event.locals` for auth-gated data fetching; redirect to login if unauthenticated
3. `+page.svelte` — renders with data passed from load functions
4. Form actions in `+page.server.ts` — handle POST submissions (sign in, sign up, sign out)

### Database Layer

- Schema defined in `src/lib/server/db/schema.ts` (Drizzle ORM table definitions)
- Auth tables auto-managed by Better-Auth; regenerate with `pnpm auth:schema` after auth config changes
- DB client exported from `src/lib/server/db/index.ts` — requires `DATABASE_URL` env var
- SQLite file path set via `DATABASE_URL` in `.env` (default: `local.db`)

### Auth Layer (`src/lib/server/auth.ts`)

- Better-Auth configured with Drizzle adapter and SvelteKit cookies plugin
- Auth API mounted at `/api/auth/[...all]` (SvelteKit catch-all route, auto-handled by the hooks)
- Client-side auth actions call server form actions, not the Better-Auth client directly

### Environment Variables

Required in `.env`:

- `DATABASE_URL` — path to SQLite file (e.g. `local.db`)
- `BETTER_AUTH_SECRET` — secret for signing sessions
- `ORIGIN` — base URL of the app (e.g. `http://localhost:5173`)

### Code Style

- **Tabs** for indentation, **single quotes**, 100-char line width (Prettier)
- Snake case variable names
- ESLint v9 flat config (`eslint.config.js`)
- TypeScript strict mode throughout
