import { cacheLife } from "next/cache";
import { getCuratedCover, getCuratedPhotos } from "./cafe-photos";
import { getCuratedSocials } from "./cafe-socials";
import { parsePoint } from "./geo";
import { isSupabaseConfigured, photoUrl, supabase } from "./supabase";

// Roughly the middle of Cavite; 100 km covers the whole province.
const CAVITE_CENTER = { lat: 14.28, lng: 120.87 };
const CAVITE_RADIUS_M = 100_000;

export type Tag = { slug: string; name: string; category: string };

export type CafeSummary = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  lat: number;
  lng: number;
  priceMin: number | null;
  priceMax: number | null;
  openNow: boolean;
  tags: string[];
  coverUrl: string | null;
};

export type CafeDetail = CafeSummary & {
  address: string | null;
  description: string | null;
  isChain: boolean;
  is24h: boolean;
  fbUrl: string | null;
  igUrl: string | null;
  website: string | null;
  hours: { dayOfWeek: number; opens: string; closes: string }[];
  tagDetails: Tag[];
  photos: { url: string; credit: string; sourceUrl: string | null; isCover: boolean }[];
};

type NearRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  lat: number;
  lng: number;
  price_min: number | null;
  price_max: number | null;
  open_now: boolean;
};

type ExtrasRow = {
  id: string;
  cafe_tags: { tags: { slug: string } | null }[];
  photos: { storage_path: string; is_cover: boolean }[];
};

/** All verified cafés, with open-now evaluated at fetch time (cached for about a minute). */
export async function getCafes(): Promise<CafeSummary[]> {
  "use cache";
  cacheLife("minutes");

  if (!isSupabaseConfigured) {
    return [];
  }

  const [near, extras] = await Promise.all([
    supabase.rpc("cafes_near", {
      p_lat: CAVITE_CENTER.lat,
      p_lng: CAVITE_CENTER.lng,
      radius_m: CAVITE_RADIUS_M,
    }),
    supabase.from("cafes").select("id, cafe_tags(tags(slug)), photos(storage_path, is_cover)"),
  ]);
  if (near.error) throw new Error(`Failed to load cafés: ${near.error.message}`);
  if (extras.error) throw new Error(`Failed to load café tags/photos: ${extras.error.message}`);

  const extrasById = new Map((extras.data as unknown as ExtrasRow[]).map((row) => [row.id, row]));

  return (near.data as NearRow[]).map((row) => {
    const extra = extrasById.get(row.id);
    const cover = extra?.photos.find((p) => p.is_cover) ?? extra?.photos[0];
    const remoteCoverUrl = cover?.storage_path ? photoUrl(cover.storage_path) : null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      city: row.city,
      lat: row.lat,
      lng: row.lng,
      priceMin: row.price_min,
      priceMax: row.price_max,
      openNow: row.open_now,
      tags: extra?.cafe_tags.flatMap((ct) => (ct.tags ? [ct.tags.slug] : [])) ?? [],
      coverUrl: remoteCoverUrl || getCuratedCover(row.slug),
    };
  });
}

export async function getTags(): Promise<Tag[]> {
  "use cache";
  cacheLife("hours");

  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase.from("tags").select("slug, name, category").order("id");
  if (error) throw new Error(`Failed to load tags: ${error.message}`);
  return data;
}

type DetailRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  location: string;
  address: string | null;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  is_chain: boolean;
  is_24h: boolean;
  fb_url: string | null;
  ig_url: string | null;
  website: string | null;
  cafe_hours: { day_of_week: number; opens: string; closes: string }[];
  cafe_tags: { tags: Tag | null }[];
  photos: { storage_path: string; credit: string; source_url: string | null; is_cover: boolean }[];
};

export async function getCafeBySlug(slug: string): Promise<CafeDetail | null> {
  "use cache";
  cacheLife("minutes");

  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from("cafes")
    .select(
      `id, name, slug, city, location, address, description, price_min, price_max, is_chain, is_24h,
       fb_url, ig_url, website,
       cafe_hours(day_of_week, opens, closes),
       cafe_tags(tags(slug, name, category)),
       photos(storage_path, credit, source_url, is_cover)`,
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load café: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as DetailRow;
  const { data: openNow, error: openError } = await supabase.rpc("is_open_now", { p_cafe_id: row.id });
  if (openError) throw new Error(`Failed to check opening hours: ${openError.message}`);

  const { lat, lng } = parsePoint(row.location);
  const tagDetails = row.cafe_tags.flatMap((ct) => (ct.tags ? [ct.tags] : []));
  const photos = [...row.photos]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover))
    .map((p) => ({ url: photoUrl(p.storage_path), credit: p.credit, sourceUrl: p.source_url, isCover: p.is_cover }));

  const effectivePhotos = photos.length > 0 ? photos : getCuratedPhotos(row.slug);
  const coverUrl = effectivePhotos.find((p) => p.isCover)?.url ?? effectivePhotos[0]?.url ?? null;

  const curatedSocials = getCuratedSocials(row.slug);
  const fbUrl = row.fb_url || curatedSocials?.fbUrl || null;
  const igUrl = row.ig_url || curatedSocials?.igUrl || null;
  const website = row.website || curatedSocials?.website || null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city,
    lat,
    lng,
    priceMin: row.price_min,
    priceMax: row.price_max,
    openNow: Boolean(openNow),
    tags: tagDetails.map((t) => t.slug),
    coverUrl,
    address: row.address,
    description: row.description,
    isChain: row.is_chain,
    is24h: row.is_24h,
    fbUrl,
    igUrl,
    website,
    hours: row.cafe_hours
      .map((h) => ({ dayOfWeek: h.day_of_week, opens: h.opens, closes: h.closes }))
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.opens.localeCompare(b.opens)),
    tagDetails,
    photos: effectivePhotos,
  };
}
