/**
 * Fill in `cafes.city` for imported cafés that have none, using the OSM city/municipality
 * boundaries (admin_level=6) inside Cavite. Only touches rows where city is null, so manual
 * edits are never overwritten. Safe to re-run.
 *
 * Run:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/fill-cities.ts
 *   npx tsx scripts/fill-cities.ts --dry-run     # print the osm_id -> city mapping summary only
 *
 * Set OVERPASS_URL to use a mirror (e.g. https://overpass.kumi.systems/api/interpreter).
 */
import { createClient } from "@supabase/supabase-js";

const OVERPASS_URL = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";

// For each city/municipality in Cavite: print the area (with its name), then the cafés inside it.
const OVERPASS_QUERY = `
[out:json][timeout:300];
area["boundary"="administrative"]["name"="Cavite"]["admin_level"="4"]->.cavite;
rel(area.cavite)["boundary"="administrative"]["admin_level"="6"];
map_to_area->.towns;
foreach.towns->.town(
  .town out tags;
  nwr(area.town)["amenity"="cafe"];
  out ids;
);
`;

type OsmElement = {
  type: "node" | "way" | "relation" | "area";
  id: number;
  tags?: Record<string, string>;
};

const dryRun = process.argv.includes("--dry-run");

// Cavite's 23 cities and municipalities. Neighbouring towns whose boundaries touch Cavite
// (e.g. Calamba, Laguna) also come back from Overpass, so anything not listed is ignored.
const CAVITE_TOWNS = new Set([
  "Alfonso", "Amadeo", "Bacoor", "Carmona", "Cavite City", "Dasmariñas",
  "General Emilio Aguinaldo", "General Mariano Alvarez", "General Trias", "Imus", "Indang",
  "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang",
  "Tagaytay", "Tanza", "Ternate", "Trece Martires",
]);

// "City of Imus" / "Imus City" -> "Imus", but keep names where "City" is part of the name.
function cleanTownName(name: string): string {
  if (name === "Cavite City") return name;
  return name.replace(/^City of\s+/i, "").replace(/\s+City$/i, "").trim();
}

async function fetchCafeTowns(): Promise<Map<string, string>> {
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
  const { elements } = (await res.json()) as { elements: OsmElement[] };

  const townByOsmId = new Map<string, string>();
  let currentTown: string | null = null;
  for (const el of elements) {
    if (el.type === "area") {
      const name = el.tags?.name ? cleanTownName(el.tags.name) : null;
      currentTown = name && CAVITE_TOWNS.has(name) ? name : null;
    } else if (currentTown) {
      townByOsmId.set(`${el.type}/${el.id}`, currentTown);
    }
  }
  return townByOsmId;
}

async function main() {
  console.log("Fetching Cavite town boundaries and the cafés inside them…");
  const townByOsmId = await fetchCafeTowns();
  const towns = new Set(townByOsmId.values());
  console.log(`Mapped ${townByOsmId.size} OSM cafés across ${towns.size} towns.`);
  if (townByOsmId.size === 0) {
    console.log('No results. Try removing ["admin_level"="4"] from the area filter.');
    return;
  }

  if (dryRun) {
    const counts = new Map<string, number>();
    for (const town of townByOsmId.values()) counts.set(town, (counts.get(town) ?? 0) + 1);
    console.table([...counts].sort((a, b) => b[1] - a[1]).map(([town, cafes]) => ({ town, cafes })));
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or use --dry-run).");
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: missing, error } = await supabase
    .from("cafes")
    .select("osm_id")
    .is("city", null)
    .not("osm_id", "is", null)
    .limit(5000);
  if (error) throw new Error(`Failed to read cafés without a city: ${error.message}`);

  const osmIdsByTown = new Map<string, string[]>();
  const unmatched: string[] = [];
  for (const { osm_id } of missing as { osm_id: string }[]) {
    const town = townByOsmId.get(osm_id);
    if (!town) {
      unmatched.push(osm_id);
      continue;
    }
    osmIdsByTown.set(town, [...(osmIdsByTown.get(town) ?? []), osm_id]);
  }

  let updated = 0;
  for (const [town, osmIds] of osmIdsByTown) {
    const { error: updateError, count } = await supabase
      .from("cafes")
      .update({ city: town }, { count: "exact" })
      .in("osm_id", osmIds)
      .is("city", null);
    if (updateError) throw new Error(`Update failed for ${town}: ${updateError.message}`);
    updated += count ?? 0;
    console.log(`${town}: ${count}`);
  }

  console.log(`Done. Filled city for ${updated} cafés; ${unmatched.length} still without a city.`);
  if (unmatched.length) console.log(`Unmatched: ${unmatched.join(", ")}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
