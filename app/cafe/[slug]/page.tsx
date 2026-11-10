import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackButton } from "@/components/BackButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { DossierNavigation } from "@/components/DossierNavigation";
import { HoursChronometer } from "@/components/HoursChronometer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { NearbyCarousel } from "@/components/NearbyCarousel";
import { OpenBadge } from "@/components/OpenBadge";
import { ShareButton } from "@/components/ShareButton";
import { type CafeDetail, getCafeBySlug, getCafes } from "@/lib/cafes";
import { extractAmenities } from "@/lib/dossier";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const cafes = await getCafes();
  return cafes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cafe/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return { title: "Café not found" };

  const coverPhoto = cafe.photos.find((p) => p.isCover) ?? cafe.photos[0];

  return {
    title: cafe.city ? `${cafe.name} · ${cafe.city}` : cafe.name,
    description:
      cafe.description ??
      `${cafe.name}: verified hours, typical latte prices, Wi-Fi speed, and coffee sourcing in Cavite.`,
    openGraph: {
      title: `${cafe.name} · Brewscout`,
      description: cafe.description ?? `Specialty coffee in ${cafe.city ?? "Cavite"}.`,
      images: coverPhoto
        ? [
            {
              url: coverPhoto.url,
              alt: `${cafe.name} cover photograph`,
            },
          ]
        : ["/icon-512.png"],
    },
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

export default async function CafePage({ params }: PageProps<"/cafe/[slug]">) {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-4 pb-32 sm:pb-24">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between pb-4">
        <BackButton label="Back to Explorer" />
      </div>

      <Suspense fallback={<DetailSkeleton />}>
        <CafeContent cafe={cafe} />
      </Suspense>
    </div>
  );
}

async function CafeContent({ cafe }: { cafe: CafeDetail }) {
  const allCafes = await getCafes();

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

      {/* FIELD INSPECTION LEDGER (Denser Two-Column Editorial Table) */}
      <section className="mt-12" aria-labelledby="amenities-heading">
        <div className="border-b border-line pb-2.5 mb-4">
          <h2 id="amenities-heading" className="font-display text-xl sm:text-2xl font-semibold text-espresso">
            Field Inspection Ledger
          </h2>
          <p className="text-xs text-muted mt-0.5">Verified on-site capabilities and hospitality data</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <dl className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line/70">
            {/* Column 1 */}
            <div className="divide-y divide-line/60">
              {amenities.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-baseline justify-between p-3.5 sm:px-4 sm:py-3 text-sm">
                  <dt className="text-xs font-semibold text-muted pr-3">{item.label}</dt>
                  <dd className="text-right">
                    <span className={`text-xs sm:text-sm font-semibold ${item.status === "positive" ? "text-ink" : "text-muted"}`}>
                      {item.value}
                    </span>
                    <span className="block text-[11px] text-muted-light mt-0.5">{item.note}</span>
                  </dd>
                </div>
              ))}
            </div>
            {/* Column 2 */}
            <div className="divide-y divide-line/60">
              {amenities.slice(3, 6).map((item) => (
                <div key={item.id} className="flex items-baseline justify-between p-3.5 sm:px-4 sm:py-3 text-sm">
                  <dt className="text-xs font-semibold text-muted pr-3">{item.label}</dt>
                  <dd className="text-right">
                    <span className={`text-xs sm:text-sm font-semibold ${item.status === "positive" ? "text-ink" : "text-muted"}`}>
                      {item.value}
                    </span>
                    <span className="block text-[11px] text-muted-light mt-0.5">{item.note}</span>
                  </dd>
                </div>
              ))}
            </div>
          </dl>
        </div>
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

            <DossierNavigation cafe={cafe} />

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

      {/* DOSSIER FOOTER NOTE */}
      <footer className="mt-14 pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
        <p>Brewscout Cavite Coffee Gazetteer · Verified Field Entry</p>
        <Link
          href="/explore"
          className="font-semibold text-espresso hover:text-ink hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Return to Cavite Explorer Map →
        </Link>
      </footer>

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
  if (photos.length === 1) {
    const photo = photos[0];
    return (
      <figure className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={`${name} cover photograph`}
          className="aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl object-cover shadow-xs border border-line"
          loading="eager"
        />
        {photo.credit && (
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-surface shadow-xs max-w-[85%] truncate">
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
      </figure>
    );
  }

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
      <div className="h-44 rounded-2xl bg-surface border border-line" />
    </div>
  );
}
