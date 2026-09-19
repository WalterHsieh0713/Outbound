import type { ProgramType } from "@/types";

// ============================================================================
// PROGRAM TYPES — sourced from Carnegie Mellon's public study-abroad site
// (cmu.edu/studyabroad/getting-started/opportunities/), fetched Sept 2026.
// ============================================================================

export const programTypes: ProgramType[] = [
  {
    id: "university-exchange",
    name: "University Exchange",
    description:
      "Direct enrollment at a partner institution abroad through a university-to-university exchange agreement.",
    costModel:
      "You keep paying your home school's tuition (and typically keep your financial aid) — you cover room, board, and travel separately.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/university-exchange.html",
  },
  {
    id: "departmental-exchange",
    name: "Departmental Exchange",
    description:
      "Discipline-specific exchange partnerships managed directly by an academic department rather than a central study-abroad office.",
    costModel: "Similar to university exchange — home tuition applies, terms set by the department.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/departmental-exchange.html",
  },
  {
    id: "sponsored",
    name: "Sponsored Programs",
    description:
      "Pre-arranged, third-party-run programs that your home university has already vetted for academic quality and student support.",
    costModel:
      "All-in program fee (tuition + housing + some support services bundled) rather than home tuition — see cost ranges below.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/sponsored-programs.html",
  },
  {
    id: "external",
    name: "External Programs",
    description:
      "Independent third-party study-abroad providers not pre-vetted by your school — you do your own due diligence on quality and credit transfer.",
    costModel: "Provider sets its own all-in fee; varies widely by provider and destination.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/external-programs.html",
  },
  {
    id: "work-research",
    name: "Work & Research Opportunities",
    description:
      "Summer internships, research placements, or departmental work placements abroad rather than a semester of coursework.",
    costModel: "Highly variable — some placements are funded/paid, others require self-funding travel and living costs.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/work.html",
  },
  {
    id: "short-term",
    name: "Short-Term & Volunteer",
    description:
      "Brief immersive programs, often over school breaks, emphasizing service and cultural engagement rather than a full term abroad.",
    costModel: "Usually a flat program fee for the trip length, much lower total cost than a full semester.",
    sourceNote: "cmu.edu/studyabroad/getting-started/opportunities/short-term.html",
  },
  {
    id: "direct-enroll",
    name: "Direct Enroll",
    description:
      "Enroll directly as a visiting student at a foreign university, bypassing both your home school's exchange system and a third-party provider.",
    costModel:
      "Generally the cheapest formal option since there's no provider markup — but least built-in support for housing/visa logistics, since you arrange more yourself.",
    sourceNote:
      "Not one of CMU's own named categories (their site groups this under exchange/external) — treated separately here because cost researchers consistently distinguish it. usnews.com/education/best-global-universities/articles/weigh-direct-enrollment-vs-affiliate-programs-for-study-abroad",
  },
];
