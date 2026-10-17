/**
 * Load café details from the review sheet (exported as CSV) into Supabase.
 *
 * One row per café, matched by `slug`. Empty cells keep what's already saved.
 *   action = verify  -> apply the row and set status 'verified'
 *   action = closed  -> set status 'closed'
 *   action = delete  -> delete the café (not a café, or a duplicate)
 *   action = empty   -> skip
 * Rows whose first cell starts with "#" are instructions and are ignored.
 *
 * Run:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/load-sheet.ts sheet.csv           # dry run
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/load-sheet.ts sheet.csv --apply   # write
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import { socialUrl } from "./social-url";

type Row = Record<string, string>;
type Hours = { day_of_week: number; opens: string; closes: string }[];

const DAYS = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const apply = process.argv.includes("--apply");
const csvPath = process.argv.slice(2).find((a) => !a.startsWith("--"));

function parseCsv(text: string): Row[] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    record.push(field);
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      endField();
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endField();
      records.push(record);
      record = [];
    } else {
      field += c;
    }
  }
  if (field || record.length) {
    endField();
    records.push(record);
  }
  const [header, ...body] = records;
  return body
    .filter((r) => r.some((v) => v.trim()) && !r[0]?.trim().startsWith("#"))
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

function parseDays(spec: string): number[] {
  const days = new Set<number>();
  for (const part of spec.toLowerCase().split(",")) {
    const [from, to = from] = part.trim().split("-");
    let d = DAYS.indexOf(from);
    const end = DAYS.indexOf(to);
    if (d < 0 || end < 0) throw new Error(`unknown day "${part.trim()}"`);
    days.add(d);
    while (d !== end) {
      d = (d + 1) % 7;
      days.add(d);
    }
  }
  return [...days];
}

/** "Mo-Fr 08:00-20:00; Sa,Su 09:00-22:00" | "09:00-21:00" (every day) | "Mo-Su 08:00-20:00; We off" | "24/7" */
function parseHours(text: string): { is24h: boolean; hours: Hours } {
  if (text.replace(/\s/g, "") === "24/7") return { is24h: true, hours: [] };
  let hours: Hours = [];
  for (const rule of text.split(";").map((r) => r.trim()).filter(Boolean)) {
    const match = rule.match(/^(?:([A-Za-z,\- ]+?)\s+)?(off|closed|[\d:,\- ]+)$/i);
    if (!match) throw new Error(`can't read "${rule}"`);
    const days = match[1] ? parseDays(match[1]) : [0, 1, 2, 3, 4, 5, 6];
    if (/^(off|closed)$/i.test(match[2])) {
      hours = hours.filter((h) => !days.includes(h.day_of_week)); // "We off" cancels earlier rules
      continue;
    }
    for (const window of match[2].split(",")) {
      const [opens, closes] = window.trim().split("-").map((t) => t.trim());
      if (!/^\d{1,2}:\d{2}$/.test(opens ?? "") || !/^\d{1,2}:\d{2}$/.test(closes ?? "")) {
        throw new Error(`bad time "${window.trim()}" (use 08:00-20:00)`);
      }
      const closesAt = closes === "24:00" ? "00:00" : closes;
      for (const day of days) hours.push({ day_of_week: day, opens, closes: closesAt });
    }
  }
  return { is24h: false, hours };
}

function parsePrice(text: string, column: string): number | undefined {
  if (!text) return undefined;
  const value = Number(text.replace(/[₱,\s]/g, ""));
  if (!Number.isInteger(value) || value < 0) throw new Error(`${column} "${text}" is not a whole number of pesos`);
  return value;
}

async function main() {
  if (!csvPath) throw new Error("Usage: npx tsx scripts/load-sheet.ts <sheet.csv> [--apply]");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const rows = parseCsv(readFileSync(csvPath, "utf8")).filter((r) => r.action);
  const { data: tagRows, error: tagError } = await supabase.from("tags").select("id, slug");
  if (tagError) throw new Error(tagError.message);
  const tagIds = new Map(tagRows.map((t) => [t.slug, t.id]));

  console.log(`${rows.length} rows with an action${apply ? "" : " (dry run: add --apply to write)"}\n`);
  let failures = 0;

  for (const row of rows) {
    const label = `${row.name || row.slug} (${row.slug})`;
    try {
      const action = row.action.toLowerCase();
      const { data: cafe, error } = await supabase.from("cafes").select("id, name").eq("slug", row.slug).maybeSingle();
      if (error) throw new Error(error.message);
      if (!cafe) throw new Error("no café with this slug");

      if (action === "delete" || action === "closed") {
        console.log(`${action.padEnd(7)} ${label}`);
        if (apply) {
          const { error: e } =
            action === "delete"
              ? await supabase.from("cafes").delete().eq("id", cafe.id)
              : await supabase.from("cafes").update({ status: "closed" }).eq("id", cafe.id);
          if (e) throw new Error(e.message);
        }
        continue;
      }
      if (action !== "verify") throw new Error(`unknown action "${row.action}" (use verify, closed, delete)`);

      // Validate everything before writing anything for this café.
      const update: Record<string, unknown> = { status: "verified" };
      const priceMin = parsePrice(row.price_min, "price_min");
      const priceMax = parsePrice(row.price_max, "price_max") ?? priceMin;
      if (priceMin !== undefined) update.price_min = priceMin;
      if (priceMax !== undefined) update.price_max = priceMax;
      if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
        throw new Error("price_min is higher than price_max");
      }
      if (row.description) update.description = row.description;
      if (row.fb_url) update.fb_url = socialUrl(row.fb_url, "https://www.facebook.com/");
      if (row.ig_url) update.ig_url = socialUrl(row.ig_url, "https://www.instagram.com/");
      const hours = row.hours ? parseHours(row.hours) : null;
      if (hours) update.is_24h = hours.is24h;
      const tags = row.tags ? row.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : null;
      const unknownTags = tags?.filter((t) => !tagIds.has(t)) ?? [];
      if (unknownTags.length) throw new Error(`unknown tags: ${unknownTags.join(", ")}`);
      if (row.photo_url && !row.photo_credit) throw new Error("photo_url needs a photo_credit");

      const changes = [
        priceMin !== undefined && `price ₱${priceMin}${priceMax !== priceMin ? `–${priceMax}` : ""}`,
        hours && (hours.is24h ? "24/7" : `${hours.hours.length} opening windows`),
        tags && `${tags.length} tags`,
        row.description && "description",
        row.photo_url && "photo",
      ].filter(Boolean);
      console.log(`verify  ${label}${changes.length ? `: ${changes.join(", ")}` : ""}`);
      if (!apply) continue;

      const { error: updateError } = await supabase.from("cafes").update(update).eq("id", cafe.id);
      if (updateError) throw new Error(updateError.message);

      if (hours) {
        const { error: e1 } = await supabase.from("cafe_hours").delete().eq("cafe_id", cafe.id);
        if (e1) throw new Error(e1.message);
        if (hours.hours.length) {
          const { error: e2 } = await supabase
            .from("cafe_hours")
            .insert(hours.hours.map((h) => ({ ...h, cafe_id: cafe.id })));
          if (e2) throw new Error(e2.message);
        }
      }

      if (tags) {
        const { error: e1 } = await supabase.from("cafe_tags").delete().eq("cafe_id", cafe.id);
        if (e1) throw new Error(e1.message);
        if (tags.length) {
          const { error: e2 } = await supabase
            .from("cafe_tags")
            .insert(tags.map((t) => ({ cafe_id: cafe.id, tag_id: tagIds.get(t) })));
          if (e2) throw new Error(e2.message);
        }
      }

      if (row.photo_url) await addPhoto(supabase, cafe.id, row);
    } catch (err) {
      failures++;
      console.log(`ERROR   ${label}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nDone${apply ? "" : " (dry run)"}. ${failures ? `${failures} rows need fixing.` : "No errors."}`);
  if (failures) process.exitCode = 1;
}

/** Download the photo, store it in the cafe-photos bucket, and add a credited photos row (once). */
async function addPhoto(supabase: SupabaseClient, cafeId: string, row: Row) {
  const res = await fetch(row.photo_url);
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`photo_url didn't return an image (${res.status} ${type})`);
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[type.split(";")[0]];
  if (!ext) throw new Error(`photo must be a JPG, PNG, WebP or AVIF (got ${type})`);
  const path = `${row.slug}/${createHash("sha1").update(row.photo_url).digest("hex").slice(0, 12)}.${ext}`;

  const { data: existing } = await supabase.from("photos").select("id").eq("storage_path", path).maybeSingle();
  if (existing) return;

  const { error: uploadError } = await supabase.storage
    .from("cafe-photos")
    .upload(path, Buffer.from(await res.arrayBuffer()), { contentType: type, upsert: true });
  if (uploadError) throw new Error(`photo upload failed: ${uploadError.message}`);

  const { count } = await supabase.from("photos").select("id", { count: "exact", head: true }).eq("cafe_id", cafeId);
  const { error } = await supabase.from("photos").insert({
    cafe_id: cafeId,
    storage_path: path,
    source_url: row.photo_source_url || null,
    credit: row.photo_credit,
    is_cover: !count,
  });
  if (error) throw new Error(error.message);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
