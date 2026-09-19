"use client";

import { computeBudget } from "@/lib/planner/budget";
import { usd } from "@/lib/planner/format";
import type { Choices, PlannerConfig, StepKey } from "@/lib/planner/types";
import { useAnimatedNumber } from "./useAnimatedNumber";

const SLOTS: { key: StepKey; label: string; empty: string }[] = [
  { key: "major", label: "Major", empty: "Not chosen" },
  { key: "program", label: "Program", empty: "Not chosen" },
  { key: "location", label: "Location", empty: "Not chosen" },
  { key: "living", label: "Living", empty: "Not chosen" },
];

export function TripCard({
  config,
  choices,
  rentPos,
  onJump,
}: {
  config: PlannerConfig;
  choices: Choices;
  rentPos: number;
  onJump: (step: number) => void;
}) {
  const major = config.majors.find((m) => m.id === choices.major);
  const program = config.programs.find((p) => p.id === choices.program);
  const budget = computeBudget(config, choices, rentPos);
  const filled = SLOTS.filter((s) => choices[s.key]).length;
  const animated = useAnimatedNumber(budget.monthlyTotal);

  const display: Record<StepKey, { icon: string; text: string } | undefined> = {
    major: major && { icon: major.icon, text: major.label },
    program: program && { icon: program.icon, text: program.name },
    location: budget.location && { icon: "📍", text: `${budget.location.name}, ${config.city}` },
    living: budget.living && { icon: budget.living.icon, text: budget.living.name },
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {config.flagEmoji}
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Your trip</p>
          <p className="font-bold leading-tight text-slate-900">{config.destCountry}</p>
        </div>
        <span className="ml-auto text-xs font-semibold text-indigo-600">{filled}/4</span>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
        {SLOTS.map((s, i) => {
          const d = display[s.key];
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => onJump(i)}
                className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition ${
                  d
                    ? "border-indigo-200 bg-indigo-50 hover:border-indigo-400"
                    : "border-dashed border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                <span aria-hidden>{d?.icon ?? "○"}</span>
                <span key={d?.text ?? "empty"} className={`min-w-0 truncate font-semibold ${d ? "pop-in text-slate-900" : ""}`}>
                  {d?.text ?? s.empty}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Monthly estimate</p>
        <p className="text-2xl font-extrabold text-slate-900">
          {usd(animated)}
          <span className="text-sm font-semibold text-slate-400">/mo</span>
        </p>
        <p className="text-[11px] text-slate-400">
          {budget.rentUsd === null
            ? budget.housingBilledByProgram
              ? "Housing billed by your program"
              : "Pick a location to add rent"
            : "Includes rent, food, transit, phone, health surcharge"}
        </p>
      </div>
    </aside>
  );
}
