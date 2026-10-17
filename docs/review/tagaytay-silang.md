# Café review: Tagaytay & Silang

69 imported cafés (40 Tagaytay, 29 Silang), all `unverified`. Generated from Supabase + OpenStreetMap on 2026-10-17.

## How to verify a café

1. Open its **Maps** link and its Facebook/Instagram page. Check it's still open and really a café.
2. In Supabase → Table Editor → `cafes`, find it by name and fix `name`, `slug`, `address` if needed.
3. Add `price_min` / `price_max` (typical latte, PHP), and `description` (one line).
4. Add rows to `cafe_hours` (0 = Sunday … 6 = Saturday; closing after midnight is fine, e.g. 16:00 → 02:00).
5. Add tags in `cafe_tags`, and one cover photo from their own FB/IG (upload to `cafe-photos`, add a `photos` row with `credit` + `source_url`).
6. Set `status` to `verified`. Closed? Set `closed`. Not a café or a duplicate? Delete the row.

## Web check (2026-10-17)

A web search on each suggested café. These are leads, not verification: third-party listings go stale, so confirm on the café's own FB/IG before setting `verified`. Hours and prices from guides are hints only; enter what the café itself posts.

**Likely open: good first picks**

| Café | What I found | To do |
|---|---|---|
| Barista Loft | Reviews mention manual pour-over, strong wifi, al fresco seating; pricier than average ([Wanderlog](https://wanderlog.com/place/details/4044843/barista-loft)) | Find its FB/IG (none found). Candidate tags: fast-wifi, al-fresco, specialty |
| Kopakoppi Cafe | Listed as "Kopa Koppi Cafe" on the Tagaytay–Nasugbu highway: Taal view, reviewers say **24/7**, cash/GCash only ([Wanderlog](https://wanderlog.com/place/details/6907822/kopa-koppi-cafe)) | If 24/7 is confirmed, set `is_24h`. Tags: with-view, open-late |
| Greenhouse Cafe | Plant-filled café in Casa Celina, Enrile St.; one guide lists 8am–9pm daily, phone 0961 447 4530 ([Wanderlog](https://wanderlog.com/place/details/3074097/greenhouse-cafe-tagaytay), [Burpple](https://www.burpple.com/features/restaurants-in-tagaytay-with-stunning-garden-themes)) | More restaurant than coffee shop, your call. Tags: aesthetic |
| 16th Cent Koffie | **Moved** from The Observatory to Zer Franco Bed and Breakfast; drinks from ₱100; posts on FB/IG ([The Post](https://thepost.net.ph/the-feed/food/more-cafes-to-visit-on-a-random-drive-to-tagaytay/)) | **Check the map pin**: OSM may still show the old spot |
| Bag of Beans (×2) | Well-known local Tagaytay café, several branches, sources disagree on hours and addresses ([Klook](https://www.klook.com/en-PH/blog/cafes-coffee-tagaytay/), [Crown Asia](https://www.crownasia.com.ph/?p=4617)) | Confirm which branches these two pins are; consider `local-beans` tag |
| Ruined Project | Coffee Project's flagship at Crosswinds: al fresco, views; a guide lists 7am–9pm daily ([Tablo](https://tablo.com/carolyn-sta-rosa/food-guide-to-the-best-restaurants-in-tagaytay)) | **It's a Coffee Project branch**: set `is_chain = true` |

**Unclear: nothing found online, check FB/Maps**

| Café | Note |
|---|---|
| Cafe Severino | No web results, but OSM has its FB page and hours (Tu–Su 15:30–23:00), so probably small or new. Check the FB link |
| 1999 Coffee | No web results; OSM has an FB page. Check it |
| Bon Appetea, Caffe Nativo, Joane's Cafe, Kape Mo-To | No web results at all. Check Maps; could be closed or renamed |
| Hello Capehan | Possibly "Hello Café" (2023 article, [Tribune](https://tribune.net.ph/2023/05/03/new-restos-to-check-out-in-tagaytay)) |
| Jazz | Possibly "Java Jazz Cafe" on Calamba Road, listed as a restaurant ([Trip.com](https://uk.trip.com/restaurant/philippines/tagaytay/detail/java-jazz-cafe-34923252)) |
| Brewed Awakening | Listed as a restaurant with cabanas and Taal views; reviews say coffee is so-so ([Wanderlog](https://wanderlog.com/place/details/8913673/brewed-awakening)) |

**Probably skip**

| Café | Why |
|---|---|
| Cafe Breton | A Manila crêpe **chain**; no Tagaytay branch found ([Wanderlog](https://wanderlog.com/place/details/2685110/cafe-breton)). Set `is_chain = true` if it exists |
| Lobby Lounge | A hotel lobby lounge (closest match: Taal Vista Hotel), not a café |
| Loumars Pies & Tarts | Pie and pasalubong shop; only source is from 2009 ([blog](https://www.ivanhenares.com/2009/08/tagaytay-food-trip-loumars-ilog-maria.html)) |
| Red Engine Diner | No results; a diner, not a café |

## Web check: Silang (2026-10-17)

Same idea as the Tagaytay check: leads, not verification. Confirm on the café's own FB/IG.

**Likely open: good picks**

| Café | What I found | To do |
|---|---|---|
| Cafe Agapita | Family-run café and bakery in a two-storey house with a garden, Kapitan Sayas St., Sabutan; Filipino fusion food, home-baked cakes; guides list 7am–10pm or 7am–8pm daily ([SmartLocal](https://thesmartlocal.ph/cafe-agapita/), [GMA](https://www.gmanetwork.com/entertainment/showbiznews/list-aesthetic-cafes-in-the-south/75793)) | Strong first pick. Tags: aesthetic, cozy |
| Cafe Dalgona | Korean-style café near Acienda Outlet; reviewers say it's good for groups and work sessions, ample parking; food value is mixed ([Wanderlog](https://wanderlog.com/place/details/6896457/cafe-dalgona)) | Tags: parking, maybe laptop-friendly |
| Gourmet's Cafe | Probably **Gourmet Farms** (Km 52 Aguinaldo Hwy): restaurant + café, 10am–9pm in one listing ([Trip.com](https://au.trip.com/restaurant/philippines/silang/detail/gourmet-farms-20204519)) | Check the name; OSM has their website and hours |
| Concha's Garden Cafe | Garden restaurant inside Mother Earth Gardens, Tagaytay–Silang Road, open since 2014; Filipino food ([Wanderlog](https://wanderlog.com/place/details/4965992/conchas-garden-caf%C3%A9-silang)) | More restaurant than café, your call |

**Unclear: nothing solid found**

| Café | Note |
|---|---|
| Haze Coffee House, 7MJ Arts and Drafts, Café Tribu, Little Cafe, Leonarda's Brew, Migs Cafe, Bean Town Cafe, Forastero Cafe | No web results. Haze has an FB link in OSM; the others have OSM hours or addresses only |
| Kape Amadeo | Possibly **Café Amadeo**, which is in Amadeo, not Silang ([blog](https://www.s1expeditions.com/2021/01/237-amadeo-coffee-avenue.html)). Check the pin |

**Probably skip**

| Café | Why |
|---|---|
| Dear Joe | A Coffee Project–owned **chain** (letter-writing café); no Silang branch found ([Manila Times](https://manilatimes.net/2023/06/27/public-square/pioneer-letter-writing-cafe-opens-three-branches/1897879)). Set `is_chain = true` if kept |
| Le Don's Garden Café | Only listing marks it closed ([Trip.com](https://nz.trip.com/restaurant/philippines/silang/detail/Le%20Don's%20Garden-47886530)) |
| Tabby Town Cat Cafe | The Tabby Town cat café that made news was in Taguig and closed in Feb 2025 ([Interaksyon](https://interaksyon.philstar.com/trends-spotlights/2025/01/14/290124/taguig-based-cat-cafe-close-high-maintenance-costs/)). The Silang pin may be stale |
| Som Thai Cafe, Mariu's Café and Grill, The Green Olive, Valerie's Milkshake, Bing Cha Manila | Restaurants or drink shops, not cafés (not searched) |

**Not in OpenStreetMap: worth adding by hand**

These Silang cafés showed up in guides but aren't in the import. Add them in Supabase with `osm_id` left empty.

| Café | Why it's interesting |
|---|---|
| Monstera Café PH | Plant-filled café in Brgy. Malaking Tatiao; single-origin coffee, pet-friendly, outdoor tables ([SmartLocal](https://thesmartlocal.ph/monstera-cafe-cavite/amp)) |
| Filtr. Coffee | Small café on the Silang–Sta. Rosa border; a reviewer called it good for working (bring headphones) ([Top Gear](https://www.topgear.com.ph/features/lifestyle/coffee-run-filtr-coffee-silang-cavite-a4354-20220630)) |
| Hidden Charm Cafe | Garden café at The South Wholesale Plants, Kastila Road ([SmartLocal](https://thesmartlocal.ph/hidden-charm-cafe-cavite/)) |
| Balinsasayaw Gallery and Café | Café inside an art gallery, Km 48 Lalaan 1 ([SmartLocal](https://thesmartlocal.ph/balinsasayaw-gallery-and-cafe/)) |
| Kataplisso Rustic Brews Café, Upland Kafé, Salakot Cafe | Mentioned in Silang café roundups |

## Suggested first 20

Independent coffee shops with the most information already in OpenStreetMap, Tagaytay first.

1. [ ] **Cafe Severino** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Severino%2014.104112%2C120.942020) · [OSM](https://www.openstreetmap.org/node/12859850835)  
   hours in OSM: `Tu-Su 15:30-23:00` · [FB](https://facebook.com/CafeSeverinotagaytay) · address: 68 Crisanto M. delos Reyes Avenue
2. [ ] **Ruined Project** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Ruined%20Project%2014.136944%2C121.007341) · [OSM](https://www.openstreetmap.org/way/893200116)  
   hours in OSM: `Mo-Th 08:00-20:00; Fr-Su 08:00-21:00` · [FB](https://www.facebook.com/ruinedprojectph) · address: Crosswinds Drive, Tagaytay
3. [ ] **Barista Loft** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Barista%20Loft%2014.101703%2C120.929504) · [OSM](https://www.openstreetmap.org/node/6002665588)  
   hours in OSM: `Su-Th 09:00-23:00; Fr-Sa 09:00-00:00` · no FB/IG/website · phone +63 46 435 0897 · address: Mahogany Avenue
4. [ ] **1999 Coffee** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=1999%20Coffee%2014.125877%2C120.961005) · [OSM](https://www.openstreetmap.org/way/1474562027)  
   no hours · [FB](https://facebook.com/61556956640680) · no address
5. [ ] **Bon Appetea** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Bon%20Appetea%2014.116574%2C120.960976) · [OSM](https://www.openstreetmap.org/node/9681633684)  
   no hours · no FB/IG/website · address: Fora Road, Tagaytay
6. [ ] **Cafe Breton** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Breton%2014.101891%2C120.949990) · [OSM](https://www.openstreetmap.org/node/384843455)  
   no hours · no FB/IG/website · address: Tagaytay
7. [ ] **Caffe Nativo** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Caffe%20Nativo%2014.117382%2C120.964023) · [OSM](https://www.openstreetmap.org/node/4632549962)  
   no hours · no FB/IG/website · address: Tagaytay
8. [ ] **Kopakoppi Cafe** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Kopakoppi%20Cafe%2014.091040%2C120.911730) · [OSM](https://www.openstreetmap.org/node/12595349049)  
   no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Sambong, Tagaytay
9. [ ] **Lobby Lounge** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%2014.095388%2C120.934381) · [OSM](https://www.openstreetmap.org/node/12809215797)  
   no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Kaybagal South, Tagaytay
10. [ ] **Loumars Pies & Tarts** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Loumars%20Pies%20%26%20Tarts%2014.118972%2C120.966101) · [OSM](https://www.openstreetmap.org/node/4632549961)  
   no hours · no FB/IG/website · address: Tagaytay
11. [ ] **Red Engine Diner** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Red%20Engine%20Diner%2014.095137%2C120.938525) · [OSM](https://www.openstreetmap.org/node/2476520894)  
   no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Tagaytay
12. [ ] **16th Cent Koffie** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=16th%20Cent%20Koffie%2014.116584%2C120.986223) · [OSM](https://www.openstreetmap.org/node/9254779617)  
   no hours · no FB/IG/website · no address
13. [ ] **Bag of Beans** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Bag%20of%20Beans%2014.114523%2C120.961814) · [OSM](https://www.openstreetmap.org/node/2503487797)  
   no hours · no FB/IG/website · no address  
   ⚠️ another branch 0.8 km away
14. [ ] **Bag of Beans** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Bag%20of%20Beans%2014.109134%2C120.956970) · [OSM](https://www.openstreetmap.org/node/4575040090)  
   no hours · no FB/IG/website · no address  
   ⚠️ another branch 0.8 km away
15. [ ] **Brewed Awakening** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Brewed%20Awakening%2014.113275%2C120.960308) · [OSM](https://www.openstreetmap.org/node/3787127188)  
   no hours · no FB/IG/website · no address
16. [ ] **Greenhouse Cafe** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Greenhouse%20Cafe%2014.104312%2C120.927937) · [OSM](https://www.openstreetmap.org/node/11368225303)  
   no hours · no FB/IG/website · no address
17. [ ] **Hello Capehan** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Hello%20Capehan%2014.104083%2C120.903155) · [OSM](https://www.openstreetmap.org/node/11495841674)  
   no hours · no FB/IG/website · no address
18. [ ] **Jazz** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Jazz%2014.124323%2C120.986473) · [OSM](https://www.openstreetmap.org/node/4719648490)  
   no hours · no FB/IG/website · no address
19. [ ] **Joane's Cafe** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Joane%27s%20Cafe%2014.088055%2C120.906062) · [OSM](https://www.openstreetmap.org/way/1225965853)  
   no hours · no FB/IG/website · no address
20. [ ] **Kape Mo-To** (Tagaytay) · [Maps](https://www.google.com/maps/search/?api=1&query=Kape%20Mo-To%2014.098788%2C120.929365) · [OSM](https://www.openstreetmap.org/node/13197480870)  
   no hours · no FB/IG/website · no address

## All Tagaytay cafés (40)

✅ = in suggested 20 · ⚠️ = check before verifying

- ✅ **Cafe Severino** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Severino%2014.104112%2C120.942020) · hours in OSM: `Tu-Su 15:30-23:00` · [FB](https://facebook.com/CafeSeverinotagaytay) · address: 68 Crisanto M. delos Reyes Avenue
- ✅ **Ruined Project** · [Maps](https://www.google.com/maps/search/?api=1&query=Ruined%20Project%2014.136944%2C121.007341) · hours in OSM: `Mo-Th 08:00-20:00; Fr-Su 08:00-21:00` · [FB](https://www.facebook.com/ruinedprojectph) · address: Crosswinds Drive, Tagaytay
- ✅ **Barista Loft** · [Maps](https://www.google.com/maps/search/?api=1&query=Barista%20Loft%2014.101703%2C120.929504) · hours in OSM: `Su-Th 09:00-23:00; Fr-Sa 09:00-00:00` · no FB/IG/website · phone +63 46 435 0897 · address: Mahogany Avenue
- ✅ **1999 Coffee** · [Maps](https://www.google.com/maps/search/?api=1&query=1999%20Coffee%2014.125877%2C120.961005) · no hours · [FB](https://facebook.com/61556956640680) · no address
- ✅ **Bon Appetea** · [Maps](https://www.google.com/maps/search/?api=1&query=Bon%20Appetea%2014.116574%2C120.960976) · no hours · no FB/IG/website · address: Fora Road, Tagaytay
- ✅ **Cafe Breton** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Breton%2014.101891%2C120.949990) · no hours · no FB/IG/website · address: Tagaytay
- ✅ **Caffe Nativo** · [Maps](https://www.google.com/maps/search/?api=1&query=Caffe%20Nativo%2014.117382%2C120.964023) · no hours · no FB/IG/website · address: Tagaytay
- ✅ **Kopakoppi Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Kopakoppi%20Cafe%2014.091040%2C120.911730) · no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Sambong, Tagaytay
- ✅ **Lobby Lounge** · [Maps](https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%2014.095388%2C120.934381) · no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Kaybagal South, Tagaytay
- ✅ **Loumars Pies & Tarts** · [Maps](https://www.google.com/maps/search/?api=1&query=Loumars%20Pies%20%26%20Tarts%2014.118972%2C120.966101) · no hours · no FB/IG/website · address: Tagaytay
- ✅ **Red Engine Diner** · [Maps](https://www.google.com/maps/search/?api=1&query=Red%20Engine%20Diner%2014.095137%2C120.938525) · no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Tagaytay
- ✅ **16th Cent Koffie** · [Maps](https://www.google.com/maps/search/?api=1&query=16th%20Cent%20Koffie%2014.116584%2C120.986223) · no hours · no FB/IG/website · no address
- ✅ **Bag of Beans** · [Maps](https://www.google.com/maps/search/?api=1&query=Bag%20of%20Beans%2014.114523%2C120.961814) · no hours · no FB/IG/website · no address  
  another branch 0.8 km away
- ✅ **Bag of Beans** · [Maps](https://www.google.com/maps/search/?api=1&query=Bag%20of%20Beans%2014.109134%2C120.956970) · no hours · no FB/IG/website · no address  
  another branch 0.8 km away
- ✅ **Brewed Awakening** · [Maps](https://www.google.com/maps/search/?api=1&query=Brewed%20Awakening%2014.113275%2C120.960308) · no hours · no FB/IG/website · no address
- ✅ **Greenhouse Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Greenhouse%20Cafe%2014.104312%2C120.927937) · no hours · no FB/IG/website · no address
- ✅ **Hello Capehan** · [Maps](https://www.google.com/maps/search/?api=1&query=Hello%20Capehan%2014.104083%2C120.903155) · no hours · no FB/IG/website · no address
- ✅ **Jazz** · [Maps](https://www.google.com/maps/search/?api=1&query=Jazz%2014.124323%2C120.986473) · no hours · no FB/IG/website · no address
- ✅ **Joane's Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Joane%27s%20Cafe%2014.088055%2C120.906062) · no hours · no FB/IG/website · no address
- ✅ **Kape Mo-To** · [Maps](https://www.google.com/maps/search/?api=1&query=Kape%20Mo-To%2014.098788%2C120.929365) · no hours · no FB/IG/website · no address
- · **Kape Muna** · [Maps](https://www.google.com/maps/search/?api=1&query=Kape%20Muna%2014.103459%2C120.935314) · no hours · no FB/IG/website · no address
- · **Kapihan ni Gunyong** · [Maps](https://www.google.com/maps/search/?api=1&query=Kapihan%20ni%20Gunyong%2014.128514%2C120.962454) · no hours · no FB/IG/website · no address
- · **MIara Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=MIara%20Cafe%2014.097648%2C120.920712) · no hours · no FB/IG/website · no address
- · **Rowena's Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Rowena%27s%20Cafe%2014.133986%2C120.983706) · no hours · no FB/IG/website · no address
- · **Stellar Brews** · [Maps](https://www.google.com/maps/search/?api=1&query=Stellar%20Brews%2014.097552%2C120.919451) · no hours · no FB/IG/website · no address
- ⚠️ **Cafe Voila** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Voila%2014.136144%2C121.011117) · no hours · no FB/IG/website · no address  
  possible duplicate of **The Coffee Bean and Tea Leaf** (9 m)
- ⚠️ **Guadas Bistro** · [Maps](https://www.google.com/maps/search/?api=1&query=Guadas%20Bistro%2014.112181%2C120.959349) · no hours · no FB/IG/website · no address  
  possible duplicate of **Tsokolateria** (16 m)
- ⚠️ **Tsokolateria** · [Maps](https://www.google.com/maps/search/?api=1&query=Tsokolateria%2014.112090%2C120.959232) · no hours · no FB/IG/website · no address  
  possible duplicate of **Guadas Bistro** (16 m)
- ⚠️ **Starbucks Reserve** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%20Reserve%2014.102152%2C120.952158) · hours in OSM: `Mo-Th 07:00-01:00; Fr-Su 06:00-02:00` · [FB](https://facebook.com/100090251101616) · phone +63 046 483 5308 · address: Tagaytay-Nasugbu Road, Silang Crossing West, Tagaytay  
  chain
- ⚠️ **McCafé** · [Maps](https://www.google.com/maps/search/?api=1&query=McCaf%C3%A9%2014.116775%2C120.964062) · hours in OSM: `24/7` · no FB/IG/website · no address  
  chain
- ⚠️ **Starbucks** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%2014.112446%2C120.958621) · hours in OSM: `Mo-Th 09:00-20:00;Fr-Su,PH 08:30-21:30` · no FB/IG/website · no address  
  another branch 2.4 km away; another branch 1.8 km away; another branch 11.4 km away; another branch 2.0 km away; chain
- ⚠️ **Starbucks** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%2014.097249%2C120.942471) · no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Tagaytay  
  another branch 0.7 km away; another branch 13.3 km away; another branch 4.4 km away; another branch 2.4 km away; chain
- ⚠️ **Starbucks** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%2014.101326%2C120.946999) · no hours · no FB/IG/website · address: Tagaytay-Nasugbu Road, Tagaytay  
  another branch 0.7 km away; another branch 12.8 km away; another branch 3.7 km away; another branch 1.8 km away; chain
- ⚠️ **But First, Coffee** · [Maps](https://www.google.com/maps/search/?api=1&query=But%20First%2C%20Coffee%2014.116043%2C120.960835) · no hours · no FB/IG/website · no address  
  chain
- ⚠️ **Figaro** · [Maps](https://www.google.com/maps/search/?api=1&query=Figaro%2014.103022%2C120.951152) · no hours · no FB/IG/website · no address  
  chain
- ⚠️ **Sip n Brew Milk Tea** · [Maps](https://www.google.com/maps/search/?api=1&query=Sip%20n%20Brew%20Milk%20Tea%2014.102790%2C120.941801) · no hours · no FB/IG/website · no address  
  tea/juice/dessert, maybe not a café
- ⚠️ **Starbucks** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%2014.125386%2C120.970932) · no hours · no FB/IG/website · no address  
  another branch 4.4 km away; another branch 3.7 km away; another branch 9.9 km away; another branch 2.0 km away; chain
- ⚠️ **Tom N Toms** · [Maps](https://www.google.com/maps/search/?api=1&query=Tom%20N%20Toms%2014.105623%2C120.954369) · no hours · no FB/IG/website · no address  
  chain; tea/juice/dessert, maybe not a café
- ⚠️ **ZUS Coffee** · [Maps](https://www.google.com/maps/search/?api=1&query=ZUS%20Coffee%2014.113129%2C120.959117) · no hours · no FB/IG/website · no address  
  chain
- ⚠️ **The Coffee Bean and Tea Leaf** · [Maps](https://www.google.com/maps/search/?api=1&query=The%20Coffee%20Bean%20and%20Tea%20Leaf%2014.136086%2C121.011170) · no hours · no FB/IG/website · no address  
  another branch 7.7 km away; another branch 13.1 km away; possible duplicate of **Cafe Voila** (9 m); chain; tea/juice/dessert, maybe not a café

## All Silang cafés (29)

✅ = in suggested 20 · ⚠️ = check before verifying

- · **Gourmet's Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Gourmet%27s%20Cafe%2014.146693%2C120.956580) · hours in OSM: `Mo-Su 10:00-20:30` · [website](http://gourmet.com.ph) · phone +63 46 414 1049 · address: Aguinaldo Highway, Buho, Silang
- · **Haze Coffee House** · [Maps](https://www.google.com/maps/search/?api=1&query=Haze%20Coffee%20House%2014.239701%2C120.975929) · hours in OSM: `09:00-21:00` · [FB](https://www.facebook.com/profile.php?id=100093328371979) · address: J. P. Rizal Street, Sabutan, Silang
- · **7MJ Arts and Drafts Biz Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=7MJ%20Arts%20and%20Drafts%20Biz%20Cafe%2014.246652%2C120.953539) · hours in OSM: `Mo-Su 09:00-20:00` · no FB/IG/website · phone +63 46 412 4682 · address: 288 Ambid Street
- · **Café Tribu** · [Maps](https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Tribu%2014.221796%2C120.973990) · hours in OSM: `Mo-Su 10:00-21:00` · no FB/IG/website · phone 5275254 · address: 4 J. P. Rizal Street
- · **Le Don's Garden Café** · [Maps](https://www.google.com/maps/search/?api=1&query=Le%20Don%27s%20Garden%20Caf%C3%A9%2014.246323%2C120.975123) · hours in OSM: `Th-Su 10:00-21:00` · no FB/IG/website · address: Silang
- · **Little Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Little%20Cafe%2014.227677%2C120.974355) · hours in OSM: `Mo-Su 09:00-22:00` · no FB/IG/website · address: J. P. Rizal Street
- · **Tabby Town Cat Cafe & Corgi Club** · [Maps](https://www.google.com/maps/search/?api=1&query=Tabby%20Town%20Cat%20Cafe%20%26%20Corgi%20Club%2014.182132%2C121.011245) · hours in OSM: `Mo-Fr 12:00-19:00; Sa-Su 11:00-20:00` · no FB/IG/website · address: 410 Santa Rosa-Tagaytay Road
- · **Bing Cha Manila** · [Maps](https://www.google.com/maps/search/?api=1&query=Bing%20Cha%20Manila%2014.200384%2C120.990934) · no hours · no FB/IG/website · address: Pook Road, Silang
- · **Cafe Agapita** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Agapita%2014.229516%2C120.974384) · no hours · no FB/IG/website · address: 11 Kapitan Sayas Street, Silang
- · **Cafe Dalgona** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20Dalgona%2014.177287%2C120.960864) · no hours · no FB/IG/website · address: Silang
- · **Leonarda's Brew** · [Maps](https://www.google.com/maps/search/?api=1&query=Leonarda%27s%20Brew%2014.168915%2C121.000334) · no hours · no FB/IG/website · address: Santa Rosa-Tagaytay Road, Silang
- · **Migs Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Migs%20Cafe%2014.283259%2C120.994105) · no hours · no FB/IG/website · address: Silang
- · **San Antonio Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=San%20Antonio%20Cafe%2014.150832%2C120.956659) · no hours · no FB/IG/website · address: Aguinaldo Highway, Silang
- · **Som Thai Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Som%20Thai%20Cafe%2014.222985%2C120.968223) · no hours · no FB/IG/website · address: Emilio Aguinaldo Highway, Silang
- · **Bean Town Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Bean%20Town%20Cafe%2014.222996%2C120.974269) · no hours · no FB/IG/website · no address
- · **Concha's Garden Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Concha%27s%20Garden%20Cafe%2014.223352%2C121.038034) · no hours · no FB/IG/website · no address
- · **Dear Joe** · [Maps](https://www.google.com/maps/search/?api=1&query=Dear%20Joe%2014.134538%2C120.956417) · no hours · no FB/IG/website · no address
- · **Forastero Cafe** · [Maps](https://www.google.com/maps/search/?api=1&query=Forastero%20Cafe%2014.221548%2C120.973557) · no hours · no FB/IG/website · no address
- · **Kape Amadeo** · [Maps](https://www.google.com/maps/search/?api=1&query=Kape%20Amadeo%2014.187043%2C120.961330) · no hours · no FB/IG/website · no address
- · **Mariu's Café and Grill** · [Maps](https://www.google.com/maps/search/?api=1&query=Mariu%27s%20Caf%C3%A9%20and%20Grill%2014.152002%2C120.956834) · no hours · no FB/IG/website · no address
- · **The Green Olive** · [Maps](https://www.google.com/maps/search/?api=1&query=The%20Green%20Olive%2014.145183%2C120.991476) · no hours · no FB/IG/website · no address
- · **Valerie's Milkshake** · [Maps](https://www.google.com/maps/search/?api=1&query=Valerie%27s%20Milkshake%2014.225915%2C120.974859) · no hours · no FB/IG/website · no address
- ⚠️ **Mixue** · [Maps](https://www.google.com/maps/search/?api=1&query=Mixue%2014.283038%2C120.999098) · hours in OSM: `Mo-Su 09:30-23:30` · no FB/IG/website · address: Governor's Drive, Silang  
  chain; tea/juice/dessert, maybe not a café
- ⚠️ **Mister Donut** · [Maps](https://www.google.com/maps/search/?api=1&query=Mister%20Donut%2014.283726%2C120.997383) · no hours · [website](https://www.mister-donut.com) · no address  
  chain
- ⚠️ **Bunch o' Munch** · [Maps](https://www.google.com/maps/search/?api=1&query=Bunch%20o%27%20Munch%2014.180086%2C121.008218) · no hours · no FB/IG/website · address: Santa Rosa-Tagaytay Road  
  tea/juice/dessert, maybe not a café
- ⚠️ **Starbucks** · [Maps](https://www.google.com/maps/search/?api=1&query=Starbucks%2014.214082%2C120.969018) · no hours · no FB/IG/website · address: Silang  
  another branch 13.3 km away; another branch 12.8 km away; another branch 9.9 km away; another branch 11.4 km away; chain
- ⚠️ **The Coffee Bean and Tea Leaf** · [Maps](https://www.google.com/maps/search/?api=1&query=The%20Coffee%20Bean%20and%20Tea%20Leaf%2014.248175%2C121.048594) · no hours · no FB/IG/website · address: South Boulevard, Silang  
  another branch 12.0 km away; another branch 13.1 km away; chain; tea/juice/dessert, maybe not a café
- ⚠️ **Cafe del Tea** · [Maps](https://www.google.com/maps/search/?api=1&query=Cafe%20del%20Tea%2014.221790%2C120.973568) · no hours · no FB/IG/website · no address  
  tea/juice/dessert, maybe not a café
- ⚠️ **The Coffee Bean & Tea Leaf** · [Maps](https://www.google.com/maps/search/?api=1&query=The%20Coffee%20Bean%20%26%20Tea%20Leaf%2014.183288%2C120.959476) · no hours · no FB/IG/website · no address  
  another branch 12.0 km away; another branch 7.7 km away; chain; tea/juice/dessert, maybe not a café
