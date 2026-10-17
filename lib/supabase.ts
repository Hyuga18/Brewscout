import "server-only";
import { createClient } from "@supabase/supabase-js";

// Public (anon) key only. RLS limits it to verified cafés. Never use the service role key here.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_ANON_KEY (see .env.example).");
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  // Caching is handled by "use cache" + cacheLife in lib/cafes.ts. Without this, Next.js also keeps
  // each response in its fetch cache for 15 minutes (surviving rebuilds), so new cafés and
  // open-now changes would show up late.
  global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
});

export function photoUrl(storagePath: string): string {
  return `${url}/storage/v1/object/public/cafe-photos/${storagePath}`;
}
