import type { HousingOption } from "@/types";

// ============================================================================
// HOUSING OPTIONS — researched Sept 2026, sourced from Go Overseas, Columbia
// Undergraduate Global Engagement, and IFSA housing guides.
// ============================================================================

export const housingOptions: HousingOption[] = [
  {
    id: "homestay",
    name: "Homestay",
    costLevel: "low",
    immersionLevel: "high",
    independenceLevel: "low",
    description:
      "Usually the cheapest option and often all-inclusive (meals, laundry, cleaning bundled in). Highest cultural/language immersion since you get daily exposure to a host family, but the least independence — you follow house rules.",
    sourceNote: "gooverseas.com/blog/the-full-scoop-on-study-abroad-housing-options",
  },
  {
    id: "dorm",
    name: "Dorm / Residence Hall",
    costLevel: "medium",
    immersionLevel: "medium",
    independenceLevel: "medium",
    description:
      "Common at direct-enroll programs and university partners. Puts you near local students, though international dorms often cluster exchange students together, moderating immersion.",
    sourceNote: "global.undergrad.columbia.edu/content/evaluating-study-abroad-housing-options-homestay-vs-shared-apartment-vs-student-dorms",
  },
  {
    id: "shared-apartment",
    name: "Shared Apartment",
    costLevel: "medium",
    immersionLevel: "medium",
    independenceLevel: "high",
    description:
      "Full autonomy over cooking/schedule, common in Europe and Latin America direct-enroll setups. Immersion depends heavily on whether your roommates are local — easy to end up in an English-speaking bubble otherwise.",
    sourceNote: "ifsa-butler.org/guide/study-abroad-housing/",
  },
  {
    id: "independent",
    name: "Independent Housing",
    costLevel: "varies",
    immersionLevel: "medium",
    independenceLevel: "high",
    description:
      "The least structured option — market-rate housing you find and arrange yourself. Highest independence, but also the most self-arranged logistics (no provider or university support built in).",
    sourceNote: "goabroad.com/articles/study-abroad/international-student-housing-abroad",
  },
];
