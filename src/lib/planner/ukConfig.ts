import { cityHotspots } from "@/data/cityHotspots";
import { costOfLiving, oneTimeCosts } from "@/data/costOfLiving";
import { getDestinationMetaBySlug, originMeta } from "@/data/destinationMeta";
import { emergencyInfo } from "@/data/emergencyInfo";
import { exchangePartners } from "@/data/exchangePartners";
import { convertToUsd } from "@/data/exchangeRates";
import { foodSpots } from "@/data/foodSpots";
import { housingOptions } from "@/data/housingOptions";
import { majorDestinationGuides } from "@/data/majorDestinations";
import { neighborhoods } from "@/data/neighborhoods";
import { programCostRanges } from "@/data/programCosts";
import { programTypes } from "@/data/programTypes";
import { requirements } from "@/data/requirements";
import type { ProgramCostRange } from "@/types";
import type { PlannerConfig, PlannerEssential, PlannerPoi } from "./types";

const DEST = "United Kingdom" as const;

function toUsd(local: number, currency: string): number {
  return Math.round(convertToUsd(local, currency));
}

function formatCost(range: ProgramCostRange | undefined): { headline: string; caption: string; full: string } {
  if (!range) return { headline: "Varies", caption: "by provider", full: "Varies by provider" };
  if (range.lowUsd === 0 && range.highUsd === 0) {
    return { headline: "Varies", caption: "by host institution", full: "Varies by institution" };
  }
  if (range.lowUsd < 0) {
    const fmt = (n: number) => `${n < 0 ? "−" : "+"}$${Math.abs(n).toLocaleString()}`;
    return {
      headline: `${fmt(range.lowUsd)} to ${fmt(range.highUsd)}`,
      caption: "vs. a semester at home",
      full: `${fmt(range.lowUsd)} to ${fmt(range.highUsd)} vs. a semester at home`,
    };
  }
  const headline = `$${range.lowUsd.toLocaleString()}–$${range.highUsd.toLocaleString()}`;
  return { headline, caption: range.perTerm, full: `${headline} ${range.perTerm}` };
}

function timing(leadTimeDays: number): string {
  return leadTimeDays >= 0
    ? `Start ~${leadTimeDays} days before departure`
    : `Usually done ~${-leadTimeDays} days after arrival`;
}

export function buildUkPlannerConfig(): PlannerConfig {
  const meta = getDestinationMetaBySlug("uk");
  const living = costOfLiving.find((c) => c.destCountry === DEST);
  const setup = oneTimeCosts.find((c) => c.destCountry === DEST);
  const embassy = emergencyInfo.find((e) => e.destCountry === DEST);
  if (!meta || !living || !setup) {
    throw new Error("UK destination data is missing");
  }

  const hasUkExchange = exchangePartners.some((p) => p.country === DEST);
  const visa = requirements.find((r) => r.destCountry === DEST && r.category === "visa");

  const pois: PlannerPoi[] = foodSpots
    .filter((f) => f.destCountry === DEST)
    .map((f) => ({
      id: f.id,
      kind: "food" as const,
      name: f.name,
      lat: f.lat,
      lng: f.lng,
      blurb: f.description,
      tags: f.cuisineNote ? [f.cuisineNote] : [],
      lines: [],
      priceRange: f.priceRange,
    }));
  if (embassy?.lat !== undefined && embassy.lng !== undefined) {
    pois.push({
      id: "uk-embassy",
      kind: "embassy",
      name: embassy.usEmbassyName,
      lat: embassy.lat,
      lng: embassy.lng,
      blurb: embassy.usEmbassyAddress,
      tags: ["Emergency"],
      lines: [
        `Phone: ${embassy.usEmbassyPhone}`,
        `Local emergency: ${embassy.localEmergencyNumber}`,
        ...(embassy.notes ? [embassy.notes] : []),
      ],
    });
  }

  const essentials: PlannerEssential[] = cityHotspots
    .filter((h) => h.destCountry === DEST && h.type !== "embassy")
    .map((h) => ({
      id: h.id,
      label: h.label,
      items: (h.requirementIds ?? []).flatMap((id) => {
        const r = requirements.find((req) => req.id === id);
        return r ? [{ title: r.title, description: r.description, timing: timing(r.leadTimeDays) }] : [];
      }),
    }))
    .filter((e) => e.items.length > 0);

  return {
    slug: meta.slug,
    destCountry: DEST,
    flagEmoji: meta.flagEmoji,
    city: meta.capitalCity,
    cityLat: meta.lat,
    cityLng: meta.lng,
    origin: {
      label: `${originMeta.flagEmoji} ${originMeta.capitalCity}`,
      lat: originMeta.lat,
      lng: originMeta.lng,
    },
    blurb: meta.blurb,
    currencySymbol: "£",

    majors: majorDestinationGuides.map((g) => {
      const strong = g.countries.includes(DEST);
      return {
        id: g.major,
        label: g.major,
        fit: strong ? "strong" : "possible",
        topCountries: g.countries,
        note: strong
          ? g.reason
          : `The UK isn't one of our researched top picks for this major. It's still doable — you'd just be choosing on other grounds.`,
      };
    }),

    programs: programTypes.map((p) => {
      const isCmuExchange = p.id === "university-exchange";
      const available = !(isCmuExchange && !hasUkExchange);
      const cost = formatCost(programCostRanges.find((r) => r.programType === p.id));
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        costModel: p.costModel,
        costRange: cost.full,
        costHeadline: cost.headline,
        costCaption: cost.caption,
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
      description: h.description,
      costLevel: h.costLevel,
      immersionLevel: h.immersionLevel,
      independenceLevel: h.independenceLevel,
      usesLocationRent: h.id === "shared-apartment" || h.id === "independent",
    })),

    pois,
    essentials,

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
