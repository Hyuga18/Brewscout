import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OpenBadge } from "@/components/OpenBadge";
import { ShareButton } from "@/components/ShareButton";
import { type CafeDetail, getCafeBySlug } from "@/lib/cafes";
import { DAY_NAMES, formatPrice, formatTime, manilaDayOfWeek } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/cafe/[slug]">): Promise<Metadata> {
  const cafe = await getCafeBySlug((await params).slug);
  if (!cafe) return { title: "Café not found" };
  return {
    title: cafe.city ? `${cafe.name}, ${cafe.city}` : cafe.name,
    description: cafe.description ?? `${cafe.name}: hours, prices, and what it's like to work from.`,
  };
}

export default function CafePage({ params }: PageProps<"/cafe/[slug]">) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to cafés</span>
      </Link>
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-3xl bg-line/50" />}>
        {params.then(({ slug }) => (
          <CafeContent slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function CafeContent({ slug }: { slug: string }) {
  const cafe = await getCafeBySlug(slug);
  if (!cafe) notFound();

  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`;
  const links = [
    cafe.fbUrl && {
      label: "Facebook",
      href: cafe.fbUrl,
      type: "facebook",
    },
    cafe.igUrl && {
      label: "Instagram",
      href: cafe.igUrl,
      type: "instagram",
    },
    cafe.website && {
      label: "Website",
      href: cafe.website,
      type: "website",
    },
  ].filter((l): l is { label: string; href: string; type: string } => Boolean(l));

  return (
    <article className="mt-4">
      {cafe.photos.length > 0 ? (
        <Photos photos={cafe.photos} name={cafe.name} />
      ) : (
        <div className="flex h-52 w-full flex-col items-center justify-center rounded-3xl border border-line bg-gradient-to-b from-paper to-line/30 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-espresso/10 text-espresso mb-2">
            <svg
              className="size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Zm14 2h2a2.5 2.5 0 0 1 0 5h-2M2 19h18"
              />
            </svg>
          </div>
          <span className="font-display text-lg text-espresso">{cafe.name}</span>
          <span className="text-xs text-muted mt-1">{cafe.city ? `${cafe.city}, Cavite` : "Cavite"}</span>
        </div>
      )}

      <header className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl text-espresso sm:text-4xl">{cafe.name}</h1>
          <ShareButton title={cafe.name} text={cafe.description ?? `Discover ${cafe.name} in ${cafe.city || "Cavite"}`} />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <OpenBadge open={cafe.openNow} />
          {cafe.city && <span>{cafe.city}</span>}
          {price && <span>Typical latte {price}</span>}
          {cafe.isChain && (
            <span className="rounded-md bg-line px-1.5 py-0.5 text-xs text-ink/70">Chain</span>
          )}
        </div>
        {cafe.description && (
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/85">{cafe.description}</p>
        )}
      </header>

      {cafe.tagDetails.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {cafe.tagDetails.map((tag) => (
            <li
              key={tag.slug}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs sm:text-sm text-ink/80 font-medium"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Hours Card */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="size-4 text-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h2 className="font-semibold text-ink">Operating Hours</h2>
          </div>
          <Hours cafe={cafe} />
        </section>

        {/* Location & Links Card */}
        <section className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="size-4 text-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <h2 className="font-semibold text-ink">Getting There</h2>
          </div>
          {cafe.address ? (
            <p className="text-sm text-ink/80 leading-relaxed">{cafe.address}</p>
          ) : (
            <p className="text-sm text-muted">Address available on Google Maps navigation.</p>
          )}

          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-surface hover:bg-espresso transition-colors"
          >
            <span>Open in Google Maps</span>
            <svg
              className="size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>

          {links.length > 0 && (
            <div className="mt-auto pt-6">
              <span className="text-xs uppercase tracking-wider text-muted font-medium">Links</span>
              <div className="mt-2 flex flex-wrap gap-3">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-espresso hover:underline underline-offset-2"
                  >
                    {link.type === "facebook" && (
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {link.type === "instagram" && (
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {link.type === "website" && (
                      <svg
                        className="size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                    )}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

async function Hours({ cafe }: { cafe: CafeDetail }) {
  if (cafe.is24h) return <p className="mt-2 text-sm text-ink/80 font-medium">Open 24 hours, every day</p>;
  if (cafe.hours.length === 0) return <p className="mt-2 text-sm text-muted">Hours not added yet.</p>;

  await io(); // "today" depends on the request time, so keep it out of the prerendered shell
  const today = manilaDayOfWeek();
  return (
    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      {DAY_NAMES.map((day, i) => {
        const windows = cafe.hours.filter((h) => h.dayOfWeek === i);
        const isToday = i === today;
        return (
          <div
            key={day}
            className={`contents ${
              isToday
                ? "font-semibold text-espresso"
                : "text-ink/75"
            }`}
          >
            <dt className="flex items-center gap-1.5">
              <span>{day}</span>
              {isToday && (
                <span className="rounded-sm bg-accent/20 px-1 py-0.5 text-[10px] font-semibold text-espresso uppercase tracking-wider">
                  Today
                </span>
              )}
            </dt>
            <dd>
              {windows.length
                ? windows.map((w) => `${formatTime(w.opens)} – ${formatTime(w.closes)}`).join(", ")
                : "Closed"}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Photos({ photos, name }: { photos: CafeDetail["photos"]; name: string }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      {photos.map((photo, i) => (
        <figure key={photo.url} className="w-[85%] shrink-0 snap-start sm:w-[70%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- the cafés' own photos, served from Supabase Storage */}
          <img
            src={photo.url}
            alt={`${name}, photo ${i + 1}`}
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xs"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <figcaption className="mt-1.5 text-xs text-muted">
            {photo.sourceUrl ? (
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-muted hover:text-ink transition-colors"
              >
                Photo credit: {photo.credit}
              </a>
            ) : (
              photo.credit && `Photo credit: ${photo.credit}`
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
