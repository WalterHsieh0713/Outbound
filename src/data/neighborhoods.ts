import type { Neighborhood } from "@/types";

// ============================================================================
// NEIGHBORHOODS SEED DATA — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO
// ============================================================================
// 3 neighborhoods per destination, spanning a cheap/mid/expensive rent
// spread so the budget-affordability coloring on CityMap has something real
// to demonstrate. relativeX/relativeY (0-100) are directionally honest
// relative positions within each city (not surveyed coordinates) — must
// stay in sync with destinationMeta.ts's 3 destinations.
// ============================================================================

export const neighborhoods: Neighborhood[] = [
  // ---------------------------------------------------------------- UK ----
  {
    id: "uk-stratford",
    destCountry: "United Kingdom",
    name: "Stratford",
    vibe: "Regenerated East London hub around Westfield and the Olympic Park — modern, transit-connected, and the budget pick for students.",
    monthlyRentLocalLow: 650,
    monthlyRentLocalHigh: 950,
    currencyCode: "GBP",
    relativeX: 73,
    relativeY: 44,
    sourceNote:
      "Rightmove & Uhomes Stratford student accommodation listings (Sept 2026): general area rent ~£700/month, studios £600-£1,000/month, PBSA £450-£800/month. en.uhomes.com/uk/london/place/stratford ; rightmove.co.uk/student-accommodation/Stratford.html",
  },
  {
    id: "uk-shoreditch",
    destCountry: "United Kingdom",
    name: "Shoreditch",
    vibe: "Hip East London gallery-and-nightlife district popular with creative/arts students; trendier and pricier than its gritty reputation suggests.",
    monthlyRentLocalLow: 850,
    monthlyRentLocalHigh: 1350,
    currencyCode: "GBP",
    relativeX: 58,
    relativeY: 47,
    sourceNote:
      "SpareRoom live Shoreditch/E2 flatshare listings (Sept 2026): double/triple rooms £800-£1,350 pcm. spareroom.co.uk/flatshare/london/shoreditch",
  },
  {
    id: "uk-camden",
    destCountry: "United Kingdom",
    name: "Camden",
    vibe: "Bohemian North London market district with a young, international crowd and quick access to UCL and central campuses.",
    monthlyRentLocalLow: 750,
    monthlyRentLocalHigh: 1350,
    currencyCode: "GBP",
    relativeX: 47,
    relativeY: 33,
    sourceNote:
      "SpareRoom live Camden Town/NW1 flatshare listings (Sept 2026): double rooms £750-£1,350 pcm. London-wide average room rent £978/month per SpareRoom Rental Index Q1 2026. spareroom.co.uk/flatshare/london/camden_town",
  },

  // ------------------------------------------------------------ Japan ----
  {
    id: "japan-nakano",
    destCountry: "Japan",
    name: "Nakano",
    vibe: "Laid-back, retro-Tokyo outer ward with the famous Nakano Broadway arcade — cheaper rent, easy access to Shinjuku via JR Chuo line.",
    monthlyRentLocalLow: 75000,
    monthlyRentLocalHigh: 95000,
    currencyCode: "JPY",
    relativeX: 30,
    relativeY: 42,
    sourceNote:
      "1K apartment rent range for Nakano ward, cited as a budget-friendly student area — Tokyo Relocation Guide, 'Where to Live in Tokyo for Students [2025-2026 Guide]'. tokyorelocationguide.com/blogs/where-to-live-in-tokyo-for-students/",
  },
  {
    id: "japan-takadanobaba",
    destCountry: "Japan",
    name: "Takadanobaba",
    vibe: "Dense student/language-school hub in northern Shinjuku Ward, home station of Waseda University, cheap izakayas and 24hr conveniences.",
    monthlyRentLocalLow: 80000,
    monthlyRentLocalHigh: 105000,
    currencyCode: "JPY",
    relativeX: 38,
    relativeY: 40,
    sourceNote:
      "Private 1K apartment rent for Takadanobaba — Japan-Property.jp, 'Tokyo Apartment Guide: Takadanobaba Area Overview & Rent Prices'. japan-property.jp/blog-rent/details136",
  },
  {
    id: "japan-shibuya",
    destCountry: "Japan",
    name: "Shibuya",
    vibe: "Central, high-energy commercial and nightlife district — walkable to many university campuses but the priciest of the three.",
    monthlyRentLocalLow: 100000,
    monthlyRentLocalHigh: 160000,
    currencyCode: "JPY",
    relativeX: 42,
    relativeY: 60,
    sourceNote:
      "One-room apartment rent range for Shibuya — A-Realty Blog, 'Cost of Living in Shibuya, Tokyo: A 2026 Budget Breakdown'. arealty.jp/blog/cost-of-living-shibuya-tokyo-2026/",
  },

  // ---------------------------------------------------------- Germany ----
  {
    id: "germany-wedding",
    destCountry: "Germany",
    name: "Wedding",
    vibe: "Up-and-coming, gritty-to-gentrifying working-class district north of Mitte, popular with budget-conscious students.",
    monthlyRentLocalLow: 450,
    monthlyRentLocalHigh: 580,
    currencyCode: "EUR",
    relativeX: 47,
    relativeY: 28,
    sourceNote:
      "Uniplaces 'Cost of Living in Berlin (2026)' names Wedding alongside Neukölln as the best rent-to-life ratio for students, WG room range €450-800 citywide with Wedding at the low end. uniplaces.com/city-explorer/cost-of-living-in-berlin-2026/",
  },
  {
    id: "germany-neukoelln",
    destCountry: "Germany",
    name: "Neukölln",
    vibe: "Gritty-cool, multicultural, nightlife-heavy hub with the largest concentration of international/exchange students.",
    monthlyRentLocalLow: 500,
    monthlyRentLocalHigh: 650,
    currencyCode: "EUR",
    relativeX: 53,
    relativeY: 70,
    sourceNote:
      "WG-Gesucht live listing: 18m² room in Neukölln at €580/mo; range corroborated by Uniplaces 2026 city guide citing Neukölln as budget-friendly. wg-gesucht.de/en/wg-zimmer-in-Berlin-Neukoelln.12685703.html",
  },
  {
    id: "germany-mitte",
    destCountry: "Germany",
    name: "Mitte",
    vibe: "Central, touristy, historic core — walkable to universities and landmarks but the priciest place to live.",
    monthlyRentLocalLow: 650,
    monthlyRentLocalHigh: 800,
    currencyCode: "EUR",
    relativeX: 50,
    relativeY: 48,
    sourceNote:
      "Proptech24x7 'How much does student housing in Berlin cost in 2026?' — 18-22m² WG rooms in Mitte/Prenzlauer Berg 'can easily reach €750 or more'; Uniplaces 2026 guide flags Mitte as pushing student budgets toward €1,400/mo. proptech24x7.com/blog/how-much-does-student-housing-in-berlin-cost-in-2026-2/",
  },
];

export function getNeighborhoodsByDestination(
  destCountry: Neighborhood["destCountry"]
): Neighborhood[] {
  return neighborhoods.filter((n) => n.destCountry === destCountry);
}
