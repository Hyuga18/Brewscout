import type { CafeSummary, Tag } from "@/lib/cafes";
import { getFieldGuideBySlug } from "@/lib/field-guides";

export type Filters = {
  query: string;
  city: string | null;
  tags: string[];
  maxPrice: number | null;
  openNow: boolean;
  nearMe: boolean;
  savedOnly: boolean;
  guide: string | null;
};

export const PRICE_OPTIONS = [120, 150, 200] as const;

/** Normalize string by stripping diacritics / accents (e.g. "Dasmariñas" -> "dasmarinas") */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function parseFilters(params: { get: (name: string) => string | null }): Filters {
  const price = Number(params.get("price"));
  return {
    query: params.get("q") ?? "",
    city: params.get("city") || null,
    tags: params.get("tags")?.split(",").filter(Boolean) ?? [],
    maxPrice: Number.isFinite(price) && price > 0 ? price : null,
    openNow: params.get("open") === "1",
    nearMe: params.get("sort") === "near",
    savedOnly: params.get("saved") === "1",
    guide: params.get("guide") || null,
  };
}

export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.city) params.set("city", filters.city);
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.maxPrice) params.set("price", String(filters.maxPrice));
  if (filters.openNow) params.set("open", "1");
  if (filters.nearMe) params.set("sort", "near");
  if (filters.savedOnly) params.set("saved", "1");
  if (filters.guide) params.set("guide", filters.guide);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function hasActiveFilters(filters: Filters): boolean {
  return Boolean(
    filters.query.trim() ||
      filters.city ||
      filters.tags.length ||
      filters.maxPrice ||
      filters.openNow ||
      filters.savedOnly ||
      filters.guide,
  );
}

/** Precomputes search and city sets once to avoid inner-loop normalization overhead */
export function createFilterPredicate(
  filters: Filters,
  savedIds?: Set<string>,
  tagsBySlug?: Map<string, Tag>,
): (cafe: CafeSummary) => boolean {
  const q = filters.query.trim() ? normalize(filters.query.trim()) : null;
  const allowedCities = filters.city
    ? new Set(filters.city.split(",").map((c) => normalize(c.trim())))
    : null;
  const activeGuide = filters.guide ? getFieldGuideBySlug(filters.guide) : null;
  const guideSlugs = activeGuide ? new Set(activeGuide.cafeSlugs) : null;
  const maxPrice = filters.maxPrice;
  const checkOpen = filters.openNow;
  const checkSaved = filters.savedOnly;
  const requiredTags = filters.tags;

  return (cafe: CafeSummary) => {
    if (guideSlugs && !guideSlugs.has(cafe.slug)) {
      return false;
    }

    if (checkSaved && (!savedIds || !savedIds.has(cafe.id))) {
      return false;
    }

    if (q) {
      const nameMatch = normalize(cafe.name).includes(q);
      const cityMatch = cafe.city ? normalize(cafe.city).includes(q) : false;
      const tagMatch = cafe.tags.some((t) => {
        if (normalize(t).includes(q) || normalize(t.replace(/-/g, " ")).includes(q)) return true;
        const meta = tagsBySlug?.get(t);
        if (meta && (normalize(meta.name).includes(q) || normalize(meta.slug).includes(q))) return true;
        return false;
      });
      if (!nameMatch && !cityMatch && !tagMatch) return false;
    }

    if (allowedCities) {
      if (!cafe.city || !allowedCities.has(normalize(cafe.city))) {
        return false;
      }
    }

    if (checkOpen && !cafe.openNow) return false;

    if (maxPrice) {
      const effectivePrice = cafe.priceMin ?? cafe.priceMax;
      if (effectivePrice == null || effectivePrice > maxPrice) return false;
    }

    return requiredTags.every((tag) => cafe.tags.includes(tag));
  };
}

export function matchesFilters(
  cafe: CafeSummary,
  filters: Filters,
  savedIds?: Set<string>,
  tagsBySlug?: Map<string, Tag>,
): boolean {
  return createFilterPredicate(filters, savedIds, tagsBySlug)(cafe);
}
