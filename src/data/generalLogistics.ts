import type { GeneralLogisticsItem } from "@/types";

// ============================================================================
// GENERAL PRE-DEPARTURE LOGISTICS — sourced directly from Carnegie Mellon's
// public health & safety page (cmu.edu/studyabroad/before-you-go/health/),
// fetched Sept 2026. Deliberately separate from requirements.ts: these are
// universal awareness items with no destination-specific deadline, unlike
// the deadline-driven per-country Requirement entries.
// ============================================================================

export const generalLogisticsItems: GeneralLogisticsItem[] = [
  {
    title: "Confirm full medical insurance coverage abroad",
    description:
      "You're responsible for the entire cost of non-routine medical care, hospitalization, dental, and eye care while abroad unless your policy explicitly covers it — verify before you go, not after something happens.",
    sourceNote: "cmu.edu/studyabroad/before-you-go/health/index.html",
  },
  {
    title: "Check vaccination requirements for your specific destination",
    description:
      "Tetanus, Hepatitis A, and Hepatitis B are recommended for any foreign travel. Western Europe currently has no required immunizations; Eastern Europe, Central/South America, Africa, Asia, and Oceania may require destination-specific ones — verify directly with the host country's embassy before departure.",
    sourceNote: "cmu.edu/studyabroad/before-you-go/health/index.html",
  },
  {
    title: "Sort out prescriptions before you leave",
    description:
      "US prescriptions can't be filled abroad. Bring enough medication for your entire stay, confirm the medication is actually legal in your host country (some common US medications are restricted or banned elsewhere), and carry a physician's letter listing generic/brand names, dosages, and conditions.",
    sourceNote: "cmu.edu/studyabroad/before-you-go/health/index.html",
  },
  {
    title: "Get a routine medical and dental checkup first",
    description:
      "Handle routine care at home before departure, and pack a basic first-aid kit plus your medical records (medications, conditions, allergies, immunization history, blood type, primary care contact).",
    sourceNote: "cmu.edu/studyabroad/before-you-go/health/index.html",
  },
];
