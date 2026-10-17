# Brewscout — Project Context

Personal coffee shop finder web app for **Cavite, Philippines**. This file is the handoff from the planning session. Read it before writing code.

## Goal

Help people find cafés in Cavite by the things Google Maps doesn't structure: work-friendliness (wifi, outlets), open late, price range, and vibe.

**v1 success:** ~50 verified cafés, working map + list + filters, deployed, and actually useful day to day.

This is a **personal / portfolio project**. No real-user features (accounts, reviews, owner listings) in v1.

## Scope

**In (v1)**
- Map view + list view, "near me" sorting via browser geolocation
- Filters: city, tags, price range, open now — synced to the URL
- Café detail page
- Owner (me) edits data via the Supabase dashboard; no admin UI yet

**Out (later)**
- User accounts, reviews, favorites
- Public café submissions
- Other provinces (Luzon expansion comes after Cavite data is solid)

## Tech stack (decided)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind |
| Map | MapLibre GL + free OSM-based tiles (no Google Maps billing) |
| DB / backend | Supabase: Postgres + PostGIS + Storage |
| Hosting | Vercel |
| PWA | Added at the end (milestone 4) |

## Data sourcing

1. Pull cafés from OpenStreetMap (Overpass API) → import as `unverified`
2. Manually clean: remove closed/duplicates, fix names, locations, slugs, city
3. Enrich: hours, price range, tags, photos
4. Set `status = 'verified'` — **the app only shows verified cafés**

Priority order for verification: Tagaytay → Silang → Dasmariñas → Imus/Bacoor → rest of Cavite.

Do **not** scrape Google Maps or Facebook. Google Places API is not used (cost + ToS limits on storing data).

### Photos

Use the **cafés' own photos** (from their FB/IG pages), always with credit and a link back (`photos.credit`, `photos.source_url`). Stored in Supabase Storage bucket `cafe-photos` (public).

## Data model

Defined in `supabase/migrations/0001_init.sql`.

- **cafes** — id, osm_id (unique, nullable), name, slug, location `geography(Point,4326)`, address, city, price_min, price_max (typical latte price, PHP), is_chain, is_24h, status (`unverified | verified | closed`), description, fb_url, ig_url, website, created_at, updated_at
- **cafe_hours** — cafe_id, day_of_week (0 = Sunday … 6 = Saturday), opens, closes. `closes < opens` means the window runs past midnight. 24/7 cafés use `cafes.is_24h` instead of rows.
- **tags** — id, slug, name, category (`work | hours | vibe | practical | coffee | location`)
- **cafe_tags** — cafe_id, tag_id
- **photos** — id, cafe_id, storage_path, source_url, credit, is_cover (max one cover per café)

### SQL functions

- `is_open_now(cafe_id, at default now())` — evaluated in **Asia/Manila** time; handles past-midnight windows and `is_24h`
- `cafes_near(p_lat, p_lng, radius_m default 5000)` — verified cafés within radius, nearest first; returns id, name, slug, city, lat, lng, price_min, price_max, distance_m, open_now

### RLS

All tables have RLS on. Public (anon) can only `select` verified cafés and their related hours/tags/photos; tags are fully readable. All writes go through the dashboard or the service role key. Never expose the service role key to the client.

### Seed tags

- work: fast-wifi, outlets, laptop-friendly, quiet
- hours: open-late
- vibe: with-view, aesthetic, cozy, al-fresco
- practical: parking, pet-friendly, aircon
- coffee: specialty, local-beans
- location: near-campus

## Pages

- `/` — map + list split view with filter bar. Mobile: map on top, list as a bottom sheet.
- `/cafe/[slug]` — detail: photos (with credits), hours, open-now badge, price range, tags, address, "Directions" link to Google Maps
- `/about` — optional; how cafés are picked

## Milestones

| # | Deliverable | Status |
|---|---|---|
| 1 | Schema, OSM import script, 20 cafés cleaned | Schema live, 389 cafés imported (unverified), cities filled; verification in progress (`docs/review/`) |
| 2 | Next.js app: map + list + detail page with real data | Done |
| 3 | Filters, near me, open now, 50 cafés verified, deployed | Deployed at https://brewscout-hyuga.vercel.app (Vercel, auto-deploys from `master`); 4 cafés provisionally verified, ~46 to go |
| 4 | Polish, PWA, mobile UX, portfolio README | Not started |

## Existing files

- `supabase/migrations/0001_init.sql` — full schema, functions, RLS, seed tags
- `scripts/import-osm.ts` — fetches Cavite cafés from Overpass, inserts as `unverified`, auto-flags chains (OSM `brand` tag or name match), skips already-imported `osm_id`s so manual edits are never overwritten
  - Run: `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/import-osm.ts`
  - If Overpass returns 0 results, remove `["admin_level"="4"]` from the area filter
  - OSM `opening_hours` is not parsed; hours are added by hand

- `scripts/fill-cities.ts` — fills empty `city` from OSM town boundaries (Cavite's 23 LGUs only)
- `scripts/load-sheet.ts` — loads the review Google Sheet (exported as CSV) into Supabase: prices, hours, tags, description, links, photos (downloaded into `cafe-photos` with credit), and status. Dry run by default; `--apply` writes. Empty cells keep existing data.
  - Run: `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run load:sheet -- sheet.csv --apply`
- Review sheet: Google Sheet "Brewscout café sheet (Tagaytay & Silang)" in the owner's Drive (id `15XWYE6i1x3lPvoy6hQbve5toK-3PwcQoWKBRzsiFuwA`)

## Next step

Milestone 1 verification, then milestone 2:
1. Run the migration on a fresh Supabase project, create the `cafe-photos` bucket, run the import, fix any errors
2. Scaffold the Next.js app (App Router, TypeScript, Tailwind), set up the Supabase client (anon key only on the client)
3. Build `/` with MapLibre + list using `cafes_near` (fallback: all verified cafés sorted by name when location is denied)
4. Build `/cafe/[slug]`

## App notes

- Next.js 16 with Cache Components: read `node_modules/next/dist/docs/` before changing data fetching. Data functions in `lib/cafes.ts` use `"use cache"` + `cacheLife("minutes")`; anything reading the current time needs `await io()` inside a Suspense boundary.
- Data is read server-side with the anon key (`SUPABASE_URL`, `SUPABASE_ANON_KEY`); the browser never talks to Supabase. The list uses `cafes_near` with a 100 km radius around Cavite to get every verified café with lat/lng and open-now; filtering and near-me sorting happen client-side.
- Map tiles: OpenFreeMap (`positron` style), no API key. MapLibre's worker is copied into `public/` by `scripts/copy-maplibre-worker.mjs` (runs on `predev`/`prebuild`).
- Filters live in the URL: `?city=Tagaytay&tags=fast-wifi,outlets&price=150&open=1&sort=near`.

## Conventions

- TypeScript everywhere
- Times and "open now" logic always in `Asia/Manila`
- Prices in PHP, stored as integers
- Slugs: lowercase, accents stripped (Dasmariñas → dasmarinas)
- Keep it simple — personal project, no over-engineering
