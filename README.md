# Brewscout

Find cafés in Cavite, Philippines by what Google Maps doesn't structure: wifi and outlets, open late, price range, and vibe.

Personal / portfolio project. See [`CLAUDE.md`](CLAUDE.md) for the full plan, data model, and milestones.

## Setup (milestone 1)

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
6. Clean and enrich cafés in the Supabase dashboard, then set `status = 'verified'`. The app only shows verified cafés.
