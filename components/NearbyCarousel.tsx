import Link from "next/link";
import { OpenBadge } from "./OpenBadge";
import type { CafeSummary } from "@/lib/cafes";
import { formatPrice } from "@/lib/format";

type Props = {
  currentCafeId: string;
  city: string | null;
  nearbyCafes: CafeSummary[];
};

export function NearbyCarousel({ city, nearbyCafes }: Props) {
  const cafesToShow = nearbyCafes.slice(0, 4);

  if (cafesToShow.length === 0) return null;

  return (
    <section className="mt-14 border-t border-line pt-8">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-espresso tracking-tight">
            More in {city || "Cavite"}
          </h2>
        </div>
        <Link
          href={`/?city=${encodeURIComponent(city || "")}`}
          className="text-xs font-semibold text-espresso hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          View all in {city || "Cavite"} →
        </Link>
      </div>

      <div className="-mx-4 flex gap-3.5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
        {cafesToShow.map((cafe) => {
          const price = formatPrice(cafe.priceMin, cafe.priceMax);
          return (
            <Link
              key={cafe.id}
              href={`/cafe/${cafe.slug}`}
              className="group relative flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:border-accent hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sub border-b border-line/60">
                {cafe.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cafe.coverUrl}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-espresso/40">
                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <OpenBadge open={cafe.openNow} compact />
                </div>
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink group-hover:text-espresso transition-colors line-clamp-1">
                    {cafe.name}
                  </h3>
                  <p className="text-xs text-muted mt-0.5 truncate">{cafe.city || "Cavite"}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-line/40">
                  <span className="font-semibold text-espresso tabular-nums">
                    {price ? `${price} latte` : "Specialty"}
                  </span>
                  <span className="text-[11px] font-medium text-muted-light group-hover:text-espresso transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
