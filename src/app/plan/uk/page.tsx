import Link from "next/link";
import { PlannerWizard } from "@/components/planner/PlannerWizard";
import { buildUkPlannerConfig } from "@/lib/planner/ukConfig";

export default function UkPlanPage() {
  const config = buildUkPlannerConfig();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        ← Back to globe
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Plan your {config.destCountry} semester {config.flagEmoji}
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">{config.blurb}</p>
      </header>

      <div className="mt-8">
        <PlannerWizard config={config} />
      </div>
    </main>
  );
}
