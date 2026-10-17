# Brewscout

Find cafés in Cavite, Philippines by what Google Maps doesn't structure: wifi and outlets, open late, price range, and vibe.

Personal / portfolio project. See [`CLAUDE.md`](CLAUDE.md) for the full plan, data model, and milestones.

## Run the app

1. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Supabase → Project Settings → API Keys → the public anon/publishable key).
2. `npm install`, then `npm run dev` and open http://localhost:3000.

Only cafés with `status = 'verified'` appear. Deploying to Vercel: import the repo and add the same two environment variables.

## Data setup (milestone 1)

1. Create a Supabase project (Singapore region is closest).
2. In the SQL editor, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   It enables PostGIS, creates the tables, functions, RLS policies, the public `cafe-photos` storage bucket, and seed tags.
3. Install dependencies: `npm install`
4. Preview the OpenStreetMap import (no keys needed): `npm run import:osm -- --dry-run`
5. Import into Supabase as `unverified`:

   ```sh
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run import:osm
   ```

   Re-running is safe: cafés already imported (by `osm_id`) are skipped, so manual edits are kept.
6. Fill in missing cities from OSM town boundaries (only touches cafés with no city):

   ```sh
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/fill-cities.ts
   ```

   If `overpass-api.de` is unreachable, add `OVERPASS_URL=https://overpass.kumi.systems/api/interpreter` to either script.
7. Fill in café details in the review sheet, export it as CSV, then load it (dry run first, then `--apply`):

   ```sh
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run load:sheet -- sheet.csv --apply
   ```

8. Or clean and enrich cafés in the Supabase dashboard, then set `status = 'verified'`. The app only shows verified cafés.
