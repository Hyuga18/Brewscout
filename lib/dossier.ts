import type { CafeDetail } from "@/lib/cafes";

export type Amenity = {
  id: string;
  label: string;
  value: string;
  status: "positive" | "neutral" | "caution";
  icon: "wifi" | "power" | "parking" | "pet" | "coffee" | "seat";
  note: string;
};

export function extractAmenities(cafe: CafeDetail): Amenity[] {
  const tags = new Set(cafe.tags);

  // 1. Wi-Fi
  const wifi: Amenity = tags.has("fast-wifi")
    ? {
        id: "wifi",
        label: "Wi-Fi Connectivity",
        value: "Verified Fast Wi-Fi",
        status: "positive",
        icon: "wifi",
        note: "Suitable for video calls & remote work",
      }
    : {
        id: "wifi",
        label: "Wi-Fi Connectivity",
        value: "Standard / Mobile Hotspot",
        status: "neutral",
        icon: "wifi",
        note: "Public connection or mobile hotspot recommended",
      };

  // 2. Power Outlets
  const power: Amenity = tags.has("outlets")
    ? {
        id: "power",
        label: "Power Outlets",
        value: "Plentiful Wall & Bar Outlets",
        status: "positive",
        icon: "power",
        note: "Work tables and bar seats equipped with outlets",
      }
    : {
        id: "power",
        label: "Power Outlets",
        value: "Limited Power Points",
        status: "caution",
        icon: "power",
        note: "Arrive with batteries charged",
      };

  // 3. Work & Seating Vibe
  const seating: Amenity = tags.has("laptop-friendly")
    ? {
        id: "seat",
        label: "Workspace Vibe",
        value: "Laptop-Friendly Ergonomics",
        status: "positive",
        icon: "seat",
        note: "Comfortable work height and productive ambience",
      }
    : tags.has("with-view")
    ? {
        id: "seat",
        label: "Atmosphere",
        value: "Taal Ridge Caldera View",
        status: "positive",
        icon: "seat",
        note: "Scenic ridge vistas; great for reading and leisure",
      }
    : tags.has("al-fresco")
    ? {
        id: "seat",
        label: "Seating Layout",
        value: "Open-Air Garden Deck",
        status: "positive",
        icon: "seat",
        note: "Breezy al fresco seating surrounded by greenery",
      }
    : {
        id: "seat",
        label: "Atmosphere",
        value: "Casual Café Seating",
        status: "neutral",
        icon: "seat",
        note: "Standard dining chairs and social tables",
      };

  // 4. Parking
  const parking: Amenity = tags.has("parking")
    ? {
        id: "parking",
        label: "Parking & Access",
        value: "Dedicated On-Site Parking",
        status: "positive",
        icon: "parking",
        note: "Customer vehicle slots available directly at venue",
      }
    : {
        id: "parking",
        label: "Parking & Access",
        value: "Roadside / Public Access",
        status: "neutral",
        icon: "parking",
        note: "Street parking or nearby commercial pay lots",
      };

  // 5. Pet Friendliness
  const pet: Amenity = tags.has("pet-friendly")
    ? {
        id: "pet",
        label: "Pet Policy",
        value: "Pet-Friendly Venue",
        status: "positive",
        icon: "pet",
        note: "Welcomes leashed pets in designated outdoor zones",
      }
    : {
        id: "pet",
        label: "Pet Policy",
        value: "Indoor Restrictions",
        status: "neutral",
        icon: "pet",
        note: "Confirm with staff for al fresco pet guidelines",
      };

  // 6. Coffee Sourcing
  const coffee: Amenity = tags.has("local-beans")
    ? {
        id: "coffee",
        label: "Bean Terroir",
        value: "Cavite Heritage Beans",
        status: "positive",
        icon: "coffee",
        note: "Features local Amadeo Liberica (Barako) / Robusta origins",
      }
    : tags.has("specialty")
    ? {
        id: "coffee",
        label: "Brew Standard",
        value: "Specialty Grade (80+)",
        status: "positive",
        icon: "coffee",
        note: "Single-origin pour-overs and calibrated espresso",
      }
    : {
        id: "coffee",
        label: "Coffee Program",
        value: "House Espresso Roast",
        status: "neutral",
        icon: "coffee",
        note: "Classic espresso and milk-based favorites",
      };

  return [wifi, power, seating, parking, pet, coffee];
}

export function getAmbientHeroBadge(cafe: CafeDetail): {
  label: string;
  tone: "ridge" | "work" | "specialty" | "night" | "cozy";
} {
  const tags = new Set(cafe.tags);
  if (tags.has("with-view")) return { label: "Taal Ridge Caldera View", tone: "ridge" };
  if (tags.has("fast-wifi") && tags.has("outlets")) return { label: "Verified Focus Haven", tone: "work" };
  if (tags.has("specialty") || tags.has("local-beans"))
    return { label: "Specialty Coffee Roastery", tone: "specialty" };
  if (tags.has("open-late") || cafe.is24h)
    return { label: "Late-Night Espresso Sanctuary", tone: "night" };
  if (tags.has("cozy") || tags.has("aesthetic"))
    return { label: "Artisanal Architectural Space", tone: "cozy" };
  return { label: "Independent Cavite Café", tone: "specialty" };
}
