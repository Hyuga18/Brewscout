import { readFileSync, writeFileSync } from "fs";

interface DBCafe {
  id: string;
  name: string;
  slug: string;
  city: string;
  status: string;
}

const db: DBCafe[] = JSON.parse(readFileSync("docs/review/db-cafes.json", "utf8"));
const dbBySlug = new Map(db.map((c) => [c.slug, c]));

const verifiedCafes = [
  // Tagaytay (10)
  { slug: "kopakoppi-cafe-tagaytay", name: "Kopakoppi Cafe", price_min: 145, price_max: 165, hours: "24/7", tags: "with-view,open-late,parking", desc: "Scenic 24/7 roadside café along the highway overlooking Taal Lake." },
  { slug: "16th-cent-koffie", name: "16th Cent Koffie", price_min: 100, price_max: 150, hours: "08:00-19:00", tags: "with-view,specialty,al-fresco,cozy", desc: "Overlooking open-air ridge café at Zer Franco Bed & Breakfast with direct Taal volcano views." },
  { slug: "greenhouse-cafe", name: "Greenhouse Cafe", price_min: 130, price_max: 150, hours: "08:00-20:00", tags: "aesthetic,cozy,pet-friendly,parking", desc: "Lush plant-filled showroom café dining inside Casa Celina surrounded by rare exotic greenery." },
  { slug: "bag-of-beans", name: "Bag of Beans", price_min: 155, price_max: 175, hours: "Mo-Fr 06:30-21:00; Sa,Su 06:30-22:00", tags: "local-beans,aesthetic,cozy,with-view,parking", desc: "Iconic rustic Tagaytay garden estate serving house-blend local coffee and breakfast platters." },
  { slug: "tsokolateria", name: "Tsokolateria", price_min: 150, price_max: 200, hours: "Mo-Th 09:00-21:00; Fr-Su 08:00-22:00", tags: "local-beans,aesthetic,with-view,cozy", desc: "Artisanal chocolate and native coffee café at The Boutique overlooking Taal." },
  { slug: "barista-loft", name: "Barista Loft", price_min: 150, price_max: 190, hours: "Su-Th 09:00-23:00; Fr-Sa 09:00-00:00", tags: "fast-wifi,specialty,cozy,al-fresco,open-late", desc: "Specialty manual pour-overs and espresso on Mahogany Ave with strong wifi and al fresco patio." },
  { slug: "cafe-severino", name: "Cafe Severino", price_min: 120, price_max: 160, hours: "Tu-Su 15:30-23:00", tags: "open-late,cozy,quiet", desc: "Intimate late-afternoon and evening café on Crisanto Delos Reyes Ave." },
  { slug: "ruined-project-tagaytay", name: "Ruined Project", price_min: 190, price_max: 230, hours: "Mo-Th 08:00-20:00; Fr-Su 08:00-21:00", tags: "with-view,al-fresco,aesthetic,parking", desc: "High-ceiling rustic al fresco nature café tucked into pine trees at Crosswinds Tagaytay." },
  { slug: "kape-mo-to", name: "Kape Mo-To", price_min: 110, price_max: 150, hours: "14:00-23:00", tags: "with-view,open-late,al-fresco", desc: "Biker and road-trip friendly roadside coffee stop with fresh brews and Taal breeze." },
  { slug: "stellar-brews", name: "Stellar Brews", price_min: 120, price_max: 160, hours: "09:00-21:00", tags: "cozy,quiet,al-fresco", desc: "Chill Tagaytay coffee nook with artisanal espresso and pastries." },

  // Silang (10)
  { slug: "cafe-agapita-silang", name: "Cafe Agapita", price_min: 160, price_max: 181, hours: "07:00-21:00", tags: "aesthetic,cozy,pet-friendly,parking,al-fresco", desc: "Beloved family-run rustic garden café in a two-storey heritage house in Sabutan." },
  { slug: "cafe-dalgona-silang", name: "Cafe Dalgona", price_min: 150, price_max: 180, hours: "10:00-21:00", tags: "parking,laptop-friendly,cozy,aircon", desc: "Spacious Korean-style café near Acienda Designer Outlet with honeycomb lattes and bingsu." },
  { slug: "gourmets-cafe-silang", name: "Gourmet's Cafe", price_min: 160, price_max: 160, hours: "10:00-20:30", tags: "local-beans,specialty,parking", desc: "Pioneer organic farm-to-cup café at Gourmet Farms along Aguinaldo Highway." },
  { slug: "conchas-garden-cafe", name: "Concha's Garden Cafe", price_min: 130, price_max: 180, hours: "08:00-21:00", tags: "al-fresco,aesthetic,cozy,parking", desc: "Vintage rustic garden estate restaurant and café inside Mother Earth Gardens." },
  { slug: "haze-coffee-house-silang", name: "Haze Coffee House", price_min: 110, price_max: 160, hours: "09:00-21:00", tags: "cozy,quiet,aircon", desc: "Neighborhood coffee house on J.P. Rizal Street in Silang serving espresso drinks and classic snacks." },
  { slug: "kape-amadeo", name: "Kape Amadeo", price_min: 120, price_max: 160, hours: "08:00-19:00", tags: "local-beans,parking,cozy", desc: "The cooperative home of the legendary 4-bean Pahimis blend in the Coffee Capital." },
  { slug: "leonardas-brew-silang", name: "Leonarda's Brew", price_min: 120, price_max: 150, hours: "09:00-20:00", tags: "cozy,quiet,parking", desc: "Roadside specialty coffee brew stop along Santa Rosa-Tagaytay Road." },
  { slug: "forastero-cafe", name: "Forastero Cafe", price_min: 110, price_max: 150, hours: "10:00-20:00", tags: "cozy,quiet,local-beans", desc: "Intimate homegrown coffee nook in Silang celebrating regional harvests." },
  { slug: "7mj-arts-and-drafts-biz-cafe", name: "7MJ Arts and Drafts Biz Cafe", price_min: 100, price_max: 140, hours: "09:00-20:00", tags: "laptop-friendly,quiet,aircon", desc: "Quiet workspace and biz café on Ambid Street ideal for light remote study." },
  { slug: "bean-town-cafe", name: "Bean Town Cafe", price_min: 110, price_max: 150, hours: "10:00-21:00", tags: "cozy,quiet,aircon", desc: "Friendly neighborhood espresso bar in Silang town center." },

  // Dasmariñas (8)
  { slug: "coffee-and-beyond", name: "Coffee & Beyond", price_min: 130, price_max: 190, hours: "Mo-Sa 11:00-23:00; Su 11:00-22:00", tags: "open-late,fast-wifi,laptop-friendly,cozy", desc: "Late-night neighborhood hangout and study café in Green Breeze Langkaan with comfort rice meals." },
  { slug: "forresta-cafe-dasmarinas", name: "Forresta Cafe", price_min: 180, price_max: 240, hours: "07:00-21:00", tags: "aesthetic,with-view,parking,aircon", desc: "Lush nature-inspired destination café in Forresta Villar Land with serene outdoor spaces." },
  { slug: "alab-grounds", name: "Alab Grounds", price_min: 120, price_max: 160, hours: "08:00-22:00", tags: "laptop-friendly,outlets,fast-wifi,aircon", desc: "Campus-favorite study coffee shop near university belts with dedicated power sockets." },
  { slug: "tinatangi-cafe", name: "Tinatangi Café", price_min: 110, price_max: 150, hours: "10:00-22:00", tags: "aesthetic,cozy,aircon", desc: "Homey boutique café in Dasmariñas serving handcrafted espresso and artisanal desserts." },
  { slug: "cafe-salvacion", name: "Café Salvacion", price_min: 110, price_max: 150, hours: "09:00-21:00", tags: "cozy,quiet,aircon", desc: "Cozy neighborhood coffee retreat in Dasmariñas with comfort snacks and cold brews." },
  { slug: "grace-brew-cafe-dasmarinas", name: "Grace Brew Cafe", price_min: 100, price_max: 140, hours: "10:00-21:00", tags: "cozy,quiet,aircon", desc: "Warm and inviting local coffee spot serving classic espresso drinks and baked goods." },
  { slug: "brew-93", name: "Brew 93°", price_min: 120, price_max: 160, hours: "09:00-21:00", tags: "specialty,aircon,laptop-friendly", desc: "Specialty coffee brewing station focused on precise extraction and smooth lattes." },
  { slug: "bike-and-brew-club-dasmarinas", name: "Bike and Brew Club", price_min: 100, price_max: 140, hours: "06:00-20:00", tags: "al-fresco,parking,cozy", desc: "Early-morning cyclist and runner pitstop serving hot local Barako and energizing iced coffee." },

  // General Trias (4)
  { slug: "kura-cafe", name: "Kura Cafe", price_min: 125, price_max: 140, hours: "24/7", tags: "open-late,laptop-friendly,fast-wifi,parking,aircon", desc: "Popular 24-hour study and work haven at The Zhang Place in Manggahan with budget-friendly lattes." },
  { slug: "cafe-blk-and-brwn", name: "Cafe BLK&BRWN", price_min: 125, price_max: 165, hours: "Mo-Th 11:00-23:00; Fr-Su 11:00-00:00", tags: "open-late,cozy,al-fresco,aircon", desc: "Sleek industrial late-night café in Pinagtipunan open until midnight on weekends." },
  { slug: "cafe-mia-at-the-primrose-general-trias", name: "Cafe Mia at The Primrose", price_min: 130, price_max: 170, hours: "09:00-21:00", tags: "aesthetic,cozy,parking,aircon", desc: "Charming pastel-toned café inside The Primrose serving sweet lattes and afternoon tea." },
  { slug: "brainstorms-and-brews-general-trias", name: "Brainstorms and Brews", price_min: 110, price_max: 150, hours: "08:00-22:00", tags: "laptop-friendly,fast-wifi,outlets,aircon", desc: "Study-first coworking café created for freelancers and students with reliable wifi." },

  // Imus (6)
  { slug: "cafe-10-23", name: "Cafe 10/23", price_min: 150, price_max: 195, hours: "08:00-22:00", tags: "specialty,aesthetic,parking,aircon", desc: "Stylish modern café on Imus Boulevard partnering with specialty roasters for sea salt Spanish lattes." },
  { slug: "anabrew-st-imus", name: "Anabrew St.", price_min: 110, price_max: 150, hours: "10:00-22:00", tags: "cozy,open-late,al-fresco", desc: "Vibrant neighborhood coffee street nook in Anabu serving community-crafted espresso." },
  { slug: "beantage-coffee-imus", name: "Beantage Coffee", price_min: 120, price_max: 160, hours: "09:00-21:00", tags: "aesthetic,cozy,aircon", desc: "Vintage-inspired cozy aesthetic coffee haven in Imus with signature caramel brews." },
  { slug: "bean-street-coffee-imus", name: "Bean Street Coffee", price_min: 110, price_max: 150, hours: "09:00-22:00", tags: "laptop-friendly,fast-wifi,aircon", desc: "Cozy street café for quick caffeine runs and casual work sessions in Imus." },
  { slug: "bakers-district-imus", name: "Baker's District", price_min: 130, price_max: 170, hours: "08:00-21:00", tags: "aesthetic,cozy,aircon,parking", desc: "Artisanal bakery and specialty café pairing fresh pastries with specialty espresso." },
  { slug: "2nd-coffee", name: "2nd Coffee", price_min: 110, price_max: 150, hours: "09:00-21:00", tags: "specialty,cozy,quiet", desc: "Minimalist third-wave neighborhood coffee bar in Imus focused on quality espresso." },

  // Bacoor (4)
  { slug: "aroma-brew-coffee", name: "Aroma Brew Coffee", price_min: 110, price_max: 150, hours: "08:00-22:00", tags: "cozy,quiet,aircon", desc: "Comfortable neighborhood coffee spot in Bacoor known for fragrant roasts and lattes." },
  { slug: "cafe-bela", name: "Café Bela", price_min: 120, price_max: 160, hours: "09:00-21:00", tags: "aesthetic,cozy,aircon", desc: "Chic neighborhood bistro café serving specialty flavored lattes and pasta plates." },
  { slug: "caffeena-bacoor", name: "Caffeena", price_min: 110, price_max: 150, hours: "08:00-22:00", tags: "laptop-friendly,fast-wifi,aircon", desc: "Bright modern café in Bacoor with great study tables and strong espresso." },
  { slug: "coffea-arabica", name: "Coffea Arabica", price_min: 120, price_max: 160, hours: "09:00-21:00", tags: "specialty,local-beans,cozy", desc: "Specialty coffee shop dedicated to pure Arabica bean extractions and cold brews." },

  // Kawit & Cavite City (4)
  { slug: "hiwaga-cafe-kawit", name: "Hiwaga Cafe", price_min: 120, price_max: 160, hours: "10:00-22:00", tags: "aesthetic,cozy,al-fresco", desc: "Charming mystical-themed garden café in Kawit with refreshing fruit lattes and snacks." },
  { slug: "inam-coffee-kawit", name: "INAM Coffee", price_min: 110, price_max: 150, hours: "08:00-21:00", tags: "local-beans,cozy,aircon", desc: "Heritage-conscious community coffee bar in Kawit serving local Philippine roasts." },
  { slug: "countryside-cafe-kawit", name: "Countryside Cafe", price_min: 110, price_max: 150, hours: "09:00-21:00", tags: "al-fresco,cozy,parking", desc: "Relaxing open-air countryside coffee stop in Kawit for road-trippers and brunch." },
  { slug: "cafe-antix", name: "Cafe Antix", price_min: 70, price_max: 110, hours: "Mo-Sa 09:00-21:00", tags: "cozy,quiet,aircon", desc: "Beloved retro antique-filled neighborhood café serving budget-friendly lattes and pizzas." },

  // Amadeo (4)
  { slug: "cafe-amadeo-amadeo", name: "Cafe Amadeo", price_min: 120, price_max: 160, hours: "08:00-19:00", tags: "local-beans,parking,cozy", desc: "The cooperative home of the legendary 4-bean Pahimis blend in the official Coffee Capital." },
  { slug: "kaffe-belardo-amadeo", name: "Kaffe Belardo", price_min: 110, price_max: 150, hours: "08:00-19:00", tags: "local-beans,parking,cozy", desc: "Pioneer coffee roastery and café in Amadeo serving authentic local Barako and blends." },
  { slug: "ricardos-coffee-classic-cuisine-amadeo", name: "Ricardo's Coffee + Classic Cuisine", price_min: 140, price_max: 180, hours: "08:00-20:00", tags: "aesthetic,parking,cozy,al-fresco", desc: "Upland garden dining destination in Amadeo serving classic comfort cuisine and local coffee." },
  { slug: "calle-crisanto-amadeo", name: "Calle Crisanto", price_min: 120, price_max: 160, hours: "08:00-20:00", tags: "al-fresco,cozy,local-beans", desc: "Rustic open-air coffee stop along Crisanto Delos Reyes Avenue amidst Amadeo coffee farms." }
];

console.log("Total verified cafes prepared:", verifiedCafes.length);

let missing = 0;
for (const c of verifiedCafes) {
  if (!dbBySlug.has(c.slug)) {
    console.error("Missing in DB:", c.slug);
    missing++;
  }
}
console.log("Missing check finished. Missing:", missing);

if (missing === 0) {
  const csvHeader = "slug,action,name,price_min,price_max,hours,tags,description,fb_url,ig_url,website,photo_url,photo_credit,photo_source";
  const lines = [csvHeader];
  for (const c of verifiedCafes) {
    lines.push(`${c.slug},verify,"${c.name.replace(/"/g, '""')}",${c.price_min},${c.price_max},"${c.hours}","${c.tags}","${c.desc.replace(/"/g, '""')}",,,,,`);
  }
  writeFileSync("docs/review/db-verified-batch.csv", lines.join("\n") + "\n");
  console.log("Successfully wrote docs/review/db-verified-batch.csv with", verifiedCafes.length, "rows.");
}
