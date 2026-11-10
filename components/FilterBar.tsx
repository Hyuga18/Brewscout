"use client";

import { useEffect, useId, useState } from "react";
import type { Tag } from "@/lib/cafes";
import { type Filters, PRICE_OPTIONS } from "./filters";

type Props = {
  filters: Filters;
  cities: string[];
  tags: Tag[];
  locating: boolean;
  savedCount?: number;
  onChange: (next: Filters) => void;
};

const chip =
  "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 min-h-[36px] text-xs sm:text-sm font-medium transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const chipOn = "border-espresso bg-espresso text-paper shadow-xs ring-1 ring-espresso/30";
const chipOff = "border-line bg-surface text-ink hover:border-ink/40";

export function FilterBar({ filters, cities, tags, locating, savedCount = 0, onChange }: Props) {
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

  // Keyboard shortcut: '/' focuses search (guards against browser modifier shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
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
      {/* Debounced Search with Warm Focus Ring & WCAG-Compliant Placeholder */}
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
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-muted transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 shadow-2xs"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onChange({ ...filters, query: "" });
            }}
            className="absolute right-1.5 flex size-9 items-center justify-center rounded-full text-muted hover:bg-line/60 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <span>{locating ? "Locating…" : "Near me"}</span>
        </button>

        {/* Open Now with Calm Status Dot (No Distracting Flashing) */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
          className={`${chip} ${
            filters.openNow
              ? "border-open/40 bg-open-bg text-open font-semibold ring-1 ring-open/30"
              : chipOff
          }`}
          aria-pressed={filters.openNow}
        >
          <span className="flex size-1.5 rounded-full shrink-0" aria-hidden="true">
            <span
              className={`size-1.5 rounded-full ${
                filters.openNow ? "bg-open" : "bg-muted/60"
              }`}
            />
          </span>
          <span>Open now</span>
        </button>

        {/* Scoutlist with Live Saved Count */}
        <button
          type="button"
          onClick={() => onChange({ ...filters, savedOnly: !filters.savedOnly })}
          aria-label={
            savedCount > 0
              ? `Scoutlist, ${savedCount} saved ${savedCount === 1 ? "café" : "cafés"}`
              : "Scoutlist"
          }
          aria-pressed={filters.savedOnly}
          className={`${chip} ${
            filters.savedOnly
              ? "border-accent bg-accent/15 text-espresso font-semibold ring-1 ring-accent/30"
              : chipOff
          }`}
        >
          <svg
            aria-hidden="true"
            className={`size-3.5 transition-transform duration-200 ${
              filters.savedOnly ? "fill-accent stroke-accent" : "fill-none stroke-currentColor"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>Scoutlist</span>
          {savedCount > 0 && (
            <span
              aria-hidden="true"
              className={`flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold ${
                filters.savedOnly
                  ? "bg-accent text-paper"
                  : "bg-line/80 text-muted"
              }`}
            >
              {savedCount}
            </span>
          )}
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
          aria-controls="vibes-filter-drawer"
          aria-expanded={drawerOpen}
          className={`${chip} ${
            activeTagCount > 0
              ? "border-accent bg-accent/15 text-espresso font-semibold"
              : chipOff
          }`}
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
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Categorized Tag Drawer (No Emojis - Authored SVG Line Icons) */}
      {drawerOpen && (
        <div
          id="vibes-filter-drawer"
          className="mt-1 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-xs"
        >
          {/* Work & Study */}
          {categorized.work.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <svg className="size-3.5 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Work & Study</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.work.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      aria-pressed={on}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <svg className="size-3.5 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                </svg>
                <span>Coffee & Craft</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.coffee.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      aria-pressed={on}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <svg className="size-3.5 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Vibe & Atmosphere</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {categorized.vibe.map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      aria-pressed={on}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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

          {/* Practical Amenities */}
          {(categorized.hours.length > 0 || categorized.practical.length > 0) && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <svg className="size-3.5 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <span>Practical Amenities</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[...categorized.hours, ...categorized.practical].map((tag) => {
                  const on = filters.tags.includes(tag.slug);
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      onClick={() => toggleTag(tag.slug)}
                      aria-pressed={on}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
