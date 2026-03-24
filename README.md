# Garden Almanac — Client (Vite)

![](/src/images/mockup3.jpg)

## Overview

A web application for planning and tracking seasonal garden work — including plants, events, and notes across years.

This project is part of a broader “Garden Almanac” concept, designed to support long-term observation and structured data over time.

---

## What this project does

- Manage plants, categories, and events
- Track seasonal changes across years
- Store notes and observations
- Support structured planning workflows

---

## Tech stack

- React 18 (Vite)
- React Router 6
- MUI 6 (date-fns)
- Framer Motion
- Axios

## Status

Part of a broader 'Garden Almanac' concept focused on long-term observation and structured data.

## Quick Start

Choose **one** configuration model:

- **Option A — dotenv (recommended for local dev)**  
  Use environment-specific files: `.env.development` or `.env.production`
- **Option B — Phase**  
  Inject environment variables at runtime (no local `.env*` files required)

### Requirements

- Node 18+ (LTS recommended)
- The **server** running at `http://localhost:8000`

---

## Option A — dotenv (environment-specific files)

This project uses **environment-specific env files**, not a single `.env`.

### Development

1) Install dependencies

```bash
npm install
```

2) Create `.env.development` from the example

```bash
cp .env.development.example .env.development
```

3) Run dev server

```bash
npm run dev
```

### Production

Create `.env.production` from the example and adjust values for your deployment target:

```bash
cp .env.production.example .env.production
```

### Environment values

```env
# API base (server)
VITE_API=http://localhost:8000/api

# Unsplash proxy (no key needed on client; key is stored on server)
VITE_UNSPLASH_PROXY=/api/unsplash/photos
```

> 🔒 **Important:** Do not put your Unsplash access key in the client.  
> The server handles it securely.

Access these values in code via:

```js
import.meta.env.VITE_API
```

---

## Option B — Phase (no local env files)

If you prefer not to manage `.env.development` / `.env.production` files,
you can use **Phase** to inject the same variables at runtime.

This README assumes you already have Phase set up.  
For installation and configuration, see the official docs:

👉 https://docs.phase.dev

### Usage

Run the app with Phase injecting environment variables:

```bash
phase run "npm run dev"
```

The values you configure in Phase should mirror those from the example env files:

- `VITE_API`
- `VITE_UNSPLASH_PROXY`

---

## Scripts

```bash
npm run dev        # dev server on http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
```

If you’re using **Phase**, run the same scripts through Phase:

```bash
phase run "npm run dev"
phase run "npm run build"
phase run "npm run preview"
```
---

## Project Structure

```text
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

See [Branching & Deploy Playbook](docs/branching-deploy-playbook.md) and [CONTRIBUTING](CONTRIBUTING.md).

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

## Upgrade Path (recommended)

This project is stable, but if you want to extend its lifespan, upgrade in **small, testable steps**.

1) **Node**
- Keep on an LTS line (Node 18 → 20 → 22), upgrading only when dependencies are compatible.

2) **Dependencies**
- Upgrade libraries incrementally and run the app after each step:
  - `react`, `react-dom`
  - `react-router-dom`
  - `@mui/*` + date picker deps (`date-fns`)
  - `axios`, `react-toastify`, `framer-motion`

3) **Vite**
- Upgrade Vite and related plugins together. Validate `npm run dev` + `npm run build`.

4) **TypeScript (optional)**
- If you plan to grow the project, consider migrating to TypeScript gradually (start with utilities, then components).

---

## License

MIT © Daiden Sacha
