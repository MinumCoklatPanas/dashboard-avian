# Dashboard Avian (Next.js)

Agent-focused project summary for fast codebase onboarding.

## What this project is

This is a **Next.js 14 dashboard app** migrated from legacy HTML. It currently implements only selected modules from the original dashboard:

1. **Produksi**
   - Hasil Produksi
   - Performa Mesin
2. **Back Order**

Other top-nav modules (QC, Maintenance, Engineering) are currently placeholder/disabled UI.

## Stack

- Next.js 14 (`app` router)
- React 18
- Tailwind CSS
- JavaScript-first feature code

## Runtime + build behavior

- `next.config.js` currently sets:
  - `reactStrictMode: true`
  - `eslint.ignoreDuringBuilds: true`
  - `typescript.ignoreBuildErrors: true`

This means production build is permissive for lint/type issues.

## Auth model (simple gate)

This app has a lightweight password gate:

- Login page: `/login`
- Login API: `POST /api/login`
- Cookie name: `auth_session` (value `'1'`)
- Middleware redirects:
  - unauthenticated users to `/login?next=...`
  - authenticated users away from `/login` back to `/`

### Required env var

Create `.env.local`:

```env
TEMP_PASSWORD=your-password-here
```

Without `TEMP_PASSWORD`, login API returns `500`.

## Main routes

- `/` → dashboard shell (`app/page.js`)
  - renders header + active feature panel
  - active tab managed client-side
- `/login` → sign-in page
- `/api/login` → cookie-setting auth endpoint

## Feature architecture

The app uses a simple feature-oriented split:

- `app/` → route entrypoints + layout
- `components/dashboard/` → shared shell UI (`HeaderNav`)
- `features/hasil-produksi/` → production dashboard module
- `features/backorder/` → backorder dashboard module
- `lib/data/` → in-memory mock data + derivation helpers

## Key files (high signal)

- `app/page.js`
  - Top-level tab state (`hasil_produksi`, `performa_mesin`, `backorder`)
  - switches between `HasilProduksiPage` and `BackorderPage`

- `components/dashboard/HeaderNav.js`
  - main nav, produksi submenu, backorder tab
  - non-converted modules are disabled buttons

- `features/hasil-produksi/HasilProduksiPage.js`
  - period filters: daily/weekly/monthly/yearly
  - factory filters: wotan/cirebon/all
  - mode switch: hasil produksi vs performa mesin
  - metric cards, production tables, machine group details

- `features/backorder/BackorderPage.js`
  - plant/line/velocity/search filters
  - top-10 BO table
  - grouped detail views + recommendation/operational widgets

- `lib/data/hasilProduksi.js`
  - generated/simulated production + machine datasets
  - exports:
    - `periodLabel`, `periodDescription`
    - `getHasilProduksiMetrics(factory, period)`
    - `getMachineData(factory, period)`
    - `getHarianProduksiData(factory, period)`

- `lib/data/backorder.js`
  - static `backOrderData` records used by Back Order page

- `middleware.js`
  - auth guard for all non-static/non-api pages

- `app/api/login/route.js`
  - validates password against `TEMP_PASSWORD`
  - sets auth cookie

## Data status

- Dashboard data is **mock/demo data** in `lib/data/*`.
- No production backend integration yet.
- UI already separated from data functions, so replacing mock data with API calls should be straightforward.

## Design system notes

- Visual style is carried from legacy dashboard.
- Tailwind tokens/theme are defined in `tailwind.config.js`.
- Material Symbols font is loaded in `app/layout.js`.

## Local development

Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build/run:

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Known limitations

- Only Produksi + Back Order modules are converted.
- Authentication is intentionally minimal (single shared password).
- Some TypeScript scaffolding files exist, but current feature implementation is JS-centric.

## Suggested next improvements

1. Replace mock data with API integration layer.
2. Add logout endpoint + logout UI.
3. Harden auth (user identity, hashing, audit).
4. Enable stricter CI by removing build-time lint/type ignores.
5. Convert shared models/data helpers to TypeScript for safer refactors.
