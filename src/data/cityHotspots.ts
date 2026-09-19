import type { CityHotspot } from "@/types";

// ============================================================================
// CITY HOTSPOTS SEED DATA
// ============================================================================
// Illustrative pins for the stylized per-destination city map (CityMap.tsx).
// Must stay in sync with:
//   - destinationMeta.ts — one set of 5 hotspots per destination there
//     (United Kingdom, Japan, Germany)
//   - requirements.ts — every requirementIds entry below must be a real
//     Requirement.id from that file for the matching destCountry/category.
// "embassy" hotspots intentionally have no requirementIds — their popup
// reads emergencyInfo.ts by destCountry instead. relativeX/relativeY are
// pinned to the map's outer margins (true corners + top-center for embassy)
// specifically so they stay clear of neighborhoods.ts's real researched
// positions, which cluster centrally (roughly X 28-73, Y 28-70 across all
// 3 destinations) — they are not geographically meaningful themselves.
// ============================================================================

export const cityHotspots: CityHotspot[] = [
  // ---------------------------------------------------------------- UK ----
  {
    id: "uk-hotspot-banking",
    destCountry: "United Kingdom",
    type: "banking",
    label: "Bank account",
    relativeX: 12,
    relativeY: 12,
    requirementIds: ["usa-uk-banking"],
  },
  {
    id: "uk-hotspot-academic",
    destCountry: "United Kingdom",
    type: "academic",
    label: "Credit transfer",
    relativeX: 88,
    relativeY: 12,
    requirementIds: ["usa-uk-academic"],
  },
  {
    id: "uk-hotspot-housing",
    destCountry: "United Kingdom",
    type: "housing",
    label: "Halls deposit",
    relativeX: 12,
    relativeY: 88,
    requirementIds: ["usa-uk-housing"],
  },
  {
    id: "uk-hotspot-health-insurance",
    destCountry: "United Kingdom",
    type: "health-insurance",
    label: "Health & IHS",
    relativeX: 88,
    relativeY: 88,
    requirementIds: ["usa-uk-health", "usa-uk-insurance"],
  },
  {
    id: "uk-hotspot-embassy",
    destCountry: "United Kingdom",
    type: "embassy",
    label: "U.S. Embassy London",
    relativeX: 50,
    relativeY: 8,
  },

  // ------------------------------------------------------------ Japan ----
  {
    id: "japan-hotspot-banking",
    destCountry: "Japan",
    type: "banking",
    label: "Bank account",
    relativeX: 12,
    relativeY: 12,
    requirementIds: ["usa-japan-banking"],
  },
  {
    id: "japan-hotspot-academic",
    destCountry: "Japan",
    type: "academic",
    label: "Credit transfer",
    relativeX: 88,
    relativeY: 12,
    requirementIds: ["usa-japan-academic"],
  },
  {
    id: "japan-hotspot-housing",
    destCountry: "Japan",
    type: "housing",
    label: "Housing",
    relativeX: 12,
    relativeY: 88,
    requirementIds: ["usa-japan-housing"],
  },
  {
    id: "japan-hotspot-health-insurance",
    destCountry: "Japan",
    type: "health-insurance",
    label: "Health & NHI",
    relativeX: 88,
    relativeY: 88,
    requirementIds: ["usa-japan-health", "usa-japan-insurance"],
  },
  {
    id: "japan-hotspot-embassy",
    destCountry: "Japan",
    type: "embassy",
    label: "U.S. Embassy Tokyo",
    relativeX: 50,
    relativeY: 8,
  },

  // ---------------------------------------------------------- Germany ----
  {
    id: "germany-hotspot-banking",
    destCountry: "Germany",
    type: "banking",
    label: "Sperrkonto",
    relativeX: 12,
    relativeY: 12,
    requirementIds: ["usa-germany-banking"],
  },
  {
    id: "germany-hotspot-academic",
    destCountry: "Germany",
    type: "academic",
    label: "Credit transfer",
    relativeX: 88,
    relativeY: 12,
    requirementIds: ["usa-germany-academic"],
  },
  {
    id: "germany-hotspot-housing",
    destCountry: "Germany",
    type: "housing",
    label: "Dorm / Kaution",
    relativeX: 12,
    relativeY: 88,
    requirementIds: ["usa-germany-housing"],
  },
  {
    id: "germany-hotspot-health-insurance",
    destCountry: "Germany",
    type: "health-insurance",
    label: "Health & insurance",
    relativeX: 88,
    relativeY: 88,
    requirementIds: ["usa-germany-health", "usa-germany-insurance"],
  },
  {
    id: "germany-hotspot-embassy",
    destCountry: "Germany",
    type: "embassy",
    label: "U.S. Consulate General Berlin",
    relativeX: 50,
    relativeY: 8,
  },
];

export function getHotspotsByDestination(destCountry: CityHotspot["destCountry"]): CityHotspot[] {
  return cityHotspots.filter((h) => h.destCountry === destCountry);
}
