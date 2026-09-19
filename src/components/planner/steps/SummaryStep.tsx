"use client";

import Link from "next/link";
import { useState } from "react";
import { computeBudget } from "@/lib/planner/budget";
import { range, usd } from "@/lib/planner/format";
import type { Choices, PlannerConfig } from "@/lib/planner/types";
import { useAnimatedNumber } from "../useAnimatedNumber";

const SEMESTER_MONTHS = 4;

export function SummaryStep({
  config,
  choices,
  rentPos,
  onRentPos,
  onEdit,
  onReset,
}: {
  config: PlannerConfig;
  choices: Choices;
  rentPos: number;
  onRentPos: (t: number) => void;
  onEdit: (step: number) => void;
  onReset: () => void;
}) {
  const major = config.majors.find((m) => m.id === choices.major);
  const program = config.programs.find((p) => p.id === choices.program);
  const budget = computeBudget(config, choices, rentPos);
  const { location, living, lines, monthlyTotal, rentUsd } = budget;

  const [limit, setLimit] = useState(() => Math.max(500, Math.ceil(monthlyTotal / 100) * 100));
  const animatedTotal = useAnimatedNumber(monthlyTotal);

  if (!major || !program || !location || !living) return null;

  const diff = limit - monthlyTotal;
  const canSlideRent = rentUsd !== null && location.rentHighUsd > location.rentLowUsd;

  const recap = [
    { label: "Major", step: 0, icon: major.icon, value: major.label },
    { label: "Program", step: 1, icon: program.icon, value: program.name },
    { label: "Location", step: 2, icon: "📍", value: `${location.name}, ${config.city}` },
    { label: "Living", step: 3, icon: living.icon, value: living.name },
  ];

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {recap.map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => onEdit(r.step)}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              {r.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">{r.label}</span>
              <span className="block truncate text-sm font-semibold text-slate-900">{r.value}</span>
            </span>
            <span className="text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
              Change
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-600">{major.note}</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Monthly living costs</h3>
          <span className="text-2xl font-extrabold text-slate-900">{usd(animatedTotal)}</span>
        </div>

        <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label="Monthly cost breakdown">
          {lines.map((l) => (
            <div
              key={l.key}
              title={`${l.label}: ${usd(l.usd)}`}
              className="h-full transition-[width] duration-500"
              style={{ width: `${(l.usd / monthlyTotal) * 100}%`, backgroundColor: l.color }}
            />
          ))}
        </div>
        <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} aria-hidden />
                {l.label}
              </span>
              <span className="font-medium text-slate-900">{usd(l.usd)}</span>
            </li>
          ))}
        </ul>
        {budget.housingBilledByProgram && (
          <p className="mt-2 text-xs text-slate-500">
            {living.name} housing is billed by your program or university, so rent isn&apos;t included here.
          </p>
        )}

        {canSlideRent && rentUsd !== null && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-baseline justify-between">
              <label htmlFor="rent-pos" className="text-sm font-semibold text-slate-800">
                Rent in {location.name}
              </label>
              <span className="text-sm font-bold text-indigo-600">{usd(rentUsd)}/mo</span>
            </div>
            <input
              id="rent-pos"
              type="range"
              min={location.rentLowUsd}
              max={location.rentHighUsd}
              step={1}
              value={rentUsd}
              onChange={(e) =>
                onRentPos((Number(e.target.value) - location.rentLowUsd) / (location.rentHighUsd - location.rentLowUsd))
              }
              className="mt-1 w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Cheaper room · {usd(location.rentLowUsd)}</span>
              <span>Nicer room · {usd(location.rentHighUsd)}</span>
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="limit" className="text-sm font-semibold text-slate-800">
              My monthly budget
            </label>
            <span className="text-sm font-bold text-slate-900">{usd(limit)}</span>
          </div>
          <input
            id="limit"
            type="range"
            min={500}
            max={4000}
            step={50}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 w-full accent-indigo-600"
          />
          <p
            className={`mt-1 text-sm font-semibold ${diff >= 0 ? "text-emerald-600" : "text-red-600"}`}
            aria-live="polite"
          >
            {diff >= 0
              ? `You'd have ${usd(diff)} to spare each month.`
              : `You'd be ${usd(-diff)} short each month.`}
          </p>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          About {usd(monthlyTotal * SEMESTER_MONTHS)} over a {SEMESTER_MONTHS}-month term (assumed length).
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">One-time costs</h3>
        <ul className="mt-2 divide-y divide-slate-100 text-sm">
          <li className="flex justify-between gap-4 py-2">
            <span className="text-slate-600">Student visa fee</span>
            <span className="font-medium text-slate-900">{usd(config.oneTimeUsd.visa)}</span>
          </li>
          <li className="flex justify-between gap-4 py-2">
            <span className="text-slate-600">Round-trip flight</span>
            <span className="font-medium text-slate-900">
              {range(config.oneTimeUsd.flightLow, config.oneTimeUsd.flightHigh)}
            </span>
          </li>
          <li className="flex justify-between gap-4 py-2">
            <span className="text-slate-600">Program cost ({program.name})</span>
            <span className="text-right font-medium text-slate-900">{program.costRange}</span>
          </li>
        </ul>
        {program.bundlesHousing && living.usesLocationRent && (
          <p className="mt-2 text-xs font-medium text-amber-700">
            This all-in program fee usually already includes housing, so treat the rent above as what you&apos;d pay on
            your own rather than on top.
          </p>
        )}
      </section>

      {config.visaTip && (
        <section className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-700">
            Start here: {config.visaTip.title}
          </h3>
          <p className="mt-1 text-sm text-slate-700">{config.visaTip.description}</p>
          <p className="mt-2 text-xs font-semibold text-indigo-600">
            Plan to start ~{config.visaTip.leadTimeDays} days before departure
          </p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={config.checklistHref}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Build my full {config.destCountry} checklist →
        </Link>
        <button type="button" onClick={onReset} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
          Start over
        </button>
      </div>
    </div>
  );
}
