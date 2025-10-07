# CLAUDE PROJECT RULES

## Tech stack (hard constraints)

- Next.js **App Router**, in `src/app`.
- Language: **JavaScript only**. **No TypeScript**.
- Styling: **plain CSS** and **CSS Modules**. **No Tailwind**. **No CSS-in-JS**.
- State: **Zustand** (`useEventsStore`) as the single source of truth.
- Notifications: **react-hot-toast** via a global `<Toaster />` in the layout.
- UI library: **plain CSS first**. Only use **MUI** for complex, accessibility-heavy widgets (e.g., date picker). If MUI is used, keep the surface area minimal and match our tokens.

## Project structure

- Use the **`src/`** directory:
- API routes under `src/app/api/*/route.js`
- <Toaster /> lives in src/app/layout.js

## Hard rules
- <Toaster /> lives in src/app/layout.js (client). Do not mount it elsewhere.
- Database via Supabase adapter, **server-only env**. 
- Do not import Supabase client in any React component.
- If any doc conflicts with this one, follow `DECISIONS.md`.
- **MCP first**: Before selecting any external SDK/library/service, **enumerate available MCP servers/tools** and prefer an MCP integration when it provides the required capability. Only use a non-MCP library if no suitable MCP is available or it lacks required features; document the rationale.
- **Commit discipline**: **Always commit directly to a new branch** in GitHub for each cohesive change. Do not commit to `main`/`trunk`. Create a descriptive branch (see naming below) and push commits incrementally.

### Branch naming & commits
- Branch: `feat/<scope>-<short-slug>` or `chore/<scope>-<short-slug>` or `fix/<scope>-<short-slug>`
  - e.g., `feat/events-api-pagination`, `fix/ui-focus-ring`, `chore/ci-vitest`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.) with a concise imperative subject and a short body when useful.
- After pushing the first commit on a new branch, **open a PR** targeting `main` with a clear title/description.


## Rendering

- `src/app/page.js` is **SSR** for shell only; interactive parts are client-side via a **ClientWrapper** (see ARCHITECTURE.md).
- Zustand store hydrates **client-side**. If persistence is enabled, use `localStorage`.

## Coding order in every component

1. `'use client'` (if client component)
2. imports
3. **\*\*\* VARIABLES \*\*\*** (hooks, constants)
4. **\*\*\* FUNCTIONS/HANDLERS \*\*\***
5. return (JSX)

## CSS

- `styles/main.css` contains tokens (`:root`), element resets, and global utility classes.
- Each component/page has a `Something.module.css` imported **by that component** (not by `main.css`).
- classNames **kebab-case**, prefixed with the component name (e.g., `event-card`, `event-card-header`, `event-list-item`).

## CSS rules (strict)

- Import **global CSS** only in `app/layout.js` via `styles/main.css`.
- `styles/main.css` may `@import` other **global `.css` files**.
- **Do NOT** `@import` any `*.module.css` into `main.css`.
- **CSS Modules** must be imported **by their component** (e.g., `import s from './X.module.css'`).
- Prefer CSS Modules for component-scoped styles; keep tokens/resets/global utilities in `styles/main.css`.
- **Do NOT** define styling in JSX ever. 

## Linting & formatting (non-negotiable)

- Run ESLint and Prettier on all changes.
- Follow `.eslintrc.json` and `.prettierrc`.
- If a rule conflicts with formatting, Prettier wins (ESLint extends `prettier`).
- Before submitting diffs, apply `eslint --fix` and `prettier --write`.

## DATABASE & API (HARD RULES)

- Use **Supabase** for auth and Postgres, but keep app code **DB-agnostic**.
- All data access must go through a **repository layer** (`lib/repos/*`) with a narrow CRUD interface.
- **Do NOT** call Supabase client directly from React components. UI → `/api/*` → repository.
- **Security**
  - Use **Supabase Auth**; never handle passwords yourself.
  - Enable **Row Level Security (RLS)** and write policies; never bypass RLS from the client.
  - Never expose the **service_role** key to the browser; server-only env vars only.
  - Route handlers must validate input, check auth, and return least-privileged data.
- **Portability**
  - The public HTTP API shape stays stable (CRUD); switching DB = swap repository adapter only.
  - Avoid Supabase-only features in domain code (e.g., PostgREST filters in UI). If used, keep them inside the **Supabase adapter**.
- **Standards**
  - CRUD endpoints only; use RESTful routes:
    - `/api/events` GET (list, accepts search/filter), POST (create)
    - `/api/events/[id]` GET, PATCH, DELETE
  - Validate request bodies/query with lightweight checks (or `zod` if allowed).
  - Return consistent JSON `{ data, error }` and proper status codes.

## DO`s & DONT`s

You are operating on an existing Next.js repo. Hard rules:

**DO NOT** delete, rename, or overwrite any of these:

- .env\*, .env.local, .env.production, .env.development
- node_modules/, .next/, .vercel/, .git/, .gitignore
- lockfiles: pnpm-lock.yaml, package-lock.json, yarn.lock
- config: next.config._, tsconfig.json, .eslintrc._, postcss.config._, tailwind.config._
- project meta: README.md, LICENSE
- scripts in package.json unless I explicitly approve

Scope of changes:

- Only modify files I list under “Allowed edits”.
- If a needed file is missing, propose it in the output; DO NOT auto-delete or mass-rewrite directories.

When producing shell commands:

- Output commands only; do not describe deletions of protected files.
- Assume pnpm (or my chosen manager). Do not run create-next-app or re-init the project.

## Preferred response style

- Show a short plan, then the changes (file-by-file), then verification steps.
- Include any commands to run (install, build, test) and expected outputs.
- Call out risks and follow-ups explicitly.

## Events domain model

```js
// src/app/stores/useEventsStore.js
{
id: "uuid",
name: "string",
location: "string",
date: "YYYY-MM-DD",
time: "HH:mm",
info: "string",
participants: ["string"] // object including name and user_id
}

```
