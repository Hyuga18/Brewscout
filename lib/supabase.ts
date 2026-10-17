import "server-only";
import { createClient } from "@supabase/supabase-js";

// Public (anon) key only. RLS limits it to verified cafés. Never use the service role key here.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_ANON_KEY (see .env.example).");
}

export const supabase = createClient(url, anonKey, { auth: { persistSession: false } });

export function photoUrl(storagePath: string): string {
  return `${url}/storage/v1/object/public/cafe-photos/${storagePath}`;
}
