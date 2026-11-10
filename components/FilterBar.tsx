"use client";

import { useEffect, useId, useState } from "react";
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
  "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer select-none";
const chipOn = "border-espresso bg-espresso text-paper shadow-xs ring-1 ring-espresso/30";
const chipOff = "border-line bg-surface text-ink hover:border-ink/40";

export function FilterBar({ filters, cities, tags, locating, onChange }: Props) {
  const [searchInput, setSearchInput] = useState(filters.query);
  const [prevQuery, setPrevQuery] = useState(filters.query);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchId = useId();

  // Adjust state during render when filters.query prop changes externally (e.g. clear filters)
  if (filters.query !== prevQuery) {
    setPrevQuery(filters.query);
    setSearchInput(filters.query);
  }

  // 250ms debounced search avoids URL thrashing and input lag
  useEffect(() => {
    if (searchInput === filters.query) return;
    const timer = setTimeout(() => {
      onChange({ ...filters, query: searchInput });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput, filters, onChange]);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "") &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        document.getElementById(searchId)?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchId]);

  const toggleTag = (slug: string) =>
    onChange({
      ...filters,
      tags: filters.tags.includes(slug)
        ? filters.tags.filter((t) => t !== slug)
        : [...filters.tags, slug],
    });

  // Group tags by domain category
  const categorized = {
    work: tags.filter((t) => t.category === "work"),
    coffee: tags.filter((t) => t.category === "coffee"),
    vibe: tags.filter((t) => t.category === "vibe"),
    hours: tags.filter((t) => t.category === "hours"),
    practical: tags.filter((t) => t.category === "practical"),
  };

  const activeTagCount = filters.tags.length;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Debounced Search with Warm Focus Ring & Keyboard Shortcut */}
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
          id={searchId}
          type="search"
          aria-label="Search cafés by name, city, or tag"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search cafés, cities, vibes… (Press '/' to focus)"
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-muted/70 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 shadow-2xs"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onChange({ ...filters, query: "" });
            }}
            className="absolute right-1.5 flex size-9 items-center justify-center rounded-full text-muted hover:bg-line/60 hover:text-ink cursor-pointer"
            aria-label="Clear search"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Primary Action Pills */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Near Me with GPS Status */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, nearMe: !filters.nearMe })}
          className={`${chip} ${
            filters.nearMe
              ? "border-espresso bg-espresso text-paper shadow-2xs"
              : chipOff
          }`}
          aria-pressed={filters.nearMe}
        >
          <svg
            className={`size-3.5 ${locating ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <span>{locating ? "Locating…" : "Near me"}</span>
        </button>

        {/* Open Now with Emerald Live Pulse */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`${chip} ${
            filters.openNow
              ? "border-open/40 bg-[#edf7f1] text-open font-semibold ring-1 ring-open/30"
              : chipOff
          }`}
          aria-pressed={filters.openNow}
        >
          <span className="relative flex size-2 items-center justify-center">
            {filters.openNow && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-open opacity-75" />
            )}
            <span
              className={`size-1.5 rounded-full ${
                filters.openNow ? "bg-open" : "bg-muted/60"
              }`}
            />
          </span>
          <span>Open now</span>
        </button>

        {/* City Filter */}
        <div className="relative">
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
            <option value="" className="bg-surface text-ink">
              All cities
            </option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-surface text-ink">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Max Latte Price */}
        <div className="relative">
          <select
            aria-label="Latte price"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : null,
              })
            }
            className={`${chip} ${filters.maxPrice ? chipOn : chipOff} appearance-none pr-7 bg-[length:10px] bg-[right_0.6rem_center] bg-no-repeat`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" className="bg-surface text-ink">
              Any price
            </option>
            {PRICE_OPTIONS.map((price) => (
              <option key={price} value={price} className="bg-surface text-ink">
                Latte ≤ ₱{price}
              </option>
            ))}
          </select>
        </div>

        {/* More Filters Accordion Trigger with Badge Counter */}
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`${chip} ${
            activeTagCount > 0
              ? "border-accent bg-accent/15 text-espresso font-semibold"
              : chipOff
          }`}
          aria-expanded={drawerOpen}
        >
          <span>Vibes</span>
          {activeTagCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[10px] text-paper font-bold">
              {activeTagCount}
            </span>
          )}
          <svg
            className={`size-3 transition-transform duration-200 ${
              drawerOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Categorized Tag Drawer */}
      {drawerOpen && (
        <div className="mt-1 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
          {/* Work & Study */}
          {categorized.work.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                💻 Work & Study
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.work.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                        on
                          ? "bg-espresso text-paper shadow-2xs"
                          : "bg-surface-sub text-ink hover:bg-line/60"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coffee & Craft */}
          {categorized.coffee.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                ☕ Coffee & Craft
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.coffee.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                        on
                          ? "bg-espresso text-paper shadow-2xs"
                          : "bg-surface-sub text-ink hover:bg-line/60"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vibe & Atmosphere */}
          {categorized.vibe.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                ✨ Vibe & Atmosphere
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.vibe.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                        on
                          ? "bg-espresso text-paper shadow-2xs"
                          : "bg-surface-sub text-ink hover:bg-line/60"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hours & Practical */}
          {(categorized.hours.length > 0 || categorized.practical.length > 0) && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                🚗 Practical Amenities
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[...categorized.hours, ...categorized.practical].map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                        on
                          ? "bg-espresso text-paper shadow-2xs"
                          : "bg-surface-sub text-ink hover:bg-line/60"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
