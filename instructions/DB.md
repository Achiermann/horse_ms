# Database & API

## Goals

- Use Supabase now (Auth + Postgres, RLS).
- Keep application **portable**: DB can be swapped without changing UI or HTTP endpoints.
- Follow a server only approach.

## Layers

UI (React) ➜ **Next.js route handlers** (`/api/*`) ➜ **Repository interface** (`lib/repos/eventsRepo.js`) ➜ **Adapter** (`lib/adapters/supabase/eventsAdapter.js`)

Only the **adapter** is Supabase-specific. Everything else stays generic.

---

## Env Vars (server only)

- `SUPABASE_URL` (safe to expose)
- `SUPABASE_ANON_KEY` (safe to expose for client auth)
- `SUPABASE_SERVICE_ROLE_KEY` (**server only**; never ship to client)

---

## Auth

- Use Supabase Auth (OAuth/email). Do **not** store passwords ourselves.
- On the server (route handlers), resolve the user via Supabase auth helpers and **refuse unauthenticated** writes.
- Identify records with `owner_id` (UUID) for RLS.

---

## Schema

- All DB-Tables are stored the Schema **horse_ms**
- **Never** store anything the public-schema ("public.")

### RLS

Enable on `events`, then policies:

- **Select own + public** (if you add public flag later) or just **Select own**:
  ```sql
  create policy "events_select_own" on horse_ms.events
  for select using (auth.uid() = owner_id);
  ```

## Tables (minimal)

The tables already exist in Supabase.

`events` (schema: horse_ms)

- `id uuid primary key default gen_random_uuid()`
- `owner_id uuid not null` (FK to auth.users.id)
- `name text not null`
- `location text not null`
- `date date not null`
- `time time not null`
- `info text`
- `participants text[] not null default '{}'`
- `created_at timestamptz default now()`

  ```

  ```

`user` (schema: horse_ms)

- `id` uuid primary key (FK to auth.users.id on delete cascade)
- `display_name` text not null check (char_length(display_name) <= 120)
- `avatar_url` text
- `locale` text not null default 'en'
- `timezone` text not null default 'UTC'
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()
- `isAdmin` boolean
- `email` text
