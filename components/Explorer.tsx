"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CafeSummary, Tag } from "@/lib/cafes";
import { type LatLng, distanceMeters } from "@/lib/geo";
import { CafeCard } from "./CafeCard";
import { CafeMap } from "./CafeMap";
import { FilterBar } from "./FilterBar";
import { type Filters, filtersToQuery, hasActiveFilters, matchesFilters, parseFilters } from "./filters";

type Props = { cafes: CafeSummary[]; tags: Tag[] };

export function Explorer({ cafes, tags }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const [location, setLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setFilters = (next: Filters) => {
    if (next.nearMe && !filters.nearMe) setLocationError(null);
    router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false });
  };

  const clearFilters = () => setFilters({ ...filters, city: null, tags: [], maxPrice: null, openNow: false });

  // Ask for the browser's location when "near me" is on (also when arriving via a shared ?sort=near link).
  useEffect(() => {
    if (!filters.nearMe || location) return;
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocationError("Your browser can't share its location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location is off, so cafés are sorted A–Z."),
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

  const visible = useMemo(() => {
    const rows = cafes
      .filter((cafe) => matchesFilters(cafe, filters))
      .map((cafe) => ({ cafe, distance: location ? distanceMeters(location, cafe) : null }));
    return nearMeActive
      ? rows.sort((a, b) => a.distance! - b.distance!)
      : rows.sort((a, b) => a.cafe.name.localeCompare(b.cafe.name));
  }, [cafes, filters, location, nearMeActive]);

  const visibleCafes = useMemo(() => visible.map((v) => v.cafe), [visible]);

  const selectFromMap = (id: string) => {
    setSelectedId(id);
    document.getElementById(`cafe-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="flex flex-1 flex-col lg:h-[calc(100dvh-3.5rem)] lg:flex-none lg:flex-row lg:overflow-hidden">
      <div className="sticky top-14 z-0 h-[42dvh] lg:order-2 lg:static lg:h-auto lg:flex-1">
        <CafeMap
          cafes={visibleCafes}
          selectedId={selectedId}
          userLocation={nearMeActive ? location : null}
          onSelect={selectFromMap}
        />
      </div>

      <section className="relative z-10 -mt-5 flex-1 rounded-t-3xl bg-paper px-4 pt-3 shadow-[0_-8px_24px_rgba(43,33,24,0.08)] lg:order-1 lg:mt-0 lg:w-[480px] lg:flex-none lg:overflow-y-auto lg:rounded-none lg:border-r lg:border-line lg:pt-4 lg:shadow-none">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 lg:hidden" aria-hidden />
        <FilterBar filters={filters} cities={cities} tags={tags} locating={locating} onChange={setFilters} />

        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {locationError && filters.nearMe ? `${locationError} ` : ""}
          {visible.length === 1 ? "1 café" : `${visible.length} cafés`}
          {nearMeActive ? ", nearest first" : ""}
          {hasActiveFilters(filters) && visible.length > 0 && (
            <>
              {" · "}
              <button type="button" onClick={clearFilters} className="underline underline-offset-2 hover:text-ink">
                Clear filters
              </button>
            </>
          )}
        </p>

        {visible.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2 pb-8">
            {visible.map(({ cafe, distance }) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                tagNames={tagsBySlug}
                distance={distance}
                selected={cafe.id === selectedId}
                onSelect={() => setSelectedId(cafe.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
            {cafes.length === 0 ? (
              "No cafés yet. Verified cafés will show up here."
            ) : (
              <>
                No cafés match these filters.{" "}
                {hasActiveFilters(filters) && (
                  <button
                    type="button"
                    className="font-medium text-ink underline underline-offset-2"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
