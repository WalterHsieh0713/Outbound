import type { ProgramCostRange } from "@/types";

// ============================================================================
// PROGRAM COST RANGES — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO.
// These are per-program-type cost bands, distinct from the per-destination
// monthly cost-of-living figures in costOfLiving.ts. programType values
// match programTypes.ts ids.
// ============================================================================

export const programCostRanges: ProgramCostRange[] = [
  {
    programType: "university-exchange",
    lowUsd: -3000,
    highUsd: 3000,
    perTerm: "relative to a normal semester at home",
    notes:
      "You pay home tuition either way — this range is the extra swing from living-cost differences abroad, not counting flights ($800–$2,000+ round-trip depending on origin/season). Western Europe and Australia trend toward the higher end; Asia and Latin America trend cheaper.",
    sourceNote:
      "washington.edu/studyabroad/students/new-to-study-abroad/what-it-costs-2/; gooverseas.com/blog/cost-to-study-abroad",
  },
  {
    programType: "sponsored",
    lowUsd: 12350,
    highUsd: 20950,
    perTerm: "per semester, all-in",
    notes:
      "Provider-run programs bundle tuition, housing, and some support services into one fee. CIEE averages ~$19,850 overall (Latin America ~$17,950, Europe ~$20,950); ISA's cheaper sites (e.g. Morocco) run ~$12,350.",
    sourceNote:
      "ciee.org/go-abroad/college-study-abroad/blog/how-much-does-it-cost-study-abroad-2026; iesabroad.org (Sydney semester ~$18,900)",
  },
  {
    programType: "external",
    lowUsd: 3650,
    highUsd: 19968,
    perTerm: "per experience (varies hugely by provider/length)",
    notes:
      "Widest range of any program type since providers set fees independently — always compare a specific provider's fee sheet rather than relying on an average.",
    sourceNote: "nasdaq.com/articles/how-much-does-studying-abroad-cost (CIEE-cited roundup)",
  },
  {
    programType: "direct-enroll",
    lowUsd: 0,
    highUsd: 0,
    perTerm: "generally the cheapest formal route",
    notes:
      "Enrolling directly as a visiting student cuts out the provider markup entirely, but comes with the least built-in support for housing/visa logistics — you arrange more yourself. No single reliable dollar figure exists since it's just the host university's own visiting-student tuition, which varies per institution.",
    sourceNote: "usnews.com/education/best-global-universities/articles/weigh-direct-enrollment-vs-affiliate-programs-for-study-abroad",
  },
];
