# ARCHITECTURE

## Rendering model

- `src/app/page.js` (SSR): renders the landing shell: header, search, filters, and an empty list container.
- `src/app/clientWrapper.js` (Client): mounts providers and client-only UI (Zustand).
- Interactive components live under `components/` as **client components**.
- Supabase access is **server-only** via Next Route Handlers. No Supabase client on the client.

## Routing

- Landing: `/` (list of events, add button, search/filter).
- Event detail: `/events/[id]` (dynamic route).

## State (Zustand)

- File: `src/app/stores/useEventsStore.js`.
- State: `{ events: Event[], search: string, filters: { startDate?: string, endDate?: string } }`
- Actions: `addEvent`, `updateEvent`, `removeEvent`, `setSearch`, `setFilters`, `getSortedIds`, `findPrevNext(id)`.

## Persistence

- API + DB (files under `src/app/api/...` will be implemented then).

## UI skeleton

- Components:
  - `components/EventList.jsx` (+ `EventList.module.css`)
  - `components/EventListItem.jsx` (+ CSS module)
  - `components/EventForm.jsx` (+ CSS module)
  - `components/SearchBar.jsx` (+ CSS module)
  - `components/Filters.jsx` (+ CSS module)
  - `components/Pagination.jsx` (Prev/Next on detail page)
  - `components/Header.jsx` (+ CSS module)
