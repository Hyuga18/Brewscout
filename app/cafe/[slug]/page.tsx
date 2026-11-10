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
import { extractAmenities, getAmbientHeroBadge } from "@/lib/dossier";
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
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : null;
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
        {params.then(({ slug }) => (
          <CafeContent slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function CafeContent({ slug }: { slug: string }) {
  const [cafe, allCafes] = await Promise.all([getCafeBySlug(slug), getCafes()]);
  if (!cafe) notFound();

  await io(); // evaluate fresh Manila time

  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`;
  const ambientBadge = getAmbientHeroBadge(cafe);
  const amenities = extractAmenities(cafe);

  const cityCafes = allCafes.filter((c) => c.city === cafe.city && c.id !== cafe.id);

  return (
    <article className="mt-2">
      {/* HERO STAGE: High-Impact Photography */}
      {cafe.photos.length > 0 ? (
        <HeroGallery photos={cafe.photos} name={cafe.name} />
      ) : (
        <div className="relative flex aspect-[21/9] min-h-[220px] w-full flex-col items-center justify-center rounded-3xl border border-line bg-gradient-to-br from-paper to-line/40 p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-espresso mb-2">
            ☕
          </div>
          <span className="font-display text-xl font-semibold text-espresso">{cafe.name}</span>
          <span className="text-xs text-muted mt-1">{cafe.city ? `${cafe.city}, Cavite` : "Cavite"}</span>
        </div>
      )}

      {/* EDITORIAL HEADER */}
      <header className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-espresso">
              {ambientBadge.label}
            </span>
            <OpenBadge open={cafe.openNow} />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <BookmarkButton cafeId={cafe.id} cafeName={cafe.name} />
            <ShareButton title={cafe.name} text={cafe.description ?? `Discover ${cafe.name} on Brewscout`} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-espresso tracking-tight">
            {cafe.name}
          </h1>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {cafe.city && (
            <span className="inline-flex items-center gap-1 font-medium text-ink">
              <span>📍</span> {cafe.city}, Cavite
            </span>
          )}
          {price && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-espresso tabular-nums">
              Typical Latte {price}
            </span>
          )}
          {cafe.isChain && (
            <span className="rounded-md bg-line px-2 py-0.5 text-xs font-medium text-ink/75">
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

      {/* FIELD INTEL BENTO MATRIX (6 Amenities) */}
      <section className="mt-10" aria-labelledby="amenities-heading">
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Scout Field Intel</span>
          <h2 id="amenities-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
            Work & Hospitality Amenities
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs transition-all hover:border-ink/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">
                  {item.icon === "wifi" && "📶"}
                  {item.icon === "power" && "⚡"}
                  {item.icon === "seat" && "🪑"}
                  {item.icon === "parking" && "🚗"}
                  {item.icon === "pet" && "🐕"}
                  {item.icon === "coffee" && "☕"}
                </span>
                <span
                  className={`size-2 rounded-full ${
                    item.status === "positive"
                      ? "bg-open"
                      : item.status === "caution"
                      ? "bg-accent"
                      : "bg-muted/40"
                  }`}
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {item.label}
                </span>
                <p className="font-semibold text-ink text-sm sm:text-base leading-snug mt-0.5">
                  {item.value}
                </p>
                <p className="text-[11px] text-muted leading-tight mt-1">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TWO-COLUMN SECTION: Hours & Logistics */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 items-start">
        {/* Operating Hours Chronometer */}
        <section aria-labelledby="hours-heading">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Operating Rhythm</span>
            <h2 id="hours-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
              Hours of Service
            </h2>
          </div>
          <HoursChronometer cafe={cafe} />
        </section>

        {/* Location & Logistics */}
        <section aria-labelledby="location-heading">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Expedition Logistics</span>
            <h2 id="location-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
              Getting There
            </h2>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Physical Location</span>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">
                {cafe.address || `${cafe.city}, Cavite (Verified GPS coordinates available)`}
              </p>
            </div>

            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-surface shadow-xs hover:bg-ink transition-colors cursor-pointer"
            >
              <span>Navigate in Google Maps</span>
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>

            {/* Official Café Feeds */}
            {(safeUrl(cafe.fbUrl) || safeUrl(cafe.igUrl) || safeUrl(cafe.website)) && (
              <div className="border-t border-line/60 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Official Feeds</span>
                <div className="mt-2 flex flex-wrap gap-3">
                  {safeUrl(cafe.fbUrl) && (
                    <a
                      href={safeUrl(cafe.fbUrl)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline"
                    >
                      <span>Facebook Page ↗</span>
                    </a>
                  )}
                  {safeUrl(cafe.igUrl) && (
                    <a
                      href={safeUrl(cafe.igUrl)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline"
                    >
                      <span>Instagram Feed ↗</span>
                    </a>
                  )}
                  {safeUrl(cafe.website) && (
                    <a
                      href={safeUrl(cafe.website)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso hover:underline"
                    >
                      <span>Website ↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
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
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-medium text-surface backdrop-blur-md">
              {photo.sourceUrl ? (
                <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Photo: {photo.credit} ↗
                </a>
              ) : (
                `Photo: ${photo.credit}`
              )}
            </figcaption>
          )}
          <span className="absolute top-3 right-3 rounded-full bg-ink/60 px-2.5 py-0.5 text-[11px] font-medium text-surface backdrop-blur-md">
            {i + 1} / {photos.length}
          </span>
        </figure>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-4 space-y-6 animate-pulse">
      <div className="h-72 w-full rounded-3xl bg-line/50" />
      <div className="h-8 w-2/3 rounded-lg bg-line/50" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-line/40" />
        ))}
      </div>
    </div>
  );
}
