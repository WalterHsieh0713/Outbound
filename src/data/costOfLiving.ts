import type { CostOfLiving, OneTimeCosts } from "@/types";

// ============================================================================
// BUDGET SEED DATA — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO
// ============================================================================
// Monthly recurring costs are in LOCAL currency (converted to USD at display
// time via exchangeRates.ts). Figures are midpoints of researched ranges for
// a typical student in the primary city (London / Tokyo / Berlin) — actual
// spend varies a lot by neighborhood and lifestyle, which is why each entry
// keeps its source range in `sourceNote` for a sanity check before demoing.
// ============================================================================

export const costOfLiving: CostOfLiving[] = [
  {
    destCountry: "United Kingdom",
    currencyCode: "GBP",
    monthlyHousing: 793,
    monthlyFood: 250,
    monthlyTransit: 190,
    monthlyPhone: 15,
    sourceNote:
      "Housing: UniAcco avg £793/mo student housing. Food: Optivest £150-350/mo range, midpoint used. Transit: Zone 1-2 Oyster ~£44.70/week ≈ £180-195/mo. Phone: Uswitch SIM-only £8-28/mo range.",
  },
  {
    destCountry: "Japan",
    currencyCode: "JPY",
    monthlyHousing: 80000,
    monthlyFood: 40000,
    monthlyTransit: 14000,
    monthlyPhone: 3000,
    sourceNote:
      "Housing: ¥60k-100k outer wards (up to ¥140k+ central) per resident.com/numbeo, midpoint of outer-ward range used. Food/transit/phone: resident.com 2026 Japan cost guide ranges, midpoints used.",
  },
  {
    destCountry: "Germany",
    currencyCode: "EUR",
    monthlyHousing: 600,
    monthlyFood: 250,
    monthlyTransit: 49,
    monthlyPhone: 15,
    sourceNote:
      "Housing: uniplaces.com Berlin 2026 guide, €450-750 WG room range (up to €800 central), midpoint used. Transit: nationwide Deutschlandticket flat rate ~€49/mo. Phone: how-to-germany.com SIM-only ~€10-20/mo.",
  },
];

// One-time / setup costs tied to a destination. Flight cost is expressed
// directly in USD (round-trip, economy, booked a few months out) since that's
// how a US-based student will be thinking about it; everything else is in
// local currency to match how the fee is actually charged.
//
// insurancePremiumMonthlyLocal note: for the UK, the Immigration Health
// Surcharge (IHS) is actually paid as a single annual lump sum (not a
// monthly bill) — it's expressed here as a monthly-equivalent purely so the
// budget calculator can add it into a running monthly total consistently
// with Japan/Germany's genuinely monthly premiums.
export const oneTimeCosts: OneTimeCosts[] = [
  {
    destCountry: "United Kingdom",
    visaFeeLocal: 558,
    visaFeeCurrency: "GBP",
    flightCostUsdLow: 500,
    flightCostUsdHigh: 900,
    insurancePremiumMonthlyLocal: 65, // £776/year IHS ÷ 12, paid upfront as a lump sum
    insurancePremiumCurrency: "GBP",
    sourceNote:
      "Visa fee: gov.uk/student-visa/how-to-apply, £558 from outside UK. IHS: gov.uk/immigration-health-surcharge, £776/year. Flight: Kayak US-London route range.",
  },
  {
    destCountry: "Japan",
    visaFeeLocal: 15000,
    visaFeeCurrency: "JPY",
    flightCostUsdLow: 650,
    flightCostUsdHigh: 1100,
    insurancePremiumMonthlyLocal: 2000,
    insurancePremiumCurrency: "JPY",
    sourceNote:
      "Visa fee: fragomen.com reports a 400% fee increase effective July 1 2026 (¥3,000→¥15,000 single-entry) — VERIFY this is still current before demo, it's a very recent change. Flight: momondo.com US-Tokyo average ~$937. NHI premium: koukyuu.com ¥1,500-2,500/mo range, midpoint used.",
  },
  {
    destCountry: "Germany",
    visaFeeLocal: 75,
    visaFeeCurrency: "EUR",
    flightCostUsdLow: 600,
    flightCostUsdHigh: 1200,
    insurancePremiumMonthlyLocal: 135,
    insurancePremiumCurrency: "EUR",
    sourceNote:
      "Visa fee: how-to-germany.com/visa/administration/fees, €75 national visa fee (most US students actually skip this route and use the post-arrival residence-permit path instead — see the visa requirement item; a separate residence-permit application fee likely applies there and wasn't found/verified). Flight range is an estimate, not freshly re-verified against a live fare search. Insurance: DAAD/cbs.de €120-150/mo range, midpoint used.",
  },
];
