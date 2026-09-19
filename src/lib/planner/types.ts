// Display-ready, serializable config for the step-by-step planner. Built on
// the server from src/data/*.ts so the client wizard only does selection +
// arithmetic — no data imports, and any destination can plug in the same shape.

export type Level = "low" | "medium" | "high" | "varies";

export type StepKey = "major" | "program" | "location" | "living";
export type Choices = Partial<Record<StepKey, string>>;

export interface PlannerMajor {
  id: string;
  label: string;
  icon: string;
  fit: "strong" | "possible";
  note: string;
}

export interface PlannerProgram {
  id: string;
  name: string;
  icon: string;
  description: string;
  costModel: string;
  costRange: string;
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
  icon: string;
  description: string;
  costLevel: Level;
  immersionLevel: Level;
  independenceLevel: Level;
  /** true = housing cost is estimated from the chosen location's rent range */
  usesLocationRent: boolean;
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
  monthlyUsd: { food: number; transit: number; phone: number; insurance: number };
  oneTimeUsd: { visa: number; flightLow: number; flightHigh: number };
  visaTip: { title: string; description: string; leadTimeDays: number } | null;
  checklistHref: string;
}
