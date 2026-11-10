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

export function parseFilters(params: URLSearchParams): Filters {
  const price = Number(params.get("price"));
  return {
    query: params.get("q")?.trim() ?? "",
    city: params.get("city") || null,
    tags: params.get("tags")?.split(",").filter(Boolean) ?? [],
    maxPrice: Number.isFinite(price) && price > 0 ? price : null,
    openNow: params.get("open") === "1",
    nearMe: params.get("sort") === "near",
  };
}

export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
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
    const q = filters.query.trim().toLowerCase();
    const nameMatch = cafe.name.toLowerCase().includes(q);
    const cityMatch = cafe.city ? cafe.city.toLowerCase().includes(q) : false;
    const tagMatch = cafe.tags.some((t) => t.toLowerCase().includes(q));
    if (!nameMatch && !cityMatch && !tagMatch) return false;
  }
  if (filters.city && cafe.city !== filters.city) return false;
  if (filters.openNow && !cafe.openNow) return false;
  if (filters.maxPrice && (cafe.priceMin == null || cafe.priceMin > filters.maxPrice)) return false;
  return filters.tags.every((tag) => cafe.tags.includes(tag));
}
