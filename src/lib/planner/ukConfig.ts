import { costOfLiving, oneTimeCosts } from "@/data/costOfLiving";
import { getDestinationMetaBySlug, originMeta } from "@/data/destinationMeta";
import { exchangePartners } from "@/data/exchangePartners";
import { convertToUsd } from "@/data/exchangeRates";
import { housingOptions } from "@/data/housingOptions";
import { majorDestinationGuides } from "@/data/majorDestinations";
import { neighborhoods } from "@/data/neighborhoods";
import { programCostRanges } from "@/data/programCosts";
import { programTypes } from "@/data/programTypes";
import { requirements } from "@/data/requirements";
import type { ProgramCostRange } from "@/types";
import type { PlannerConfig } from "./types";

const DEST = "United Kingdom" as const;

const MAJOR_ICONS: [string, string][] = [
  ["Engineering", "⚙️"],
  ["Computer", "💻"],
  ["Business", "💼"],
  ["International", "🌍"],
  ["Arts", "🎨"],
  ["Humanities", "📚"],
  ["Natural", "🔬"],
];

const PROGRAM_ICONS: Record<string, string> = {
  "university-exchange": "🤝",
  "departmental-exchange": "🏛️",
  sponsored: "🧳",
  external: "🧭",
  "work-research": "🛠️",
  "short-term": "⚡",
  "direct-enroll": "🎓",
};

const HOUSING_ICONS: Record<string, string> = {
  homestay: "🏡",
  dorm: "🛏️",
  "shared-apartment": "🧑‍🤝‍🧑",
  independent: "🔑",
};

function toUsd(local: number, currency: string): number {
  return Math.round(convertToUsd(local, currency));
}

function formatCostRange(range: ProgramCostRange | undefined): string {
  if (!range) return "Varies by provider";
  if (range.lowUsd === 0 && range.highUsd === 0) return "Varies by institution";
  if (range.lowUsd < 0) {
    const fmt = (n: number) => `${n < 0 ? "-" : "+"}$${Math.abs(n).toLocaleString()}`;
    return `${fmt(range.lowUsd)} to ${fmt(range.highUsd)} vs. a semester at home`;
  }
  return `$${range.lowUsd.toLocaleString()}–$${range.highUsd.toLocaleString()} ${range.perTerm}`;
}

export function buildUkPlannerConfig(): PlannerConfig {
  const meta = getDestinationMetaBySlug("uk");
  const living = costOfLiving.find((c) => c.destCountry === DEST);
  const setup = oneTimeCosts.find((c) => c.destCountry === DEST);
  if (!meta || !living || !setup) {
    throw new Error("UK destination data is missing");
  }

  const hasUkExchange = exchangePartners.some((p) => p.country === DEST);
  const visa = requirements.find((r) => r.destCountry === DEST && r.category === "visa");

  return {
    slug: meta.slug,
    destCountry: DEST,
    flagEmoji: meta.flagEmoji,
    city: meta.capitalCity,
    cityLat: meta.lat,
    cityLng: meta.lng,
    origin: { label: `${originMeta.flagEmoji} ${originMeta.capitalCity}`, lat: originMeta.lat, lng: originMeta.lng },
    blurb: meta.blurb,
    currencySymbol: "£",

    majors: majorDestinationGuides.map((g) => {
      const strong = g.countries.includes(DEST);
      return {
        id: g.major,
        label: g.major,
        icon: MAJOR_ICONS.find(([k]) => g.major.startsWith(k))?.[1] ?? "🎓",
        fit: strong ? "strong" : "possible",
        note: strong
          ? g.reason
          : `The UK isn't one of our researched top picks for this major (${g.countries.join(", ")} are). It's still doable — you'd just be choosing on other grounds.`,
      };
    }),

    programs: programTypes.map((p) => {
      const isCmuExchange = p.id === "university-exchange";
      const available = !(isCmuExchange && !hasUkExchange);
      return {
        id: p.id,
        name: p.name,
        icon: PROGRAM_ICONS[p.id] ?? "🎓",
        description: p.description,
        costModel: p.costModel,
        costRange: formatCostRange(programCostRanges.find((r) => r.programType === p.id)),
        bundlesHousing: p.id === "sponsored" || p.id === "external",
        available,
        caveat: !available
          ? "CMU's published exchange-partner list has no UK university, so this route isn't available for the UK."
          : p.id === "departmental-exchange"
            ? "Partners are set by each department — check with yours whether it has a UK partner."
            : undefined,
      };
    }),

    locations: neighborhoods
      .filter((n) => n.destCountry === DEST && n.lat !== undefined && n.lng !== undefined)
      .map((n) => ({
        id: n.id,
        name: n.name,
        vibe: n.vibe,
        lat: n.lat as number,
        lng: n.lng as number,
        rentLowLocal: n.monthlyRentLocalLow,
        rentHighLocal: n.monthlyRentLocalHigh,
        rentLowUsd: toUsd(n.monthlyRentLocalLow, n.currencyCode),
        rentHighUsd: toUsd(n.monthlyRentLocalHigh, n.currencyCode),
      })),

    living: housingOptions.map((h) => ({
      id: h.id,
      name: h.name,
      icon: HOUSING_ICONS[h.id] ?? "🏠",
      description: h.description,
      costLevel: h.costLevel,
      immersionLevel: h.immersionLevel,
      independenceLevel: h.independenceLevel,
      usesLocationRent: h.id === "shared-apartment" || h.id === "independent",
    })),

    monthlyUsd: {
      food: toUsd(living.monthlyFood, living.currencyCode),
      transit: toUsd(living.monthlyTransit, living.currencyCode),
      phone: toUsd(living.monthlyPhone, living.currencyCode),
      insurance: toUsd(setup.insurancePremiumMonthlyLocal, setup.insurancePremiumCurrency),
    },
    oneTimeUsd: {
      visa: toUsd(setup.visaFeeLocal, setup.visaFeeCurrency),
      flightLow: setup.flightCostUsdLow,
      flightHigh: setup.flightCostUsdHigh,
    },

    visaTip: visa
      ? { title: visa.title, description: visa.description, leadTimeDays: visa.leadTimeDays }
      : null,
    checklistHref: `/checklist?dest=${encodeURIComponent(DEST)}`,
  };
}
