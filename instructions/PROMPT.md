# PROMPTS

## Scaffold landing

Create `/src/app/page.js` (SSR shell) and client components:

- EventList, EventListItem, SearchBar, Filters, Header, Pagination.
- Each with a matching CSS Module.
- Wire `clientWrapper.js` to include Zustand.

Constraints: Follow `CLAUDE.md` and `STYLE-GUIDE.md`. JS only, CSS Modules only.

## Add event flow

Add an “Add event” button on the landing that opens a client-side form (modal or inline).
On submit, validate fields, add to store, toast success, and navigate to `/events/:id`.

## Detail page

Create `src/app/events/[id]/page.js`:

- Render full event info.
- If id not found, redirect to `/` and toast error.

## Search & filter

Implement 250ms debounced search over `name` + `location` (case-insensitive), ANDed with date range filters.

Before each change: list planned files/edits. After: show a unified diff.

## API contract (events)

+`GET /api/events?q=&from=&to=&page=&pageSize=` → `{ items, total, page, pageSize }` +`POST /api/events` body `{ name, date, time, location, participants }` → `201 { item }` +`GET /api/events/:id` → `{ item }` +`PATCH /api/events/:id` → `{ item }` +`DELETE /api/events/:id` → `204`

# TESTING & ERROR HANDLING

- Validate event form fields; show toast on validation errors.
- Guard unknown event ids on detail page; redirect + toast error.
- Unit-test store actions with plain JS (no TS).
- Include try/catch around any async fetch (when APIs are added); toast failures.

### Before you choose any dependency or external service

1. **List available MCP servers/tools** and check if one covers the capability (data access, auth, storage, formatting, etc.).
2. If an MCP fits, **use it**. If not, pick the minimal external library that meets the requirement and justify why MCP was insufficient.

### Git workflow (every task)

1. Create branch: `feat|fix|chore/<scope>-<short-slug>`.
2. Make the change in small commits using Conventional Commits.
3. Push branch immediately after the first commit.
4. Open a PR to `main` with a brief summary and checklist.
