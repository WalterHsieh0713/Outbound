import type { FoodSpot } from "@/types";

// ============================================================================
// FOOD SPOTS SEED DATA — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO
// ============================================================================
// Real, named food-focused areas/streets/markets (not generic neighborhoods,
// not individual restaurant recommendations) with real coordinates, plotted
// on an actual interactive map (CityFoodMap.tsx) — unlike the earlier
// illustrative city-map attempt, these coordinates must be geographically
// accurate. Each entry's sourceNote lists the geocoding + descriptive
// sources used.
//
// STATUS: UK only for now — this is the first slice of a real-map feature,
// deliberately scoped to one city so it can be reviewed before Japan/Germany
// data is added (that research has already been gathered but is being held
// back, not wired in, until the UK version is approved).
// ============================================================================

export const foodSpots: FoodSpot[] = [
  {
    id: "uk-borough-market",
    destCountry: "United Kingdom",
    name: "Borough Market",
    description:
      "One of London's oldest and largest food markets, with hundreds of stalls selling artisan produce, cheese, and street food under Victorian ironwork near London Bridge.",
    priceRange: "$$",
    cuisineNote: "Street food & artisan market stalls",
    lat: 51.5054,
    lng: -0.091,
    sourceNote:
      "Coordinates verified via latlong.net (borough-market-london-uk-32432); market history via Wikipedia 'Borough Market'.",
  },
  {
    id: "uk-brick-lane",
    destCountry: "United Kingdom",
    name: "Brick Lane",
    description:
      "East London's 'Curry Capital' and Banglatown, lined with over 50 South Asian curry houses alongside 24-hour beigel shops and street-food stalls.",
    priceRange: "$",
    cuisineNote: "Curry houses & Bangladeshi street food",
    lat: 51.522,
    lng: -0.0717,
    sourceNote:
      "Coordinates via findlatitudeandlongitude.com (91 Brick Lane, E1 6QL); character/history via Eating Europe blog and Time Out coverage of Brick Lane.",
  },
  {
    id: "uk-maltby-street-market",
    destCountry: "United Kingdom",
    name: "Maltby Street Market",
    description:
      "A weekend street-food market tucked under Bermondsey's railway arches, favored by locals over Borough Market for its smaller, artisan-vendor feel.",
    priceRange: "$$",
    cuisineNote: "Independent street food & small producers",
    lat: 51.4993,
    lng: -0.0757,
    sourceNote:
      "Coordinates from Citymapper directions to Maltby Street Market, Ropewalk, SE1 3PA; description via Wikipedia 'Maltby Street Market' and The Nudge London.",
  },
  {
    id: "uk-chinatown-gerrard-street",
    destCountry: "United Kingdom",
    name: "Chinatown (Gerrard Street)",
    description:
      "London's dense East and Southeast Asian dining district centered on pedestrianized Gerrard Street, packed with dim sum halls, bakeries, and hotpot spots under red lantern arches.",
    priceRange: "$$",
    cuisineNote: "Chinese, dim sum & pan-Asian",
    lat: 51.5118,
    lng: -0.1307,
    sourceNote: "Coordinates via Apple Maps listing for Chinatown London, Gerrard Street, W1D 5PD.",
  },
  {
    id: "uk-broadway-market",
    destCountry: "United Kingdom",
    name: "Broadway Market",
    description:
      "A Victorian-era Hackney street market that turns into an upscale Saturday food destination with 150+ traders, artisan bakeries, and destination brunch spots along London Fields.",
    priceRange: "$$$",
    cuisineNote: "Artisan bakeries & gourmet street food",
    lat: 51.5367,
    lng: -0.0618,
    sourceNote:
      "Coordinates and Saturday market details via Wikipedia 'Broadway Market, London' and Hackney Council's official market page.",
  },
];

export function getFoodSpotsByDestination(destCountry: FoodSpot["destCountry"]): FoodSpot[] {
  return foodSpots.filter((f) => f.destCountry === destCountry);
}
