import type { Metadata } from "next";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackButton } from "@/components/BackButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { HoursChronometer } from "@/components/HoursChronometer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { NearbyCarousel } from "@/components/NearbyCarousel";
import { OpenBadge } from "@/components/OpenBadge";
import { ShareButton } from "@/components/ShareButton";
import { type CafeDetail, getCafeBySlug, getCafes } from "@/lib/cafes";
import { extractAmenities } from "@/lib/dossier";
import { formatPrice } from "@/lib/format";


export async function generateMetadata({ params }: PageProps<"/cafe/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return { title: "Café not found" };
  return {
    title: cafe.city ? `${cafe.name} · ${cafe.city}` : cafe.name,
    description:
      cafe.description ??
      `${cafe.name}: verified hours, typical latte prices, Wi-Fi speed, and coffee sourcing in Cavite.`,
  };
}

function safeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

export default function CafePage({ params }: PageProps<"/cafe/[slug]">) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-4 pb-32 sm:pb-24">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between pb-4">
        <BackButton label="Back to Explorer" />
      </div>

      <Suspense fallback={<DetailSkeleton />}>
        <CafeContent params={params} />
      </Suspense>
    </div>
  );
}

async function CafeContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cafe, allCafes] = await Promise.all([getCafeBySlug(slug), getCafes()]);
  if (!cafe) notFound();

  await io(); // evaluate fresh Manila time

  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${cafe.lat},${cafe.lng}`)}`;
  const amenities = extractAmenities(cafe);

  const cityCafes = allCafes.filter((c) => c.city === cafe.city && c.id !== cafe.id);

  return (
    <article className="mt-2">
      {/* HERO STAGE: High-Impact Photography */}
      {cafe.photos.length > 0 ? (
        <HeroGallery photos={cafe.photos} name={cafe.name} />
      ) : (
        <div className="relative flex aspect-[21/9] min-h-[220px] w-full flex-col items-center justify-center rounded-3xl border border-line bg-surface-sub bg-contour-pattern p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-espresso/10 text-espresso mb-2">
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold text-espresso">{cafe.name}</span>
          <span className="text-xs text-muted mt-1">{cafe.city ? `${cafe.city}, Cavite` : "Cavite"}</span>
        </div>
      )}

      {/* EDITORIAL HEADER */}
      <header className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <OpenBadge open={cafe.openNow} />
            {cafe.city && (
              <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink">
                {cafe.city}, Cavite
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <BookmarkButton cafeId={cafe.id} cafeName={cafe.name} />
            <ShareButton title={cafe.name} text={cafe.description ?? `Discover ${cafe.name} on Brewscout`} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-espresso tracking-tight text-balance">
            {cafe.name}
          </h1>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {price && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-semibold text-espresso tabular-nums">
              Typical Latte {price}
            </span>
          )}
          {cafe.isChain && (
            <span className="rounded-md border border-line bg-surface-sub px-2 py-0.5 text-xs font-medium text-ink/75">
              Regional Roaster / Chain
            </span>
          )}
        </div>

        {cafe.description && (
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/85 max-w-3xl">
            {cafe.description}
          </p>
        )}
      </header>

      {/* FIELD INTEL LIST (Editorial 2-Column Definition List - No Bento Slop) */}
      <section className="mt-14" aria-labelledby="amenities-heading">
        <div className="border-b border-line pb-3 mb-4">
          <h2 id="amenities-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
            Work & Hospitality Amenities
          </h2>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 shadow-2xs transition-all hover:border-ink/20"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-sub text-espresso border border-line/60">
                {item.icon === "wifi" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                )}
                {item.icon === "power" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 20V10" />
                    <path d="M12 20V4" />
                    <path d="M6 20v-6" />
                  </svg>
                )}
                {item.icon === "seat" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0z" />
                    <path d="M5 18v3" />
                    <path d="M19 18v3" />
                  </svg>
                )}
                {item.icon === "parking" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                  </svg>
                )}
                {item.icon === "pet" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="4" r="2" />
                    <circle cx="18" cy="8" r="2" />
                    <circle cx="20" cy="16" r="2" />
                    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
                  </svg>
                )}
                {item.icon === "coffee" && (
                  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-xs font-semibold text-muted">
                  {item.label}
                </dt>
                <dd className="font-semibold text-ink text-sm sm:text-base leading-snug mt-0.5">
                  {item.value}
                </dd>
                <dd className="text-xs text-muted leading-relaxed mt-1">
                  {item.note}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* MAIN TWO-COLUMN SECTION: Hours & Logistics */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 items-start">
        {/* Operating Hours Chronometer */}
        <section aria-labelledby="hours-heading">
          <div className="border-b border-line pb-3 mb-4">
            <h2 id="hours-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
              Hours of Service
            </h2>
          </div>
          <HoursChronometer cafe={cafe} />
        </section>

        {/* Location & Logistics */}
        <section aria-labelledby="location-heading">
          <div className="border-b border-line pb-3 mb-4">
            <h2 id="location-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
              Getting There
            </h2>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs space-y-4">
            <div>
              <span className="text-xs font-semibold text-muted">Physical Location</span>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">
                {cafe.address || `${cafe.city}, Cavite (Verified GPS coordinates available)`}
              </p>
            </div>

            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-paper shadow-xs hover:bg-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Navigate in Google Maps</span>
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>

            {/* Official Social Links */}
            {(() => {
              const safeFb = safeUrl(cafe.fbUrl);
              const safeIg = safeUrl(cafe.igUrl);
              const safeWebsite = safeUrl(cafe.website);

              if (!safeFb && !safeIg && !safeWebsite) return null;

              return (
                <div className="pt-3 border-t border-line/60">
                  <span className="text-xs font-semibold text-muted">Official Profiles</span>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {safeFb && (
                      <a
                        href={safeFb}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Official Facebook page (opens in a new tab)"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                      >
                        <span>Facebook ↗</span>
                      </a>
                    )}
                    {safeIg && (
                      <a
                        href={safeIg}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Official Instagram profile (opens in a new tab)"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                      >
                        <span>Instagram ↗</span>
                      </a>
                    )}
                    {safeWebsite && (
                      <a
                        href={safeWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Official website (opens in a new tab)"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                      >
                        <span>Website ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      </div>

      {/* NEARBY RECOMMENDATIONS CAROUSEL */}
      <NearbyCarousel currentCafeId={cafe.id} city={cafe.city} nearbyCafes={cityCafes} />

      {/* MOBILE FLOATING ACTION DOCK */}
      <MobileActionBar
        cafeId={cafe.id}
        name={cafe.name}
        directionsUrl={directions}
        priceFormatted={price}
        openNow={cafe.openNow}
      />
    </article>
  );
}

function HeroGallery({ photos, name }: { photos: CafeDetail["photos"]; name: string }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      {photos.map((photo, i) => (
        <figure key={photo.url} className="relative w-[90%] shrink-0 snap-start sm:w-[75%] md:w-[65%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={`${name}, gallery frame ${i + 1}`}
            className="aspect-[16/10] w-full rounded-3xl object-cover shadow-xs border border-line"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {photo.credit && (
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-surface shadow-xs max-w-[75%] truncate">
              {safeUrl(photo.sourceUrl) ? (
                <a
                  href={safeUrl(photo.sourceUrl)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Photo: {photo.credit} ↗
                </a>
              ) : (
                `Photo: ${photo.credit}`
              )}
            </figcaption>
          )}
          <span className="absolute top-3 right-3 rounded-full bg-ink/70 px-2.5 py-0.5 text-[11px] font-medium text-surface">
            {i + 1} / {photos.length}
          </span>
        </figure>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-4 space-y-6">
      <div className="h-72 w-full rounded-3xl bg-surface-sub border border-line" />
      <div className="h-8 w-2/3 rounded-lg bg-surface-sub border border-line" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-surface border border-line" />
        ))}
      </div>
    </div>
  );
}
