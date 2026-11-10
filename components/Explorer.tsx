"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CafeSummary, Tag } from "@/lib/cafes";
import { type LatLng, distanceMeters } from "@/lib/geo";
import { CafeCard } from "./CafeCard";
import { CafeMap } from "./CafeMap";
import { FilterBar } from "./FilterBar";
import { type Filters, filtersToQuery, hasActiveFilters, matchesFilters, parseFilters } from "./filters";

type Props = { cafes: CafeSummary[]; tags: Tag[] };
type SheetSnap = "peek" | "mid" | "full";

const CAVITE_REGIONS = [
  { label: "All Cavite", cities: [] },
  { label: "Tagaytay & Silang", cities: ["Tagaytay", "Silang", "Alfonso", "Amadeo", "Mendez"] },
  { label: "Dasmariñas", cities: ["Dasmariñas"] },
  { label: "Imus & Bacoor", cities: ["Imus", "Bacoor"] },
  { label: "Gen. Trias & Trece", cities: ["General Trias", "Trece Martires", "Tanza"] },
];

export function Explorer({ cafes, tags }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const [location, setLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("mid");
  const [mobileView, setMobileView] = useState<"map" | "list">("list");

  const sheetRef = useRef<HTMLElement>(null);
  const touchStartY = useRef<number | null>(null);

  const setFilters = (next: Filters) => {
    if (next.nearMe && !filters.nearMe) setLocationError(null);
    router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false });
  };

  const clearFilters = () =>
    setFilters({
      ...filters,
      query: "",
      city: null,
      tags: [],
      maxPrice: null,
      openNow: false,
    });

  // Location detection
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

  const visible = useMemo(() => {
    const rows = cafes
      .filter((cafe) => matchesFilters(cafe, filters))
      .map((cafe) => ({ cafe, distance: location ? distanceMeters(location, cafe) : null }));
    return nearMeActive
      ? rows.sort((a, b) => a.distance! - b.distance!)
      : rows.sort((a, b) => a.cafe.name.localeCompare(b.cafe.name));
  }, [cafes, filters, location, nearMeActive]);

  const visibleCafes = useMemo(() => visible.map((v) => v.cafe), [visible]);

  const selectFromMap = useCallback((id: string) => {
    setSelectedId(id);
    setSheetSnap((curr) => (curr === "peek" ? "mid" : curr));
    const el = document.getElementById(`cafe-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  // Touch gesture handler for mobile bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (deltaY < -40) {
      setSheetSnap((curr) => (curr === "peek" ? "mid" : "full"));
      setMobileView("list");
    } else if (deltaY > 40) {
      setSheetSnap((curr) => (curr === "full" ? "mid" : "peek"));
      if (sheetSnap === "mid") setMobileView("map");
    }
  };

  const snapClasses = {
    peek: "max-lg:h-[104px] max-lg:overflow-hidden",
    mid: "max-lg:h-[50dvh] max-lg:overflow-y-auto",
    full: "max-lg:h-[88dvh] max-lg:overflow-y-auto",
  };

  return (
    <div className="relative flex flex-1 flex-col h-[calc(100dvh-3.5rem)] lg:flex-row lg:overflow-hidden">
      {/* Accessible Landmarks */}
      <h1 className="sr-only">Cavite Specialty Coffee Gazetteer</h1>

      {/* Map View */}
      <div className="absolute inset-0 z-0 lg:static lg:h-full lg:flex-1 lg:min-w-0 lg:order-2">
        <CafeMap
          cafes={visibleCafes}
          selectedId={selectedId}
          hoveredId={hoveredId}
          userLocation={nearMeActive ? location : null}
          onSelect={selectFromMap}
        />
      </div>

      {/* Mobile Floating View Switcher Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden pointer-events-auto">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/95 p-1 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setSheetSnap("peek");
              setMobileView("map");
            }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              mobileView === "map" ? "bg-espresso text-paper shadow-2xs" : "text-muted hover:text-ink"
            }`}
          >
            <span>🗺️</span> Map
          </button>
          <button
            type="button"
            onClick={() => {
              setSheetSnap("mid");
              setMobileView("list");
            }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              mobileView === "list" ? "bg-espresso text-paper shadow-2xs" : "text-muted hover:text-ink"
            }`}
          >
            <span>☕</span> List ({visible.length})
          </button>
        </div>
      </div>

      {/* Explorer Sheet (Mobile 3-Snap Sheet / Desktop Fixed 480px Sidebar) */}
      <section
        ref={sheetRef}
        aria-label="Café directory"
        className={`fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl bg-paper px-4 pt-2 shadow-[0_-12px_32px_rgba(31,22,16,0.12)] overscroll-contain transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:static lg:mt-0 lg:w-[480px] lg:h-full lg:flex-none lg:overflow-y-auto lg:overscroll-contain lg:rounded-none lg:border-r lg:border-line lg:pt-4 lg:shadow-none lg:order-1 ${snapClasses[sheetSnap]}`}
      >
        <h2 className="sr-only">Curated Directory Results</h2>

        {/* Mobile Tactile Drag Handle */}
        <button
          type="button"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setSheetSnap((c) => (c === "peek" ? "mid" : c === "mid" ? "full" : "peek"))}
          className="mx-auto mb-2 flex h-6 w-full cursor-grab items-center justify-center active:cursor-grabbing lg:hidden"
          aria-label="Toggle drawer height"
          aria-expanded={sheetSnap !== "peek"}
        >
          <div className="h-1.5 w-12 rounded-full bg-ink/20 active:bg-ink/40 transition-colors" />
        </button>

        {/* Desktop Ambient Pulse & Cavite Radar Bar */}
        <div className="hidden lg:flex items-center justify-between border-b border-line/60 pb-3 mb-3.5 text-xs text-muted font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-ink">
              <span className="size-2 rounded-full bg-accent" />
              <strong>{stats.total}</strong> Verified Cafés
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-open">
              <span className="size-1.5 rounded-full bg-open animate-pulse" />
              <strong>{stats.openNow}</strong> Open Now
            </span>
            {stats.avgPrice && (
              <>
                <span>·</span>
                <span className="tabular-nums">Avg Latte ₱{stats.avgPrice}</span>
              </>
            )}
          </div>
          <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            Cavite Radar
          </span>
        </div>

        {/* Filter Bar with Debounced Search & Categorized Drawers */}
        <FilterBar
          filters={filters}
          cities={cities}
          tags={tags}
          locating={locating}
          onChange={setFilters}
        />

        {/* Cavite Micro-Region Pills */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
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
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
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

        {/* Results Counter & Reset Action with aria-atomic */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <div aria-live="polite" aria-atomic="true">
            {locationError && filters.nearMe ? `${locationError} ` : ""}
            <strong className="font-semibold text-ink">{visible.length}</strong>{" "}
            {visible.length === 1 ? "café" : "cafés"}
            {filters.city ? ` in ${filters.city}` : " in Cavite"}
            {nearMeActive ? ", nearest first" : ""}
          </div>
          {hasActiveFilters(filters) && visible.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-espresso underline underline-offset-2 hover:text-ink cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Cafe Cards List */}
        {visible.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2.5 pb-24 lg:pb-8">
            {visible.map(({ cafe, distance }) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                tagNames={tagsBySlug}
                distance={distance}
                selected={cafe.id === selectedId}
                onSelect={() => setSelectedId(cafe.id)}
                onHover={setHoveredId}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center text-sm text-muted">
            <p className="font-semibold text-ink">No cafés match your current filters.</p>
            <p className="mt-1 text-xs text-muted">Try clearing specific tags or loosening your latte price filter.</p>
            {hasActiveFilters(filters) && (
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:border-ink/40 cursor-pointer"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
