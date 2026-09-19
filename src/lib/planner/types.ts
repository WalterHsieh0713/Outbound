// Display-ready, serializable config for the step-by-step planner. Built on
// the server from src/data/*.ts so the client wizard only does selection +
// arithmetic — no data imports, and any destination can plug in the same shape.

export type Level = "low" | "medium" | "high" | "varies";

export type StepKey = "major" | "program" | "location" | "living";
export type Choices = Partial<Record<StepKey, string>>;

export interface PlannerMajor {
  id: string;
  label: string;
  fit: "strong" | "possible";
  note: string;
  /** researched top destinations for this field (used to show where the UK ranks) */
  topCountries: string[];
}

export interface PlannerProgram {
  id: string;
  name: string;
  description: string;
  costModel: string;
  /** one-line form, used in the confirmation page */
  costRange: string;
  /** big number shown on the program card, e.g. "$12,350–$20,950" */
  costHeadline: string;
  costCaption: string;
  /** all-in provider fee already covers housing, so separate rent would double-count */
  bundlesHousing: boolean;
  available: boolean;
  caveat?: string;
}

export interface PlannerLocation {
  id: string;
  name: string;
  vibe: string;
  lat: number;
  lng: number;
  rentLowLocal: number;
  rentHighLocal: number;
  rentLowUsd: number;
  rentHighUsd: number;
}

export interface PlannerLiving {
  id: string;
  name: string;
  description: string;
  costLevel: Level;
  immersionLevel: Level;
  independenceLevel: Level;
  /** true = housing cost is estimated from the chosen location's rent range */
  usesLocationRent: boolean;
}

export type PoiKind = "food" | "embassy";

/** A real place on the map that is informational only (not a choice you make). */
export interface PlannerPoi {
  id: string;
  kind: PoiKind;
  name: string;
  lat: number;
  lng: number;
  blurb: string;
  tags: string[];
  lines: string[];
  priceRange?: "$" | "$$" | "$$$";
}

/** A non-geographic to-do (bank account, credit transfer...) backed by real requirement data. */
export interface PlannerEssential {
  id: string;
  label: string;
  items: { title: string; description: string; timing: string }[];
}

export interface PlannerConfig {
  slug: string;
  destCountry: string;
  flagEmoji: string;
  city: string;
  cityLat: number;
  cityLng: number;
  origin: { label: string; lat: number; lng: number };
  blurb: string;
  currencySymbol: string;
  majors: PlannerMajor[];
  programs: PlannerProgram[];
  locations: PlannerLocation[];
  living: PlannerLiving[];
  pois: PlannerPoi[];
  essentials: PlannerEssential[];
  monthlyUsd: { food: number; transit: number; phone: number; insurance: number };
  oneTimeUsd: { visa: number; flightLow: number; flightHigh: number };
  visaTip: { title: string; description: string; leadTimeDays: number } | null;
  checklistHref: string;
}
