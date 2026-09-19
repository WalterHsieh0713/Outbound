// Shared domain types for AbroadReady.
// No LLM types here on purpose — everything downstream of these is
// deterministic lookups + arithmetic over hardcoded/researched data.

export type OriginCountry = "USA";

export type DestCountry = "United Kingdom" | "Japan" | "Germany";

export type RequirementCategory =
  | "visa"
  | "health"
  | "insurance"
  | "housing"
  | "academic"
  | "banking";

/**
 * One line item in a study-abroad requirement checklist.
 * `leadTimeDays` = how many days before the program start date this item
 * must be started/completed by. The app computes the actual calendar
 * deadline as (programStartDate - leadTimeDays).
 */
export interface Requirement {
  id: string;
  originCountry: OriginCountry;
  destCountry: DestCountry;
  category: RequirementCategory;
  title: string;
  description: string;
  leadTimeDays: number;
  isHardDeadline: boolean;
  /** Optional citation/source note so figures can be fact-checked pre-demo. */
  sourceNote?: string;
}

/** A requirement merged with its computed deadline for a specific user. */
export interface ChecklistEntry extends Requirement {
  deadlineDate: string; // ISO date
  daysRemaining: number; // can be negative if overdue
  completed: boolean;
}

/** Monthly cost-of-living figures for a destination, in local currency. */
export interface CostOfLiving {
  destCountry: DestCountry;
  currencyCode: string;
  monthlyHousing: number;
  monthlyFood: number;
  monthlyTransit: number;
  monthlyPhone: number;
  sourceNote?: string;
}

/** One-time/setup costs tied to a destination, in local currency unless noted. */
export interface OneTimeCosts {
  destCountry: DestCountry;
  visaFeeLocal: number;
  visaFeeCurrency: string;
  flightCostUsdLow: number;
  flightCostUsdHigh: number;
  insurancePremiumMonthlyLocal: number;
  insurancePremiumCurrency: string;
  sourceNote?: string;
}

export interface EmergencyInfo {
  destCountry: DestCountry;
  localEmergencyNumber: string;
  usEmbassyName: string;
  usEmbassyAddress: string;
  usEmbassyPhone: string;
  usEmbassyEmergencyPhone?: string;
  /** Approximate embassy location, geocoded from its street address (for the planner map pin). */
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface DestinationMeta {
  destCountry: DestCountry;
  slug: string;
  flagEmoji: string;
  capitalCity: string;
  lat: number;
  lng: number;
  blurb: string;
}

/**
 * A stylized, illustrative zone on a city's custom map — NOT a
 * geographically precise polygon. relativeX/relativeY are 0-100 percentages
 * against the map's SVG viewBox (same coordinate space as CityHotspot),
 * hand-authored to roughly match real relative position, not surveyed.
 */
export interface Neighborhood {
  id: string;
  destCountry: DestCountry;
  name: string;
  vibe: string;
  monthlyRentLocalLow: number;
  monthlyRentLocalHigh: number;
  currencyCode: string;
  relativeX: number;
  relativeY: number;
  /** Approximate real-world centroid; optional, only the 3D globe planner needs it. */
  lat?: number;
  lng?: number;
  sourceNote?: string;
}

export type CityHotspotType =
  | "banking"
  | "academic"
  | "health-insurance"
  | "housing"
  | "embassy";

/**
 * A clickable pin on a city's custom map. For every type except "embassy",
 * requirementIds points at real Requirement.id values from requirements.ts
 * for that destCountry — the popup renders those Requirements' real
 * title/description/leadTimeDays directly (no data forking). "embassy" has
 * no requirementIds; its popup reads EmergencyInfo instead. health-insurance
 * hotspots carry TWO ids (the health req + the insurance req) rendered as
 * two stacked sections in one popup.
 */
export interface CityHotspot {
  id: string;
  destCountry: DestCountry;
  type: CityHotspotType;
  label: string;
  relativeX: number;
  relativeY: number;
  requirementIds?: string[];
}

export type PriceRange = "$" | "$$" | "$$$";

export interface FoodSpot {
  id: string;
  destCountry: DestCountry;
  name: string;
  description: string;
  priceRange: PriceRange;
  cuisineNote?: string;
  lat: number;
  lng: number;
  sourceNote: string;
}

// ============================================================================
// Study Abroad Planning Guide types — general reference content (program
// types, process, costs, housing, major-to-destination fit) sourced from
// CMU's public study-abroad site plus external research. Deliberately
// separate from the DestCountry-scoped types above: this content spans many
// more countries than our 3 fully-supported destinations, so it lives on
// its own /guide page rather than being forced into the per-destination flow.
// ============================================================================

export interface ProgramType {
  id: string;
  name: string;
  description: string;
  costModel: string;
  sourceNote: string;
}

export interface PlanningStep {
  order: number;
  title: string;
  description: string;
}

export interface ProgramCostRange {
  programType: string; // matches ProgramType.id
  lowUsd: number;
  highUsd: number;
  perTerm: string;
  notes: string;
  sourceNote: string;
}

export interface HousingOption {
  id: string;
  name: string;
  costLevel: "low" | "medium" | "high" | "varies";
  immersionLevel: "low" | "medium" | "high";
  independenceLevel: "low" | "medium" | "high";
  description: string;
  sourceNote: string;
}

/**
 * supportedDestCountry is set only when one of `countries` matches one of
 * our 3 fully-supported destinations — that's how the guide links out to
 * the real /destinations/{slug} flow instead of just being static text.
 */
export interface MajorDestinationGuide {
  major: string;
  countries: string[];
  reason: string;
  supportedDestCountry?: DestCountry;
  sourceNote: string;
}

export interface ExchangePartner {
  country: string;
  university: string;
  city: string;
}

export interface GeneralLogisticsItem {
  title: string;
  description: string;
  sourceNote: string;
}

export interface PeerProfileInput {
  name: string;
  destinationCountry: DestCountry;
  university: string;
  programTerm: string;
}
