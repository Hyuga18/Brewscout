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
        value: "Fast Wi-Fi Verified",
        status: "positive",
        icon: "wifi",
        note: "Suitable for remote work and browsing",
      }
    : {
        id: "wifi",
        label: "Wi-Fi Connectivity",
        value: "Not verified yet",
        status: "neutral",
        icon: "wifi",
        note: "Check with staff or bring a mobile hotspot",
      };

  // 2. Power Outlets
  const power: Amenity = tags.has("outlets")
    ? {
        id: "power",
        label: "Power Outlets",
        value: "Outlets Available",
        status: "positive",
        icon: "power",
        note: "Accessible power outlets for charging devices",
      }
    : {
        id: "power",
        label: "Power Outlets",
        value: "Not verified yet",
        status: "neutral",
        icon: "power",
        note: "Arrive with charged devices or ask staff upon arrival",
      };

  // 3. Work & Seating Vibe
  const seating: Amenity = tags.has("laptop-friendly")
    ? {
        id: "seat",
        label: "Workspace Vibe",
        value: "Laptop-Friendly",
        status: "positive",
        icon: "seat",
        note: "Conducive environment for study and remote work",
      }
    : tags.has("with-view")
    ? {
        id: "seat",
        label: "Atmosphere",
        value: cafe.city === "Tagaytay" ? "Taal Ridge Caldera View" : "Scenic Outdoor View",
        status: "positive",
        icon: "seat",
        note: "Scenic vista setting; great for relaxation",
      }
    : tags.has("al-fresco")
    ? {
        id: "seat",
        label: "Seating Layout",
        value: "Al Fresco / Open-Air",
        status: "positive",
        icon: "seat",
        note: "Outdoor or semi-outdoor patio seating",
      }
    : {
        id: "seat",
        label: "Atmosphere",
        value: "Standard Indoor Seating",
        status: "neutral",
        icon: "seat",
        note: "Regular dining and café tables",
      };

  // 4. Parking
  const parking: Amenity = tags.has("parking")
    ? {
        id: "parking",
        label: "Parking & Access",
        value: "Customer Parking Available",
        status: "positive",
        icon: "parking",
        note: "Dedicated parking slots or parking area on site",
      }
    : {
        id: "parking",
        label: "Parking & Access",
        value: "Not verified yet",
        status: "neutral",
        icon: "parking",
        note: "Street parking or commercial parking nearby",
      };

  // 5. Pet Friendliness
  const pet: Amenity = tags.has("pet-friendly")
    ? {
        id: "pet",
        label: "Pet Policy",
        value: "Pet-Friendly",
        status: "positive",
        icon: "pet",
        note: "Welcomes leashed pets in designated areas",
      }
    : {
        id: "pet",
        label: "Pet Policy",
        value: "Not verified yet",
        status: "neutral",
        icon: "pet",
        note: "Check with café before bringing pets",
      };

  // 6. Coffee Sourcing
  const coffee: Amenity = tags.has("local-beans")
    ? {
        id: "coffee",
        label: "Bean Sourcing",
        value: "Local Cavite Beans",
        status: "positive",
        icon: "coffee",
        note: "Features local Barako (Liberica) or regional Robusta/Arabica",
      }
    : tags.has("specialty")
    ? {
        id: "coffee",
        label: "Brew Standard",
        value: "Specialty Coffee",
        status: "positive",
        icon: "coffee",
        note: "Dedicated espresso and manual brew offerings",
      }
    : {
        id: "coffee",
        label: "Coffee Program",
        value: "House Espresso & Brews",
        status: "neutral",
        icon: "coffee",
        note: "Standard espresso menu and iced coffee drinks",
      };

  return [wifi, power, seating, parking, pet, coffee];
}

export function getAmbientHeroBadge(cafe: CafeDetail): {
  label: string;
  tone: "ridge" | "work" | "specialty" | "night" | "cozy";
} {
  const tags = new Set(cafe.tags);
  if (tags.has("with-view")) {
    return {
      label: cafe.city === "Tagaytay" ? "Taal Ridge Caldera View" : "Scenic Vista Café",
      tone: "ridge",
    };
  }
  if (tags.has("fast-wifi") && tags.has("outlets")) return { label: "Verified Focus Haven", tone: "work" };
  if (tags.has("local-beans")) return { label: "Cavite Heritage Beans", tone: "specialty" };
  if (tags.has("specialty")) return { label: "Specialty Coffee Bar", tone: "specialty" };
  if (tags.has("open-late") || cafe.is24h) return { label: "Late-Night Espresso Nook", tone: "night" };
  if (tags.has("cozy") || tags.has("aesthetic")) return { label: "Cozy Neighborhood Café", tone: "cozy" };
  return { label: "Independent Cavite Café", tone: "specialty" };
}
