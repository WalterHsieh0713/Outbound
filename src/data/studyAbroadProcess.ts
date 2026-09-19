import type { PlanningStep } from "@/types";

// ============================================================================
// GENERAL PLANNING PROCESS — sourced directly from Carnegie Mellon's public
// study-abroad site (cmu.edu/studyabroad/getting-started/opportunities/),
// fetched Sept 2026. This is the general 6-step process CMU tells its own
// students to follow — genuinely CMU's guidance, not paraphrased/invented.
// ============================================================================

export const planningSteps: PlanningStep[] = [
  {
    order: 1,
    title: "Explore your options",
    description:
      "Browse available programs aligned with your interests — region, field of study, volunteer opportunities, or timing.",
  },
  {
    order: 2,
    title: "Review program types",
    description:
      "Compare exchange, departmental exchange, sponsored, external, and short-term programs to find the best structural fit for your goals and budget.",
  },
  {
    order: 3,
    title: "Contact your study abroad office",
    description:
      "Reach out with questions before committing — advisors can flag major-specific fit and deadline conflicts early.",
  },
  {
    order: 4,
    title: "Use the key resources",
    description:
      "Work through your school's study-abroad portal, check the academic calendar for the host institution, and review transfer-credit guidelines before applying.",
  },
  {
    order: 5,
    title: "Prepare",
    description:
      "Handle health, insurance, and travel prep (see the pre-departure checklist below) well ahead of departure.",
  },
  {
    order: 6,
    title: "Apply",
    description:
      "Submit by departmental deadlines. CMU's own advice: most programs expect you to apply a semester or year in advance of actually studying abroad.",
  },
];
