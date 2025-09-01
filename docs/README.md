# Almanac v2

Mobile-first redesign of the Almanac: simpler calendar, richer dashboard, and a plant database with sensible defaults.

## Objectives

- Mobile-first UI for all core surfaces (Dashboard, Year, Month, Day, Search, Admin).
- Keep navbar weather bar (temp + sunrise/sunset) — works logged-in or logged-out (IP fallback).
- Simplify calendar like iOS:
  - Year: tiny months + dots for event counts.
  - Month: grid with per-day dots.
  - Day: list of events.
- Dashboard = Control Center: season tips, first/last frost, moon phase, current weather, upcoming events, quick filters.
- Plant DB + default categories to jump-start users (editable).

## Tech ground rules

- React + MUI (mobile first).
- One source of truth for location: `locationPreference ('profile'|'ip')` + `coordsSource ('auto'|'manual')`.
- Hooks: `useAppLocation`, `useWeatherNow`, `useSeason` (moon/frost), `useUpcomingEvents`.
- Server: keep `/api/ip` IP-lookup with local/private handling; rate-limit Unsplash calls.

## Branching

- `main` → prod
- `dev` → integration
- `feature/v2-dashboard`
- `feature/v2-calendar`
- `feature/v2-plants`
- `feature/v2-admin-mobile`
