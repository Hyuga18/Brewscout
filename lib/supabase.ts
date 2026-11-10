import "server-only";
import { createClient } from "@supabase/supabase-js";

// Public (anon) key only. RLS limits it to verified cafés. Never use the service role key here.
// Support both standard and NEXT_PUBLIC_ prefixed environment variables for Vercel/Supabase integrations.
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not defined. Using fallback client for build evaluation.");
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: false },
      // Caching is handled by "use cache" + cacheLife in lib/cafes.ts. Without this, Next.js also keeps
      // each response in its fetch cache for 15 minutes (surviving rebuilds), so new cafés and
      // open-now changes would show up late.
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    })
  : createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: { persistSession: false },
    });

export function photoUrl(storagePath: string): string {
  if (!url) return "";
  return `${url}/storage/v1/object/public/cafe-photos/${storagePath}`;
}
