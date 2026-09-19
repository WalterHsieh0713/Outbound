import { PlannerWizard } from "@/components/planner/PlannerWizard";
import { buildUkPlannerConfig } from "@/lib/planner/ukConfig";

export default function UkPlanPage() {
  return <PlannerWizard config={buildUkPlannerConfig()} />;
}
