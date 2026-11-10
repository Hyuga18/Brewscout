import type { CafeSummary } from "@/lib/cafes";

export type Filters = {
  query: string;
  city: string | null;
  tags: string[];
  maxPrice: number | null;
  openNow: boolean;
  nearMe: boolean;
};

export const PRICE_OPTIONS = [120, 150, 200] as const;

/** Normalize string by stripping diacritics / accents (e.g. "Dasmariñas" -> "dasmarinas") */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function parseFilters(params: URLSearchParams): Filters {
  const price = Number(params.get("price"));
  return {
    query: params.get("q") ?? "",
    city: params.get("city") || null,
    tags: params.get("tags")?.split(",").filter(Boolean) ?? [],
    maxPrice: Number.isFinite(price) && price > 0 ? price : null,
    openNow: params.get("open") === "1",
    nearMe: params.get("sort") === "near",
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
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function hasActiveFilters(filters: Filters): boolean {
  return Boolean(
    filters.query.trim() ||
      filters.city ||
      filters.tags.length ||
      filters.maxPrice ||
      filters.openNow,
  );
}

export function matchesFilters(cafe: CafeSummary, filters: Filters): boolean {
  if (filters.query.trim()) {
    const q = normalize(filters.query.trim());
    const nameMatch = normalize(cafe.name).includes(q);
    const cityMatch = cafe.city ? normalize(cafe.city).includes(q) : false;
    const tagMatch = cafe.tags.some(
      (t) => normalize(t).includes(q) || normalize(t.replace(/-/g, " ")).includes(q),
    );
    if (!nameMatch && !cityMatch && !tagMatch) return false;
  }
  if (filters.city) {
    const allowed = filters.city.split(",").map((c) => normalize(c.trim()));
    if (!cafe.city || !allowed.includes(normalize(cafe.city))) {
      return false;
    }
  }
  if (filters.openNow && !cafe.openNow) return false;

  // Use effective price (min or max fallback)
  if (filters.maxPrice) {
    const effectivePrice = cafe.priceMin ?? cafe.priceMax;
    if (effectivePrice == null || effectivePrice > filters.maxPrice) return false;
  }

  return filters.tags.every((tag) => cafe.tags.includes(tag));
}
