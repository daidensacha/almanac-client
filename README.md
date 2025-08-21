# Garden Almanac — Client (Vite)

![](/src/images/mockup3.jpg)

## Overview

**Garden Almanac (Client)** — a React + MUI app for planning and tracking seasonal garden work: plants, events, and notes across years. Includes:

- Email/password auth + protected routes
- Plants / Categories / Events CRUD
- Image cards via Unsplash (proxied through server)
- Optional geolocation → climate zone lookup
- (Planned) Year/Month/Day views, RRULE recurrence, reminders, weather integrations

---

## Stack

- React 18 (Vite)
- React Router 6
- MUI 6 (with date-fns for pickers)
- Framer Motion
- Axios (with auth helpers)
- Toastify
- (Planned) React Query for cached data fetching

---

## Quick Start

```bash
# from repo root
npm install
cp .env.example .env
npm run dev
```

### Requirements

- Node 18+ (LTS recommended)
- The **server** running at `http://localhost:8000`

### Environment

Create **.env** in the client root:

```env
# API base (server)
VITE_API=http://localhost:8000/api

# Unsplash proxy (no key needed on client; key is stored on server)
VITE_UNSPLASH_PROXY=/api/unsplash/photos
```

> 🔒 **Important:** Do not put your Unsplash access key in the client. The server handles it securely.

Access these in code via `import.meta.env.VITE_API`.

---

## Scripts

```bash
npm run dev        # dev server on http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
```

---

## Project Structure

```
src/
  components/
  contexts/
  pages/
  utils/
    axiosClient.js
    helpers.js
    unsplash.js   # client helper that calls server /api/unsplash
    dateHelpers.js
  data/
```

---

## Auth Notes

- On sign-in, we store:
  - `token` in cookie
  - `user` in localStorage
- API calls should **not** hard-bind a token at module load. Prefer:
  - Add an Axios request **interceptor** that reads the cookie each request, or
  - Pass the token explicitly when calling

(Planned migration: central Axios instance with interceptors + React Query cache.)

---

## Development Workflow

- **Protected branch:** `main` — always deployable.
- **Feature branches:** `feature/<short-name>`
- **Fix branches:** `fix/<short-name>`
- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`…

Example:

```bash
git checkout -b feature/year-view
# work...
git commit -m "feat(calendar): add compact year view grid"
git push -u origin feature/year-view
```

---

## Issues & Labels

Use GitHub issues with labels:

- `good first issue`, `help wanted`, `bug`, `enhancement`, `design`, `docs`
- Link issues in PR descriptions.

---

## Roadmap (Client)

- [ ] Add **React Query** provider + convert Categories to queries/mutations
- [ ] Year view (compact grid) + improved Month/Day
- [ ] RRULE presets in Event form (weekly/fortnightly/monthly/yearly)
- [ ] Weather panel calling `/api/weather`
- [ ] Event “Notes by Year” section
- [ ] Export `.ics` for events/series
- [ ] Accessibility passes; keyboard focus & alt text everywhere

---

## GitHub Community Health Files

This repo also contains **community and contribution resources**:

- **ISSUE_TEMPLATE/**

  - `bug_report.md` → Standardized template for reporting bugs
  - `feature_request.md` → Template for suggesting new features
  - `config.yml` → Configures how issue templates appear in GitHub’s _New Issue_ screen

- **pull_request_template.md**
  Guides contributors when opening a PR (checklist, summary, related issues)

- **CONTRIBUTING.md**
  Explains how to contribute (branching model, commit messages, coding style)

- **FUNDING.md**
  Optional funding links (GitHub Sponsors, Patreon, Ko-fi)

### Notes

- These files are duplicated in both `almanac-client` and `almanac-server` for consistency.
- If you change one, update the other to keep them in sync.
- In the future, we may consolidate into a monorepo where this folder will be shared.

### Quick Links

- [Open a Bug Report](../../issues/new?template=bug_report.md)
- [Request a Feature](../../issues/new?template=feature_request.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

## Migration Notes (CRA → Vite)

- **Build tool:** Migrated from Create React App to **Vite**

  - Faster dev server, modern build pipeline.
  - Commands: `npm run dev`, `npm run build`, `npm run preview`.

- **Environment variables:**

  - CRA used `process.env.REACT_APP_*`.
  - Vite uses `import.meta.env.VITE_*`.
  - Updated `.env.example` accordingly.

- **File extensions:**

  - All React files renamed from `.js` → `.jsx`.

- **MUI upgrade:**

  - Migrated from MUI v5 to **MUI v6**.
  - `renderInput` props for DatePicker replaced by `slotProps={{ textField: { ... }}}`.
  - Date adapters now use `AdapterDateFns` (with `date-fns`).

- **Helper utilities:**

  - Added `dateHelpers.js` with `toDateOrNull()` and `toIsoDateStringOrNull()`.

- **Dev server port:**
  - CRA ran on `http://localhost:3000`.
  - Vite runs on `http://localhost:5173`.

---

## License

MIT © Daiden Sacha
