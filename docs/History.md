# Almanac Project History

This document tracks key milestones and decisions across major versions of the Almanac project.
It complements the Git commit history by explaining **why** we made certain choices.

---

## v1 (2025-08 Snapshot)

- **Focus:** Calendar-centric UI (year, month, day views).
- **UX:** Sidebar included totals (plants, categories, events) and upcoming events list.
- **Integrations:** Location + weather (sunrise/sunset, fallback IP lookup).
- **Limitations:**
  - Mobile layout cramped — too much detail squeezed into year/month/day views.
  - Sidebar underused — missed opportunity as the main “user dashboard.”
  - Plant DB not yet integrated; events added manually.

### Branching

- Working branch: `feat/sidebar-breakpoint-fix`
- Snapshot tag: `v1-legacy-snapshot` (both client + server)

---

## Transition to v2 (2025-09)

- **Baseline:** Created `dev-v2` branches in both client and server.
- **Preserved:** Location + weather code (`useAppLocation`, `useWeather`).
- **Reset:** Feature branches pointed at `dev-v2` for a clean slate.

---

## v2 Goals

1. **Dashboard-first UX**

   - Cards: Weather, moon phase, seasonal dates (first/last frost, solstices).
   - Totals: Plants, categories, events.
   - Upcoming events list with filters (weeks, months, category, plant).
   - Mobile-first: stacked cards, bottom drawer nav.

2. **Calendar Simplification**

   - Year view: dots under days (event presence).
   - Month view: dots per day; tap to drill into day.
   - Day view: list of events for that date.

3. **Plant Database**

   - Default categories to help new users (e.g. Vegetables, Fruits, Herbs).
   - Users can add/edit/delete plants + categories.
   - Plant data sharable between users (long-term vision).

4. **Consistent APIs**
   - Align client/server for plant DB, dashboard metrics, and location/weather.
   - Gradually refactor `AddPlant`, `ViewPlant`, `EditPlant`, and event views.

---

## v2 Feature Branches

### Client

- `feat/v2-dashboard`
- `feat/v2-calendar`
- `feat/v2-plant-db`
- `feat/v2-location-integration`

### Server

- `feat/v2-dashboard-api`
- `feat/v2-calendar-api`
- `feat/v2-plant-db-api`
- `feat/v2-location-integration-api`

---

## Next Milestones

- Wireframes for v2 dashboard + calendar views.
- Refactor mobile nav to drawer style (Obsidian-like).
- Seed plant categories + integrate plant DB CRUD.
- Sync server APIs with new v2 client structure.

## Timeline Log

### 2025-09-01

- Tagged `v1-legacy-snapshot` in both client + server.
- Created `dev-v2` baseline branches.
- Reset feature branches (`feat/v2-*`) to point at `dev-v2`.

### 2025-09-02

- Drafted v2 wireframe plan (dashboard-first UX, simplified calendar).
- Added docs: `UX-Principles.md`, `Wireframes.md`, `Tasks-Sprint-1.md`.
