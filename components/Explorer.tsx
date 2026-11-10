"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CafeCard } from "./CafeCard";
import { CafeMap } from "./CafeMap";
import { FilterBar } from "./FilterBar";
import {
  type Filters,
  createFilterPredicate,
  filtersToQuery,
  hasActiveFilters,
  parseFilters,
} from "./filters";
import type { CafeSummary, Tag } from "@/lib/cafes";
import { distanceMeters, type LatLng } from "@/lib/geo";
import { useScoutlist } from "@/lib/scoutlist";

type Props = {
  cafes: CafeSummary[];
  tags: Tag[];
};

type SheetSnap = "peek" | "mid" | "full";

const CAVITE_REGIONS = [
  { label: "All Cavite", cities: [] },
  { label: "Tagaytay & Silang", cities: ["Tagaytay", "Silang", "Alfonso", "Amadeo", "Mendez"] },
  { label: "Dasmariñas", cities: ["Dasmariñas"] },
  { label: "Imus & Bacoor", cities: ["Imus", "Bacoor"] },
  { label: "Gen. Trias & Trece", cities: ["General Trias", "Trece Martires", "Tanza"] },
];

const SNAP_CLASSES: Record<SheetSnap, string> = {
  peek: "max-lg:h-[104px]",
  mid: "max-lg:h-[50dvh]",
  full: "max-lg:h-[88dvh]",
};

export function Explorer({ cafes, tags }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const [location, setLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("mid");
  const [mobileView, setMobileView] = useState<"map" | "list">("list");

  const sheetRef = useRef<HTMLElement>(null);
  const touchStartY = useRef<number | null>(null);
  const hasSwipedRef = useRef(false);

  const { savedSet, count: savedCount } = useScoutlist();

  const setFilters = useCallback(
    (next: Filters) => {
      if (next.nearMe && !filters.nearMe) setLocationError(null);
      router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false });
    },
    [filters.nearMe, pathname, router],
  );

  const clearFilters = useCallback(() => {
    setFilters({
      ...filters,
      query: "",
      city: null,
      tags: [],
      maxPrice: null,
      openNow: false,
      savedOnly: false,
    });
  }, [filters, setFilters]);

  // Request user geolocation on "near me" toggle
  useEffect(() => {
    if (!filters.nearMe || location) return;
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocationError("Browser location unavailable."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location permission off; sorted A–Z."),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }, [filters.nearMe, location]);

  const nearMeActive = filters.nearMe && location != null;
  const locating = filters.nearMe && !location && !locationError;

  const cities = useMemo(
    () => [...new Set(cafes.map((c) => c.city).filter((c): c is string => Boolean(c)))].sort(),
    [cafes],
  );
  const tagsBySlug = useMemo(() => new Map(tags.map((t) => [t.slug, t])), [tags]);

  // Ambient statistics
  const stats = useMemo(() => {
    const total = cafes.length;
    const openNow = cafes.filter((c) => c.openNow).length;
    const prices = cafes.map((c) => c.priceMin).filter((p): p is number => p != null && p > 0);
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
    return { total, openNow, avgPrice };
  }, [cafes]);

  // Filter with pre-compiled predicate
  const predicate = useMemo(
    () => createFilterPredicate(filters, savedSet, tagsBySlug),
    [filters, savedSet, tagsBySlug],
  );

  const visible = useMemo(() => {
    const rows = cafes
      .filter(predicate)
      .map((cafe) => ({ cafe, distance: location ? distanceMeters(location, cafe) : null }));
    return nearMeActive
      ? rows.sort((a, b) => a.distance! - b.distance!)
      : rows.sort((a, b) => a.cafe.name.localeCompare(b.cafe.name));
  }, [cafes, predicate, location, nearMeActive]);

  const visibleCafes = useMemo(() => visible.map((v) => v.cafe), [visible]);

  const selectFromMap = useCallback((id: string) => {
    setSelectedId(id || null);
    if (id) {
      setSheetSnap("mid");
    }
  }, []);

  const handleCardSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleCardHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // Touch gesture handlers for mobile bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (Math.abs(deltaY) > 30) {
      hasSwipedRef.current = true;
      setTimeout(() => {
        hasSwipedRef.current = false;
      }, 300);
      if (deltaY < -30) {
        setSheetSnap((curr) => (curr === "peek" ? "mid" : "full"));
        setMobileView("list");
      } else if (deltaY > 30) {
        setSheetSnap((curr) => {
          const next = curr === "full" ? "mid" : "peek";
          if (curr === "mid") setMobileView("map");
          return next;
        });
      }
    }
  };

  const handleDragHandleClick = () => {
    if (hasSwipedRef.current) {
      hasSwipedRef.current = false;
      return;
    }
    setSheetSnap((c) => (c === "peek" ? "mid" : c === "mid" ? "full" : "peek"));
  };

  // Friendly human-readable region label
  const activeRegion = CAVITE_REGIONS.find(
    (r) => r.cities.length > 0 && r.cities.join(",") === filters.city,
  );
  const displayCity = activeRegion ? activeRegion.label : filters.city;

  return (
    <div className="relative flex flex-1 flex-col h-[calc(100dvh-3.5rem)] lg:flex-row lg:overflow-hidden">
      {/* Accessible Landmarks & Skip Link */}
      <h1 className="sr-only">Cavite Specialty Coffee Gazetteer</h1>
      <a
        href="#cafe-directory-feed"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-paper focus:shadow-md"
      >
        Skip map to café list
      </a>

      {/* DOM ORDER 1: Directory Sidebar (visually on left on desktop, natural reading order for screen readers & Tab flow) */}
      <section
        id="cafe-directory-feed"
        ref={sheetRef}
        tabIndex={-1}
        aria-label="Café directory"
        className={`fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl bg-paper shadow-[0_-12px_32px_rgba(31,22,16,0.12)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none lg:static lg:mt-0 lg:w-[480px] lg:h-full lg:flex-none lg:overflow-hidden lg:rounded-none lg:border-r lg:border-line lg:shadow-none ${SNAP_CLASSES[sheetSnap]}`}
      >
        <h2 className="sr-only">Curated Directory Results</h2>

        {/* Pinned Bottom Sheet Header & Filters (stays visible when scrolling feed) */}
        <div className="shrink-0 px-4 pt-2">
          {/* Mobile Tactile Drag Handle */}
          <button
            type="button"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleDragHandleClick}
            style={{ touchAction: "none" }}
            className="mx-auto mb-2 flex h-8 w-full cursor-grab items-center justify-center active:cursor-grabbing lg:hidden"
            aria-label="Toggle drawer height"
            aria-expanded={sheetSnap !== "peek"}
          >
            <div className="h-1.5 w-12 rounded-full bg-ink/20 active:bg-ink/40 transition-colors" />
          </button>

          {/* Desktop Editorial Field Stats */}
          <div className="hidden lg:flex items-center justify-between border-b border-line/60 pb-3 mb-3.5 text-xs text-muted font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-ink">
                <span className="size-2 rounded-full bg-accent" />
                <strong className="tabular-nums font-semibold">{stats.total}</strong> Verified Cafés
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-open">
                <span className="size-1.5 rounded-full bg-open" />
                <strong className="tabular-nums font-semibold">{stats.openNow}</strong> Open Now
              </span>
              {stats.avgPrice && (
                <>
                  <span>·</span>
                  <span className="tabular-nums">Avg Latte ₱{stats.avgPrice}</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-muted-light font-medium">Cavite Gazetteer</span>
          </div>

          {/* Filter Bar with Debounced Search */}
          <FilterBar
            filters={filters}
            cities={cities}
            tags={tags}
            locating={locating}
            savedCount={savedCount}
            onChange={setFilters}
          />

          {/* Cavite Micro-Region Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
            {CAVITE_REGIONS.map((region) => {
              const regionQuery = region.cities.join(",");
              const isActive =
                region.cities.length === 0
                  ? filters.city == null
                  : filters.city === regionQuery;
              return (
                <button
                  key={region.label}
                  type="button"
                  onClick={() => {
                    if (region.cities.length === 0) {
                      setFilters({ ...filters, city: null });
                    } else {
                      setFilters({ ...filters, city: regionQuery });
                    }
                  }}
                  aria-pressed={isActive}
                  className={`shrink-0 inline-flex items-center min-h-[36px] rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-espresso text-paper shadow-2xs font-semibold"
                      : "bg-surface border border-line text-muted hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {region.label}
                </button>
              );
            })}
          </div>

          {/* Results Counter & Reset Action */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted pb-1">
            <div aria-live="polite" aria-atomic="true">
              {locationError && filters.nearMe ? `${locationError} ` : ""}
              <strong className="font-semibold text-ink tabular-nums">{visible.length}</strong>{" "}
              {filters.savedOnly
                ? visible.length === 1
                  ? "saved café"
                  : "saved cafés"
                : visible.length === 1
                  ? "café"
                  : "cafés"}
              {displayCity ? ` in ${displayCity}` : " in Cavite"}
              {nearMeActive ? ", nearest first" : ""}
            </div>
            {hasActiveFilters(filters) && visible.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-medium text-espresso underline underline-offset-2 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Feed Area (Decoupled from Header) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-1 pb-28 lg:pb-8 [scrollbar-width:thin]">
          {visible.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {visible.map(({ cafe, distance }) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  tagNames={tagsBySlug}
                  distance={distance}
                  selected={cafe.id === selectedId}
                  onSelect={() => handleCardSelect(cafe.id)}
                  onHover={handleCardHover}
                />
              ))}
            </ul>
          ) : filters.savedOnly && savedCount === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-accent/40 bg-accent/5 p-8 text-center text-sm bg-coord-grid">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent mb-3">
                <svg
                  aria-hidden="true"
                  className="size-6 fill-accent stroke-accent"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-ink text-base">Your Scoutlist is empty</h3>
              <p className="mt-1 text-xs text-muted max-w-xs mx-auto leading-relaxed">
                Tap the bookmark ribbon on any café card or dossier to curate your personal Cavite coffee itinerary.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2 text-xs font-semibold text-paper shadow-2xs hover:bg-espresso/90 cursor-pointer transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Browse all {cafes.length} cafés
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-line bg-surface/50 p-8 text-center text-sm text-muted bg-coord-grid">
              <p className="font-semibold text-ink">
                {filters.savedOnly
                  ? "No saved cafés match your current filters."
                  : "No cafés match your current filters."}
              </p>
              <p className="mt-1 text-xs text-muted">
                {filters.savedOnly
                  ? `You have ${savedCount} saved ${savedCount === 1 ? "café" : "cafés"}, but none match the selected criteria.`
                  : filters.query.trim()
                    ? `No cafés found matching "${filters.query.trim()}". Check spelling or reset filters.`
                    : "Try clearing specific tags or loosening your latte price filter."}
              </p>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
                {filters.savedOnly && savedCount > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-1.5 text-xs font-semibold text-paper shadow-2xs hover:bg-espresso/90 cursor-pointer transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() =>
                      setFilters({
                        query: "",
                        city: null,
                        tags: [],
                        maxPrice: null,
                        openNow: false,
                        nearMe: filters.nearMe,
                        savedOnly: true,
                      })
                    }
                  >
                    Show all {savedCount} saved {savedCount === 1 ? "café" : "cafés"}
                  </button>
                )}
                {hasActiveFilters(filters) && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:border-ink/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DOM ORDER 2: Interactive Vector Map (Desktop Right Column) */}
      <div className="absolute inset-0 z-0 lg:static lg:h-full lg:flex-1 lg:min-w-0">
        <CafeMap
          cafes={visibleCafes}
          selectedId={selectedId}
          hoveredId={hoveredId}
          userLocation={nearMeActive ? location : null}
          onSelect={selectFromMap}
        />
      </div>

      {/* DOM ORDER 3: Mobile View Switcher Pill - Safely Offset Above Home Indicator */}
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 lg:hidden pointer-events-auto">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-md">
          <button
            type="button"
            aria-pressed={mobileView === "map"}
            onClick={() => {
              setSheetSnap("peek");
              setMobileView("map");
            }}
            className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              mobileView === "map" ? "bg-espresso text-paper shadow-2xs" : "text-muted hover:text-ink"
            }`}
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span>Map</span>
          </button>
          <button
            type="button"
            aria-pressed={mobileView === "list"}
            onClick={() => {
              setSheetSnap("mid");
              setMobileView("list");
            }}
            className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              mobileView === "list" ? "bg-espresso text-paper shadow-2xs" : "text-muted hover:text-ink"
            }`}
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>List (<strong className="tabular-nums font-semibold">{visible.length}</strong>)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
