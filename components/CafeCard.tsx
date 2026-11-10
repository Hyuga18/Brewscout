"use client";

import React, { memo } from "react";
import Link from "next/link";
import { BookmarkButton } from "./BookmarkButton";
import { OpenBadge } from "./OpenBadge";
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

export const CafeCard = memo(function CafeCard({
  cafe,
  tagNames,
  distance,
  selected,
  onSelect,
  onHover,
}: Props) {
  const price = formatPrice(cafe.priceMin, cafe.priceMax);

  const handleMouseEnter = () => {
    onHover?.(cafe.id);
  };
  const handleMouseLeave = () => {
    onHover?.(null);
  };

  const highlightedTags = cafe.tags.slice(0, 3).map((slug) => {
    const meta = tagNames.get(slug);
    return {
      slug,
      name: meta?.name ?? slug,
      category: meta?.category ?? "practical",
    };
  });

  return (
    <li
      id={`cafe-${cafe.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className={`group relative flex gap-3.5 rounded-3xl border p-3 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-accent ${
        selected
          ? "border-accent bg-accent/[0.04] shadow-xs ring-1 ring-accent/30"
          : "border-line bg-surface hover:border-ink/30 hover:shadow-2xs"
      }`}
    >
      {/* Media Window - Concentric Radius: Outer 24px - Padding 12px = Inner 12px */}
      <Link
        href={`/cafe/${cafe.slug}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        aria-hidden="true"
        className="relative size-22 sm:size-24 shrink-0 overflow-hidden rounded-xl bg-surface-sub border border-line/60"
      >
        {cafe.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cafe.coverUrl}
            alt=""
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface-sub text-espresso/40">
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
        )}

        {/* Canonical Open Badge */}
        <div className="absolute top-1.5 left-1.5">
          <OpenBadge open={cafe.openNow} compact />
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

        {/* Semantic Tag Ribbon (Tokenized, No Slop Colors) */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-0.5">
          {highlightedTags.map((tag) => {
            const isCoffee = tag.category === "coffee";
            const isVibe = tag.category === "vibe";

            return (
              <span
                key={tag.slug}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                  isCoffee
                    ? "bg-espresso/10 text-espresso border-espresso/15 font-semibold"
                    : isVibe
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "bg-surface-sub text-ink-sub border-line"
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
});
