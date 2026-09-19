import type { DestinationMeta } from "@/types";

// Coordinates are the primary city used elsewhere in this app's data
// (London / Tokyo / Berlin) so the globe pin lines up with the cost-of-living
// and emergency-info figures for that same city.
export const destinationMeta: DestinationMeta[] = [
  {
    destCountry: "United Kingdom",
    slug: "uk",
    flagEmoji: "🇬🇧",
    capitalCity: "London",
    lat: 51.5074,
    lng: -0.1278,
    blurb:
      "US citizens need a Student visa and pay a health surcharge that unlocks full NHS access — no separate insurance needed for most programs.",
  },
  {
    destCountry: "Japan",
    slug: "japan",
    flagEmoji: "🇯🇵",
    capitalCity: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    blurb:
      "Getting a Certificate of Eligibility can take months, so this is the destination where starting early matters most.",
  },
  {
    destCountry: "Germany",
    slug: "germany",
    flagEmoji: "🇩🇪",
    capitalCity: "Berlin",
    lat: 52.52,
    lng: 13.405,
    blurb:
      "US citizens skip the pre-arrival visa entirely — the real hard deadline is filing for a residence permit within 90 days of landing.",
  },
];

// Non-clickable reference marker for the origin.
export const originMeta = {
  destCountry: "USA" as const,
  flagEmoji: "🇺🇸",
  capitalCity: "Washington, D.C.",
  lat: 38.9072,
  lng: -77.0369,
};

export function getDestinationMetaBySlug(slug: string): DestinationMeta | undefined {
  return destinationMeta.find((d) => d.slug === slug);
}
