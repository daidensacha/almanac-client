# Sprint 1 — Dashboard + Location/Weather hardening

## Backend

- [ ] `/api/ip` local/private detection + auto-detect public IP
- [ ] Cache IP lookups per session (header X-Session-Id or cookie)
- [ ] Hard 429 handling for Unsplash (already seen) and any external API

## Frontend

- [ ] `useAppLocation` winner logic:
      saved (profile) → else IP (cache first, then fetch)
- [ ] `useWeatherNow` given coords; refetch on auth changes/signout
- [ ] Dashboard cards (Season, Weather, Upcoming, Summary)
- [ ] Drawer nav (mobile): Dashboard/Calendar/Plants/Categories/Search/Admin/Settings
- [ ] Bottom actions (optional): Quick Add, Filters

## QA

- [ ] iPhone local network test (Vite `host: true`, proxy ok)
- [ ] Sign-in/out updates ticker + dashboard instantly
- [ ] No location → IP fallback works; rate limit safe
