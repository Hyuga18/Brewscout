export type FieldGuide = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  badge: string;
  accentColor: string;
  cafeSlugs: string[];
  filterTags?: string[];
  city?: string;
  coverPhoto: string;
};

export const FIELD_GUIDES: FieldGuide[] = [
  {
    id: "taal-ridge",
    slug: "taal-ridge",
    title: "Taal Ridge & Sunsets",
    tagline: "Volcanic views, open-air ridges, and cool mountain air",
    description:
      "Iconic coffee stops perched along the Tagaytay ridge with sweeping panoramas of Taal Volcano and Lake.",
    icon: "🌋",
    badge: "Tagaytay Ridge",
    accentColor: "#9c4a2f",
    cafeSlugs: [
      "kopakoppi-cafe-tagaytay",
      "16th-cent-koffie",
      "bag-of-beans",
      "ruined-project-tagaytay",
      "tsokolateria",
    ],
    filterTags: ["with-view"],
    city: "Tagaytay",
    coverPhoto: "/cafes/kopakoppi-cafe-tagaytay/cover.jpg",
  },
  {
    id: "secret-gardens",
    slug: "secret-gardens",
    title: "Secret Garden Sanctuaries",
    tagline: "Lush botanical courtyards and heritage architecture",
    description:
      "Tucked-away garden estates in Silang surrounded by rare exotic flora, heirloom trees, and artisan roasts.",
    icon: "🌿",
    badge: "Silang Sanctuaries",
    accentColor: "#3b5e43",
    cafeSlugs: [
      "cafe-agapita-silang",
      "gourmets-cafe-silang",
      "conchas-garden-cafe",
      "greenhouse-cafe",
      "haze-coffee-house-silang",
    ],
    filterTags: ["al-fresco", "aesthetic"],
    city: "Silang",
    coverPhoto: "/cafes/cafe-agapita-silang/cover.jpg",
  },
  {
    id: "barako-belt",
    slug: "barako-belt",
    title: "Kapeng Barako Heritage",
    tagline: "The cradle of Philippine Liberica and farm cooperatives",
    description:
      "Journey through the coffee capital of Amadeo to taste authentic single-origin Liberica and historic community roasteries.",
    icon: "☕",
    badge: "Amadeo Coffee Capital",
    accentColor: "#6f4325",
    cafeSlugs: [
      "kape-amadeo",
      "cafe-amadeo-amadeo",
      "kaffe-belardo-amadeo",
      "calle-crisanto-amadeo",
      "ricardos-coffee-classic-cuisine-amadeo",
    ],
    filterTags: ["local-beans"],
    city: "Amadeo",
    coverPhoto: "/cafes/cafe-amadeo-amadeo/cover.jpg",
  },
  {
    id: "late-night",
    slug: "late-night",
    title: "Late-Night & 24/7 Nooks",
    tagline: "High-speed Wi-Fi, abundant outlets, and midnight brewing",
    description:
      "Remote-work retreats and midnight pitstops that stay open late or around the clock for night-owl drives.",
    icon: "🌙",
    badge: "Night Owl Nooks",
    accentColor: "#24334a",
    cafeSlugs: [
      "kopakoppi-cafe-tagaytay",
      "barista-loft",
      "cafe-severino",
      "alab-grounds",
      "tinatangi-cafe",
    ],
    filterTags: ["open-late", "fast-wifi"],
    coverPhoto: "/cafes/barista-loft/cover.jpg",
  },
];

export function getFieldGuideBySlug(slug: string): FieldGuide | null {
  if (!slug) return null;
  return FIELD_GUIDES.find((g) => g.slug === slug) ?? null;
}

export function getAllFieldGuides(): FieldGuide[] {
  return [...FIELD_GUIDES];
}
