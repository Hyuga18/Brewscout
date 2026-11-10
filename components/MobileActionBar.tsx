"use client";

import { BookmarkButton } from "./BookmarkButton";
import { ShareButton } from "./ShareButton";

type Props = {
  cafeId: string;
  name: string;
  directionsUrl: string;
  priceFormatted: string | null;
  openNow: boolean;
};

export function MobileActionBar({
  cafeId,
  name,
  directionsUrl,
  priceFormatted,
  openNow,
}: Props) {
  return (
    <aside
      aria-label="Expedition quick actions"
      className="fixed bottom-0 inset-x-0 z-30 sm:hidden border-t border-line bg-paper px-4 py-2.5 shadow-[0_-8px_24px_rgba(31,22,16,0.08)] pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Left: Quick Status Summary */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${openNow ? "bg-open" : "bg-muted/60"}`} />
            <span className="text-xs font-semibold text-ink truncate">
              {openNow ? "Open Now" : "Closed"}
            </span>
          </div>
          <span className="text-[11px] text-muted truncate tabular-nums">
            {priceFormatted ? `Typical latte ${priceFormatted}` : "Specialty Coffee"}
          </span>
        </div>

        {/* Right: Tactile Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <BookmarkButton cafeId={cafeId} cafeName={name} size="sm" />
          <ShareButton title={name} />
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2 text-xs font-semibold text-surface shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span>Directions</span>
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
