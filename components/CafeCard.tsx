"use client";

import Link from "next/link";
import { BookmarkButton } from "./BookmarkButton";
import type { CafeSummary, Tag } from "@/lib/cafes";
import { formatPrice } from "@/lib/format";
import { formatDistance } from "@/lib/geo";

type Props = {
  cafe: CafeSummary;
  tagNames: Map<string, Tag>;
  distance: number | null;
  selected: boolean;
  onSelect: () => void;
  onHover?: (id: string | null) => void;
};

export function CafeCard({ cafe, tagNames, distance, selected, onSelect, onHover }: Props) {
  const price = formatPrice(cafe.priceMin, cafe.priceMax);

  // Hover provides subtle marker highlighting without moving the map camera
  const handleMouseEnter = () => {
    onHover?.(cafe.id);
  };
  const handleMouseLeave = () => {
    onHover?.(null);
  };

  const highlightedTags = cafe.tags.slice(0, 3).map((slug) => {
    const meta = tagNames.get(slug);
    const category = meta?.category ?? "practical";
    return {
      slug,
      name: meta?.name ?? slug,
      category,
    };
  });

  return (
    <li
      id={`cafe-${cafe.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className={`group relative flex gap-3.5 rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-accent ${
        selected
          ? "border-accent bg-accent/[0.04] shadow-xs ring-1 ring-accent/30"
          : "border-line bg-surface hover:border-ink/30 hover:shadow-2xs"
      }`}
    >
      {/* Media Window / Visual Stage */}
      <Link
        href={`/cafe/${cafe.slug}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`View dossier for ${cafe.name}`}
        className="relative size-22 sm:size-24 shrink-0 overflow-hidden rounded-xl bg-line/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {cafe.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cafe.coverUrl}
            alt={cafe.name}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-paper to-line/50 text-espresso/40">
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Zm14 2h2a2.5 2.5 0 0 1 0 5h-2M2 19h18" />
            </svg>
          </div>
        )}

        {/* Floating Open Beacon Chip */}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow-xs ${
              cafe.openNow
                ? "bg-surface/90 text-open border border-open/20"
                : "bg-surface/90 text-muted border border-line"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                cafe.openNow ? "bg-open animate-pulse" : "bg-muted/60"
              }`}
            />
            {cafe.openNow ? "Open" : "Closed"}
          </span>
        </div>
      </Link>

      {/* Information Stack */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {/* Header Row: City, Distance & Bookmark Button */}
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-medium truncate">
              {cafe.city ? `${cafe.city}, Cavite` : "Cavite"}
              {distance != null && ` · ${formatDistance(distance)}`}
            </span>
            <div className="z-10 ml-2">
              <BookmarkButton cafeId={cafe.id} cafeName={cafe.name} size="sm" />
            </div>
          </div>

          {/* Café Title Link */}
          <h3 className="font-display text-base font-semibold text-ink group-hover:text-espresso transition-colors line-clamp-1">
            <Link
              href={`/cafe/${cafe.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {cafe.name}
            </Link>
          </h3>

          {/* Price Pill */}
          <div className="mt-1 flex items-center gap-2">
            {price ? (
              <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-semibold text-espresso tabular-nums">
                {price} latte
              </span>
            ) : (
              <span className="text-xs text-muted">Specialty Roaster</span>
            )}
          </div>
        </div>

        {/* Semantic Tag Ribbon */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-0.5">
          {highlightedTags.map((tag) => {
            const isWork = tag.category === "work";
            const isCoffee = tag.category === "coffee";
            const isVibe = tag.category === "vibe";

            return (
              <span
                key={tag.slug}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isWork
                    ? "bg-slate-100 text-slate-700 border border-slate-200/60"
                    : isCoffee
                    ? "bg-espresso/10 text-espresso border border-espresso/15 font-semibold"
                    : isVibe
                    ? "bg-amber-50 text-amber-900 border border-amber-200/60"
                    : "bg-surface-sub text-ink/75 border border-line"
                }`}
              >
                {tag.name}
              </span>
            );
          })}
          {cafe.tags.length > 3 && (
            <span className="text-[11px] font-medium text-muted">+{cafe.tags.length - 3}</span>
          )}
        </div>
      </div>
    </li>
  );
}
