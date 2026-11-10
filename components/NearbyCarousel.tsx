import Link from "next/link";
import type { CafeSummary } from "@/lib/cafes";
import { formatPrice } from "@/lib/format";

type Props = {
  currentCafeId: string;
  city: string | null;
  nearbyCafes: CafeSummary[];
};

export function NearbyCarousel({ currentCafeId, city, nearbyCafes }: Props) {
  const filtered = nearbyCafes.filter((c) => c.id !== currentCafeId).slice(0, 4);

  if (filtered.length === 0) return null;

  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Coffee Hop Trail
          </span>
          <h2 className="font-display text-xl sm:text-2xl text-espresso tracking-tight">
            More in {city || "Cavite"}
          </h2>
        </div>
        <Link
          href={`/?city=${encodeURIComponent(city || "")}`}
          className="text-xs font-semibold text-espresso hover:text-ink transition-colors"
        >
          View all in {city || "Cavite"} →
        </Link>
      </div>

      <div className="-mx-4 flex gap-3.5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
        {filtered.map((cafe) => {
          const price = formatPrice(cafe.priceMin, cafe.priceMax);
          return (
            <Link
              key={cafe.id}
              href={`/cafe/${cafe.slug}`}
              className="group relative flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:border-accent hover:shadow-xs"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-line/40">
                {cafe.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cafe.coverUrl}
                    alt={cafe.name}
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted/40 font-display text-sm">
                    ☕ Brewscout
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                      cafe.openNow
                        ? "bg-surface/90 text-open border border-open/20"
                        : "bg-surface/90 text-muted border border-line"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        cafe.openNow ? "bg-open" : "bg-muted/60"
                      }`}
                    />
                    {cafe.openNow ? "Open" : "Closed"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink group-hover:text-espresso transition-colors line-clamp-1">
                    {cafe.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">{cafe.city}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                  {price ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-espresso font-semibold tabular-nums">
                      {price}
                    </span>
                  ) : (
                    <span className="text-muted">Specialty</span>
                  )}
                  <span className="text-accent group-hover:translate-x-0.5 transition-transform text-xs font-semibold">
                    Dossier →
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
