import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OpenBadge } from "@/components/OpenBadge";
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
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← All cafés
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
    cafe.fbUrl && { label: "Facebook", href: cafe.fbUrl },
    cafe.igUrl && { label: "Instagram", href: cafe.igUrl },
    cafe.website && { label: "Website", href: cafe.website },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  return (
    <article className="mt-4">
      {cafe.photos.length > 0 && <Photos photos={cafe.photos} name={cafe.name} />}

      <header className="mt-6">
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">{cafe.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
          <OpenBadge open={cafe.openNow} />
          {cafe.city && <span>{cafe.city}</span>}
          {price && <span>Latte {price}</span>}
          {cafe.isChain && <span>Chain</span>}
        </div>
        {cafe.description && <p className="mt-4 text-lg leading-relaxed text-ink/80">{cafe.description}</p>}
      </header>

      {cafe.tagDetails.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {cafe.tagDetails.map((tag) => (
            <li key={tag.slug} className="rounded-full border border-line bg-surface px-3 py-1 text-sm">
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Hours</h2>
          <Hours cafe={cafe} />
        </section>

        <section className="flex flex-col rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Getting there</h2>
          {cafe.address && <p className="mt-3 text-ink/80">{cafe.address}</p>}
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-surface hover:bg-espresso"
          >
            Directions ↗
          </a>
          {links.length > 0 && (
            <p className="mt-auto flex gap-4 pt-5 text-sm">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-espresso underline underline-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </p>
          )}
        </section>
      </div>
    </article>
  );
}

async function Hours({ cafe }: { cafe: CafeDetail }) {
  if (cafe.is24h) return <p className="mt-3 text-ink/80">Open 24 hours, every day</p>;
  if (cafe.hours.length === 0) return <p className="mt-3 text-muted">Hours not added yet.</p>;

  await io(); // "today" depends on the request time, so keep it out of the prerendered shell
  const today = manilaDayOfWeek();
  return (
    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
      {DAY_NAMES.map((day, i) => {
        const windows = cafe.hours.filter((h) => h.dayOfWeek === i);
        const isToday = i === today;
        return (
          <div key={day} className={`contents ${isToday ? "font-semibold text-ink" : "text-ink/75"}`}>
            <dt>{day}</dt>
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
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {photos.map((photo, i) => (
        <figure key={photo.url} className="w-[85%] shrink-0 snap-start sm:w-[70%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- the cafés' own photos, served from Supabase Storage */}
          <img
            src={photo.url}
            alt={`${name}, photo ${i + 1}`}
            className="aspect-[4/3] w-full rounded-3xl object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <figcaption className="mt-1.5 text-xs text-muted">
            {photo.sourceUrl ? (
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {photo.credit}
              </a>
            ) : (
              photo.credit
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
