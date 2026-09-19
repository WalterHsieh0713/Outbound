import type { Choices, PlannerConfig } from "./types";

export interface BudgetLine {
  key: "rent" | "food" | "transit" | "phone" | "surcharge";
  label: string;
  usd: number;
  color: string;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Monthly estimate for the choices made so far. `rentPos` (0..1) picks a point
 * between the chosen location's low and high rent. Rent counts once a location
 * is picked, unless the chosen housing is billed by the program instead.
 */
export function computeBudget(config: PlannerConfig, choices: Choices, rentPos: number) {
  const location = config.locations.find((l) => l.id === choices.location);
  const living = config.living.find((l) => l.id === choices.living);
  const includeRent = !!location && (!living || living.usesLocationRent);
  const rentUsd =
    includeRent && location ? Math.round(lerp(location.rentLowUsd, location.rentHighUsd, rentPos)) : null;

  const lines: BudgetLine[] = [];
  if (rentUsd !== null) {
    lines.push({ key: "rent", label: `Rent (${location?.name})`, usd: rentUsd, color: "#6366f1" });
  }
  lines.push(
    { key: "food", label: "Food", usd: config.monthlyUsd.food, color: "#f59e0b" },
    { key: "transit", label: "Transit", usd: config.monthlyUsd.transit, color: "#10b981" },
    { key: "phone", label: "Phone", usd: config.monthlyUsd.phone, color: "#06b6d4" },
    { key: "surcharge", label: "Health surcharge", usd: config.monthlyUsd.insurance, color: "#ec4899" }
  );

  return {
    location,
    living,
    lines,
    rentUsd,
    monthlyTotal: lines.reduce((sum, l) => sum + l.usd, 0),
    housingBilledByProgram: !!living && !living.usesLocationRent,
  };
}

export type Affordability = "ok" | "stretch" | "over";

export const AFFORDABILITY_COLOR: Record<Affordability, string> = {
  ok: "#22c55e",
  stretch: "#eab308",
  over: "#ef4444",
};

/** Same thresholds as the existing CityMap: comfortably under, within range, or above the rent range. */
export function affordability(
  location: { rentLowUsd: number; rentHighUsd: number },
  budgetUsd: number
): Affordability {
  if (budgetUsd >= location.rentHighUsd) return "ok";
  if (budgetUsd >= location.rentLowUsd) return "stretch";
  return "over";
}
