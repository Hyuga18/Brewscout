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

const chip =
  "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none";
const chipOn = "border-ink bg-ink text-surface shadow-xs";
const chipOff = "border-line bg-surface text-ink hover:border-ink/40";

export function FilterBar({ filters, cities, tags, locating, onChange }: Props) {
  const toggleTag = (slug: string) =>
    onChange({
      ...filters,
      tags: filters.tags.includes(slug)
        ? filters.tags.filter((t) => t !== slug)
        : [...filters.tags, slug],
    });

  return (
    <div className="flex flex-col gap-2.5">
      {/* Search Input */}
      <div className="relative flex items-center">
        <svg
          className="pointer-events-none absolute left-3.5 size-4 text-muted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          aria-label="Search cafés by name, city, or tag"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search cafés, cities, tags…"
          className="w-full rounded-xl border border-line bg-surface py-2 pl-10 pr-9 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, query: "" })}
            className="absolute right-2.5 rounded-full p-1 text-muted hover:bg-line/60 hover:text-ink"
            aria-label="Clear search"
          >
            <svg
              className="size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Primary Action Chips & Dropdowns */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Near Me Button with SVG pin */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, nearMe: !filters.nearMe })}
          className={`${chip} ${filters.nearMe ? chipOn : chipOff}`}
          aria-pressed={filters.nearMe}
        >
          <svg
            className={`size-3.5 ${locating ? "animate-spin" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            {locating ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            )}
          </svg>
          <span>{locating ? "Locating…" : "Near me"}</span>
        </button>

        {/* Open Now Button with Clock SVG */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`${chip} ${filters.openNow ? chipOn : chipOff}`}
          aria-pressed={filters.openNow}
        >
          <svg
            className="size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span>Open now</span>
        </button>

        {/* City Filter */}
        <select
          aria-label="City"
          value={filters.city ?? ""}
          onChange={(e) => onChange({ ...filters, city: e.target.value || null })}
          className={`${chip} ${filters.city ? chipOn : chipOff} appearance-none pr-7 bg-[length:10px] bg-[right_0.6rem_center] bg-no-repeat`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city} className="bg-surface text-ink">
              {city}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          aria-label="Latte price"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })
          }
          className={`${chip} ${filters.maxPrice ? chipOn : chipOff} appearance-none pr-7 bg-[length:10px] bg-[right_0.6rem_center] bg-no-repeat`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="">Any price</option>
          {PRICE_OPTIONS.map((price) => (
            <option key={price} value={price} className="bg-surface text-ink">
              Latte ≤ ₱{price}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Scrollable Row */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {tags.map((tag) => {
          const on = filters.tags.includes(tag.slug);
          return (
            <button
              key={tag.slug}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              className={`${chip} ${on ? chipOn : chipOff} text-xs py-1`}
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
