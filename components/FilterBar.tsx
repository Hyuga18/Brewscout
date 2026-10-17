"use client";

import type { Tag } from "@/lib/cafes";
import { type Filters, PRICE_OPTIONS } from "./filters";

type Props = {
  filters: Filters;
  cities: string[];
  tags: Tag[];
  locating: boolean;
  onChange: (next: Filters) => void;
};

const chip = "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors";
const chipOn = "border-ink bg-ink text-surface";
const chipOff = "border-line bg-surface text-ink hover:border-ink/30";

export function FilterBar({ filters, cities, tags, locating, onChange }: Props) {
  const toggleTag = (slug: string) =>
    onChange({
      ...filters,
      tags: filters.tags.includes(slug) ? filters.tags.filter((t) => t !== slug) : [...filters.tags, slug],
    });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...filters, nearMe: !filters.nearMe })}
          className={`${chip} ${filters.nearMe ? chipOn : chipOff}`}
          aria-pressed={filters.nearMe}
        >
          {locating ? "Locating…" : "📍 Near me"}
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`${chip} ${filters.openNow ? chipOn : chipOff}`}
          aria-pressed={filters.openNow}
        >
          Open now
        </button>
        <select
          aria-label="City"
          value={filters.city ?? ""}
          onChange={(e) => onChange({ ...filters, city: e.target.value || null })}
          className={`${chip} ${filters.city ? chipOn : chipOff} appearance-none pr-7 bg-[length:10px] bg-[right_0.6rem_center] bg-no-repeat`}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          aria-label="Latte price"
          value={filters.maxPrice ?? ""}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })}
          className={`${chip} ${filters.maxPrice ? chipOn : chipOff} appearance-none pr-7 bg-[length:10px] bg-[right_0.6rem_center] bg-no-repeat`}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
        >
          <option value="">Any price</option>
          {PRICE_OPTIONS.map((price) => (
            <option key={price} value={price}>
              Latte ≤ ₱{price}
            </option>
          ))}
        </select>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {tags.map((tag) => {
          const on = filters.tags.includes(tag.slug);
          return (
            <button
              key={tag.slug}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              className={`${chip} ${on ? chipOn : chipOff}`}
              aria-pressed={on}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
