/**
 * Import Cavite cafés from OpenStreetMap (Overpass API) into Supabase as `unverified`.
 *
 * - Skips cafés whose osm_id is already in the DB, so manual edits are never overwritten.
 * - Auto-flags chains (OSM `brand` tag or a known chain name).
 * - Does not parse OSM `opening_hours` (hours are added by hand); only `24/7` sets is_24h.
 *
 * Run:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/import-osm.ts
 *   npx tsx scripts/import-osm.ts --dry-run     # fetch + print, no DB writes, no keys needed
 *
 * If Overpass returns 0 results, remove ["admin_level"="4"] from the area filter below.
 * If overpass-api.de is unreachable, use a mirror: OVERPASS_URL=https://overpass.kumi.systems/api/interpreter
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { socialUrl } from "./social-url";

const OVERPASS_URL = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";

const OVERPASS_QUERY = `
[out:json][timeout:180];
area["boundary"="administrative"]["name"="Cavite"]["admin_level"="4"]->.cavite;
nwr["amenity"="cafe"](area.cavite);
out center tags;
`;

const CHAIN_NAMES = [
  "starbucks",
  "coffee bean",
  "tim hortons",
  "bo's coffee",
  "bos coffee",
  "dunkin",
  "seattle's best",
  "coffee project",
  "but first coffee",
  "pickup coffee",
  "zus coffee",
  "tomoro",
  "cafe amazon",
  "highlands coffee",
  "figaro",
  "j.co",
  "krispy kreme",
  "toby's estate",
  "dean & deluca",
];

type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type CafeInsert = {
  osm_id: string;
  name: string;
  slug: string;
  location: string;
  address: string | null;
  city: string | null;
  is_chain: boolean;
  is_24h: boolean;
  status: "unverified";
  fb_url: string | null;
  ig_url: string | null;
  website: string | null;
};

const dryRun = process.argv.includes("--dry-run");

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "") // "Joane's" -> "joanes", not "joane-s"
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isChain(tags: Record<string, string>): boolean {
  if (tags.brand || tags["brand:wikidata"]) return true;
  const name = (tags.name ?? "").toLowerCase();
  return CHAIN_NAMES.some((chain) => name.includes(chain));
}

function buildAddress(tags: Record<string, string>): string | null {
  const parts = [
    [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
    tags["addr:barangay"] ?? tags["addr:village"] ?? tags["addr:suburb"],
    tags["addr:city"],
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base || "cafe";
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  taken.add(slug);
  return slug;
}

async function fetchOsmCafes(): Promise<OsmElement[]> {
  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "brewscout-import/0.1 (personal project)",
    },
    body: new URLSearchParams({ data: OVERPASS_QUERY }),
  });
  if (!res.ok) {
    throw new Error(`Overpass request failed: ${res.status} ${res.statusText}\n${await res.text()}`);
  }
  const json = (await res.json()) as { elements: OsmElement[] };
  return json.elements;
}

function toCafe(el: OsmElement, takenSlugs: Set<string>): CafeInsert | null {
  const tags = el.tags ?? {};
  const name = tags.name?.trim();
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (!name || lat == null || lon == null) return null;

  const city = tags["addr:city"]?.trim() || null;
  return {
    osm_id: `${el.type}/${el.id}`,
    name,
    slug: uniqueSlug(slugify(city ? `${name} ${city}` : name), takenSlugs),
    location: `SRID=4326;POINT(${lon} ${lat})`,
    address: buildAddress(tags),
    city,
    is_chain: isChain(tags),
    is_24h: tags.opening_hours?.trim() === "24/7",
    status: "unverified",
    fb_url: socialUrl(tags["contact:facebook"] ?? tags.facebook, "https://www.facebook.com/"),
    ig_url: socialUrl(tags["contact:instagram"] ?? tags.instagram, "https://www.instagram.com/"),
    website: tags.website ?? tags["contact:website"] ?? null,
  };
}

async function fetchAllColumn(
  supabase: SupabaseClient,
  column: "osm_id" | "slug",
): Promise<Set<string>> {
  const values = new Set<string>();
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("cafes")
      .select(column)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Failed to read existing ${column}s: ${error.message}`);
    for (const row of data as Record<string, string | null>[]) {
      if (row[column]) values.add(row[column] as string);
    }
    if (data.length < pageSize) return values;
  }
}

async function main() {
  console.log("Fetching cafés from Overpass…");
  const elements = await fetchOsmCafes();
  console.log(`Overpass returned ${elements.length} elements.`);
  if (elements.length === 0) {
    console.log('No results. Try removing ["admin_level"="4"] from the area filter.');
    return;
  }

  if (dryRun) {
    const cafes = elements
      .map((el) => toCafe(el, new Set()))
      .filter((c): c is CafeInsert => c !== null);
    const skipped = elements.length - cafes.length;
    console.table(
      cafes.map(({ osm_id, name, city, is_chain }) => ({ osm_id, name, city, is_chain })),
    );
    console.log(
      `Dry run: ${cafes.length} importable, ${skipped} skipped (no name), ` +
        `${cafes.filter((c) => c.is_chain).length} chains, ` +
        `${cafes.filter((c) => !c.city).length} without addr:city.`,
    );
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or use --dry-run).");
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const existingOsmIds = await fetchAllColumn(supabase, "osm_id");
  const takenSlugs = await fetchAllColumn(supabase, "slug");

  const fresh = elements.filter((el) => !existingOsmIds.has(`${el.type}/${el.id}`));
  const cafes = fresh
    .map((el) => toCafe(el, takenSlugs))
    .filter((c): c is CafeInsert => c !== null);

  console.log(
    `${existingOsmIds.size} already imported, ${cafes.length} new, ` +
      `${fresh.length - cafes.length} skipped (no name).`,
  );

  const batchSize = 100;
  for (let i = 0; i < cafes.length; i += batchSize) {
    const batch = cafes.slice(i, i + batchSize);
    const { error } = await supabase.from("cafes").insert(batch);
    if (error) throw new Error(`Insert failed at batch ${i / batchSize + 1}: ${error.message}`);
    console.log(`Inserted ${Math.min(i + batchSize, cafes.length)}/${cafes.length}`);
  }

  console.log("Done. New cafés are `unverified` and will not show in the app until verified.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
