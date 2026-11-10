# Brewscout review: code and design

Date: 2026-11-10
Reviewed: production (`brewscout-peach.vercel.app`, which serves the `master` branch) and the local `develop` working tree, including its uncommitted landing page.

## Verdict

| Area | Verdict |
|---|---|
| Backend and database | Strong. No security holes found. |
| Frontend code | Good, with a few real bugs. |
| Design | Consistent and tidy, but generic. It reads as a template, not as a product with its own identity. |
| Production deploy | Out of date. It is 12 commits behind `develop` and shows no photos at all. |

Fix the first five items under "Do first" before showing this to employers. Everything else is improvement, not repair.

## How it was assessed

- Read the schema, data layer, pages, map, filters and library code.
- Ran typecheck, lint and `npm audit`: all pass, 0 vulnerabilities.
- Scanned git history for leaked keys: none found.
- Drove the live site with Playwright on desktop (1440 px) and iPhone 13, plus dark colour scheme and JavaScript disabled, recording console errors, failed requests, images, tap-target sizes and timing.
- Measured both the live explorer and a café page with the Taste design inspector at 1440, 768 and 390 px.
- Screenshotted the local `develop` build (landing, explorer, café page) on desktop and mobile.

Not done: the Playwright test suite and a production build were not run, because the working tree was being edited during the review. `FilterBar.tsx` and the landing components were skimmed, not read line by line. The local map did not render in my screenshots; that is most likely because I reached the dev server on `127.0.0.1` instead of `localhost`, so I did not count it as a bug.

## Do first

1. **Deploy `develop` to production.** Production serves `master`, 12 commits behind. Every café photo returns 404 there (`/cafes/bag-of-beans/cover.jpg`), so every card, hero and carousel tile is a beige box with a cup icon. This is the single biggest thing hurting the design today, and the fix is a merge.

2. **Stop inventing amenity details** (`lib/dossier.ts`). A tag becomes a specific claim nobody verified, and a missing tag becomes a negative claim:
   - `with-view` shows "Taal Ridge Caldera View" (line 67) for any café, wherever it is.
   - No `outlets` tag shows "Limited Power Points" (line 47).
   - No `pet-friendly` tag shows "Indoor Restrictions".
   - `specialty` shows "Specialty Grade (80+)".

   A missing tag means unknown. Show what the tag says, and "Not verified yet" otherwise. The site's whole pitch is "hand-verified", so this matters more than any visual issue.

3. **Fix the invisible bookmark icon** (`components/BookmarkButton.tsx:40`). `stroke-currentColor` is not a Tailwind class; it should be `stroke-current`. The unsaved bookmark renders as an empty white circle on every card and on the café page, and the Scoutlist filter chip has the same blank gap. Users cannot tell what the button does.

4. **Replace photos taken from other sites** (`lib/cafe-photos.ts`, `public/cafes/`). Sources include Restaurant Guru (9), Wanderlog (7), Foodpanda (3) and travel blogs. A credit line is not permission, and the README calls them "verified owner credits". It also breaks the project's own rule in `CLAUDE.md`: use the cafés' own photos from their Facebook or Instagram pages. Use those, your own photos, or openly licensed ones.

5. **Redirect old filter links when the landing page ships.** Production serves the explorer at `/`. The uncommitted work moves it to `/explore`. Shared links such as `/?city=Tagaytay&open=1` will then land on the landing page and lose their filters. Redirect `/` with query parameters to `/explore`.

## Code findings

### Required

- **Unknown cafés return HTTP 200.** `/cafe/does-not-exist` shows the not-found page with a 200 status. `notFound()` at `app/cafe/[slug]/page.tsx:58` runs inside `Suspense`, after the response has started. Restoring `generateStaticParams` for the 50 slugs is the likely fix; check it against the Next 16 docs in `node_modules/next/dist/docs/`.
- **Search engines cannot see the cafés.** The server HTML for the explorer is a loading skeleton with four links. With JavaScript disabled there are zero café links. `robots.txt` and `sitemap.xml` return 404, and there are no Open Graph tags. Add `app/sitemap.ts` listing every café, `app/robots.ts`, and `openGraph` metadata with the cover photo.
- **The map's Retry button does nothing** (`components/CafeMap.tsx:319`). It clears the error flag, but the map is created in an effect that runs once, so it is never rebuilt.
- **Café pages are slow.** They took 2 to 5 seconds to finish loading in four measurements, against under 1 second for the other pages. Find out which call is slow before changing anything; `getCafeBySlug` makes two round trips to Supabase in sequence (the café, then `is_open_now`).

### Optional

- **Tests are brittle.** Nine `waitForTimeout` hard waits. One test asserts exactly 50 cafés against the live database, so adding café 51 fails it. There are no unit tests for the pure logic (`filters.ts`, `formatTime`, `parsePoint`, `is_open_now`), which are the cheapest to write.
- **Two sources of truth for content.** `cafe-photos.ts` (475 lines) and `cafe-socials.ts` (312 lines) hard-code data the database already has columns for.
- **Misconfigured deploys fail silently.** `lib/supabase.ts:24` falls back to a placeholder client, so missing env vars in production show zero cafés instead of failing the build.
- **Bad coordinates become 0,0** (`lib/geo.ts:35`), which puts a pin in the ocean with no error.
- **Marker open/closed dots go stale.** `syncMarkers` skips existing markers (`CafeMap.tsx:350`).
- **The explorer ships 588 KB of JavaScript**, most of it MapLibre. Acceptable for a map app; worth knowing.
- **Only HSTS is set.** Add `X-Content-Type-Options`, `Referrer-Policy` and a content security policy in `next.config.ts`. Risk is low because there is no login or user input.

### Nits

- `AGENTS.md` describes a `src/features/` layout the repo does not use.
- Hex colours are hard-coded in `CafeMap.tsx` and duplicate the CSS tokens.
- The README names `brewscout-hyuga.vercel.app` as production. Both aliases are live and serve the same build.

### What is done well

- **Database:** row-level security on every table limited to verified cafés, `search_path = ''` on every function, sensible constraints, a spatial index, and an open-now function that handles past-midnight hours in Manila time.
- **Security:** the Supabase client is server-only, links pass a protocol check (`safeUrl`), and map popups are built with `textContent`, so café data cannot inject script.
- **Stability:** zero console errors and zero failed requests across every page and viewport tested.

## Design findings

### Overall

The design is coherent: one palette, two typefaces, consistent radii, and no horizontal overflow at any width. Keyboard order is sensible and every stop has a visible focus ring. That is a real floor of quality.

What it lacks is identity. Cream background, brown and terracotta accents, a soft serif for headings, rounded cards and pill chips everywhere is the most common look for generated sites, and coffee makes brown the category default on top of that. Nothing on screen could only be Brewscout. The strongest idea in the product is the map with price pins, and the visual design does not build on it.

### Explorer

- **The price pins are the best thing on the page.** Seeing "₱110" and an open/closed dot on the map answers a real question at a glance. Keep and build on this.
- **Pins overlap badly.** In Dasmariñas, Imus and Tagaytay they stack until labels are unreadable ("₱150" half hidden, bare "10"). Cluster them at low zoom, or show dots that grow into price pills as you zoom in.
- **The list is sparse.** Each card is about 150 px tall, so a 900 px screen shows three and a half of 50 cafés. Tighten the card: smaller thumbnail, name and price on one line, tags on the next.
- **Filters crowd out results on a phone.** At the default sheet height, search plus three rows of chips fill the sheet and no café is visible until you scroll. Collapse city, price and vibes behind one "Filters" button on mobile.
- **The Map/List toggle floats over the first card** on mobile and covers its status badge.
- **The search placeholder is cut off** on mobile ("Press '/' to fo") and the keyboard hint means nothing on a phone. Shorten it to "Search cafés, cities, vibes" and drop the hint below desktop width.
- **Tap targets are too small.** On an iPhone 13, 174 of 225 controls are under 44 px. Filter chips are 36 px tall, the bookmark is 32 x 32, and the header links are 16 px tall.
- **Text is too small.** 269 of 441 text blocks on mobile are under 12 px. Tags, city labels and the stats line should be 13 px or more.

### Café page

- **A single photo looks broken.** The gallery is sized for a carousel (`sm:w-[75%]`, `md:w-[65%]` at `app/cafe/[slug]/page.tsx:310`), so one photo leaves a third of the row empty and still shows "1 / 1". With one photo, make it full width and hide the counter.
- **Photos are low resolution.** `bag-of-beans/cover.jpg` is 688 x 473 and is stretched to about 800 px wide, so it is soft on any screen and blurry on retina. Photo quality is also mixed; one has a cartoon watermark.
- **Six identical icon cards** carry the amenities. This is the most recognisable generated-page pattern. A plain two-column list of label and value would be denser and more honest, and it suits verified facts better.
- **There is no map on a map app's detail page.** "Getting There" shows the text "Tagaytay, Cavite (Verified GPS coordinates available)" where an address should be. Show a small static map with the pin, and the real address.
- **Emoji are used as icons** for Google, Waze and Apple navigation and for the route chips. They render differently on every platform. Use the same line icons as the rest of the interface.
- **The mobile action bar truncates the price** ("Typical latte ₱155–…").
- **The page ends abruptly.** There is no footer, and 100 px of empty space sits under the carousel.

### Landing page (local, not yet deployed)

- **It follows the stock sequence:** hero, stats row, four cards, four icon features, gallery strip, dark call-to-action, footer. Each section is competent and none is surprising.
- **The same Kopakoppi photo appears three times** (hero, first guide card, first gallery tile), and the hero crop cuts the sign to "OPA KOP". Lead with your best wide photograph, used once.
- **Small uppercase labels sit above every heading** ("CURATED FIELD GUIDES", "THE GAZETTEER DIFFERENCE", "VISUAL INDEX"). Remove them; the headings already say it.
- **The feature section sells implementation, not benefit.** "PostGIS Spatial Precision" and "Midnight Timezone Logic" mean nothing to someone looking for coffee. Say "Pins on the actual door, not the highway" and "Open-now that knows about 2 AM closings".
- **The mobile header is cramped.** Logo, two links and a button do not fit on one row at 390 px, so the links wrap.
- **Check the claims.** "100% verified independent", "Zero Sponsored Chain Slop" and "24/7 Night Routes" need to be true of all 50 entries; the data has an `is_chain` flag, which suggests some are chains.

### What would give it identity

Pick one of these and commit to it, instead of polishing the current look:

1. **Make the map the hero.** Open the landing page on the live map with price pins, with the headline over it. The product is the picture.
2. **Lean into the gazetteer idea.** The name "Cavite Coffee Gazetteer" is already there. A printed field-guide treatment (dense entries, real coordinates, a ridge elevation line from Bacoor up to Tagaytay) would be specific to this subject.
3. **Use Cavite's own material.** Barako beans, Amadeo, the Taal ridge. One strong photograph or drawing of the place does more than a palette.

## Suggested order of work

| Step | Work | Size |
|---|---|---|
| 1 | Merge `develop` into `master` so production has photos | Minutes |
| 2 | Fix the bookmark icon class | One line |
| 3 | Make amenity text honest | One file |
| 4 | Single-photo gallery layout, real address, small map on café page | Small |
| 5 | Sitemap, robots, Open Graph tags, correct 404 status | Small |
| 6 | Mobile explorer: collapse filters, enlarge tap targets and text | Medium |
| 7 | Pin clustering | Medium |
| 8 | Replace third-party photos | Ongoing |
| 9 | Choose an identity direction and redesign the landing page around it | Large |

## Evidence

Measurements from the Playwright run against production:

| Page | Viewport | Console errors | Broken requests | JavaScript | Images |
|---|---|---|---|---|---|
| Explorer | 1440 | 0 | 0 | 588 KB | 0 |
| Café page | 1440 | 0 | 0 | 157 KB | 0 |
| Explorer | iPhone 13 | 0 | 0 | 589 KB | 0 |

Aborted map-tile requests during panning are normal and were not counted.
