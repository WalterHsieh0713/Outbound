"use client";

import Link from "next/link";
import { useState } from "react";
import { computeBudget } from "@/lib/planner/budget";
import { range, usd } from "@/lib/planner/format";
import type { Choices, PlannerConfig } from "@/lib/planner/types";
import { useAnimatedNumber } from "../useAnimatedNumber";
import { ACCENT, StepHeading } from "../ui";

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
    {
      label: "Field",
      step: 0,
      value: major.label,
      sub: major.fit === "strong" ? `Strong fit for the ${config.destCountry}` : "Possible fit",
    },
    { label: "Program", step: 1, value: program.name, sub: program.costRange },
    {
      label: "Neighborhood",
      step: 2,
      value: `${location.name}, ${config.city}`,
      sub: `${range(location.rentLowUsd, location.rentHighUsd)}/mo rent range`,
    },
    {
      label: "Housing",
      step: 3,
      value: living.name,
      sub: living.usesLocationRent ? "Rent estimated from your neighborhood" : "Billed by your program or university",
    },
  ];

  return (
    <div>
      <StepHeading
        eyebrow="Review"
        title={`Your semester in ${config.city}.`}
        sub="Everything you chose, and what it adds up to. Tap any row to change it."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="glass-strong rise divide-y divide-white/10 overflow-hidden rounded-[28px]" style={{ "--i": 3 } as React.CSSProperties}>
          {recap.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onEdit(r.step)}
              className="group flex w-full items-center justify-between gap-4 px-7 py-5 text-left transition hover:bg-white/5"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/40">{r.label}</span>
                <span className="mt-0.5 block truncate text-2xl font-semibold tracking-tight text-white">{r.value}</span>
                <span className="block truncate text-sm text-[#a1a1a6]">{r.sub}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold opacity-0 transition group-hover:opacity-100" style={{ color: ACCENT }}>
                Edit
              </span>
            </button>
          ))}
        </div>

        <p className="rise mt-5 px-2 text-center text-[15px] leading-relaxed text-[#a1a1a6]" style={{ "--i": 4 } as React.CSSProperties}>
          {major.note}
        </p>

        <section className="glass rise mt-8 rounded-[28px] p-7" style={{ "--i": 5 } as React.CSSProperties}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Monthly living costs</h2>
            <span className="text-5xl font-semibold tracking-tight text-white">
              {usd(animatedTotal)}
              <span className="text-lg font-medium text-white/40">/mo</span>
            </span>
          </div>

          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label="Monthly cost breakdown">
            {lines.map((l) => (
              <div
                key={l.key}
                title={`${l.label}: ${usd(l.usd)}`}
                className="h-full transition-[width] duration-500"
                style={{ width: `${(l.usd / monthlyTotal) * 100}%`, backgroundColor: l.color }}
              />
            ))}
          </div>
          <ul className="mt-4 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[#a1a1a6]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} aria-hidden />
                  {l.label}
                </span>
                <span className="font-medium text-white">{usd(l.usd)}</span>
              </li>
            ))}
          </ul>
          {budget.housingBilledByProgram && (
            <p className="mt-3 text-xs text-white/50">
              {living.name} housing is billed by your program or university, so rent isn&apos;t included here.
            </p>
          )}

          {canSlideRent && rentUsd !== null && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="rent-pos" className="font-semibold text-white">
                  Rent in {location.name}
                </label>
                <span className="text-sm font-semibold" style={{ color: ACCENT }}>
                  {usd(rentUsd)}/mo
                </span>
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
                className="mt-2 w-full accent-[#2997ff]"
              />
              <div className="flex justify-between text-[11px] text-white/40">
                <span>Cheaper room · {usd(location.rentLowUsd)}</span>
                <span>Nicer room · {usd(location.rentHighUsd)}</span>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between">
              <label htmlFor="limit" className="font-semibold text-white">
                My monthly budget
              </label>
              <span className="text-sm font-semibold text-white">{usd(limit)}</span>
            </div>
            <input
              id="limit"
              type="range"
              min={500}
              max={4000}
              step={50}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="mt-2 w-full accent-[#2997ff]"
            />
            <p className={`mt-1 text-sm font-semibold ${diff >= 0 ? "text-emerald-400" : "text-red-400"}`} aria-live="polite">
              {diff >= 0 ? `You'd have ${usd(diff)} to spare each month.` : `You'd be ${usd(-diff)} short each month.`}
            </p>
          </div>

          <p className="mt-4 text-xs text-white/40">
            About {usd(monthlyTotal * SEMESTER_MONTHS)} over a {SEMESTER_MONTHS}-month term (assumed length).
          </p>
        </section>

        <section className="glass rise mt-4 rounded-[28px] p-7" style={{ "--i": 6 } as React.CSSProperties}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">One-time costs</h2>
          <ul className="mt-3 divide-y divide-white/10 text-sm">
            <li className="flex justify-between gap-4 py-3">
              <span className="text-[#a1a1a6]">Student visa fee</span>
              <span className="font-medium text-white">{usd(config.oneTimeUsd.visa)}</span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span className="text-[#a1a1a6]">Round-trip flight</span>
              <span className="font-medium text-white">
                {range(config.oneTimeUsd.flightLow, config.oneTimeUsd.flightHigh)}
              </span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span className="text-[#a1a1a6]">Program cost ({program.name})</span>
              <span className="text-right font-medium text-white">{program.costRange}</span>
            </li>
          </ul>
          {program.bundlesHousing && living.usesLocationRent && (
            <p className="mt-2 text-xs font-medium text-amber-300">
              This all-in program fee usually already includes housing, so treat the rent above as what you&apos;d pay
              on your own rather than on top.
            </p>
          )}
        </section>

        {config.visaTip && (
          <section
            className="rise mt-4 rounded-[28px] border border-[#2997ff]/40 bg-[#2997ff]/10 p-7"
            style={{ "--i": 7 } as React.CSSProperties}
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
              Start here
            </h2>
            <p className="mt-2 text-xl font-semibold tracking-tight text-white">{config.visaTip.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#c7c7cc]">{config.visaTip.description}</p>
            <p className="mt-3 text-xs font-semibold text-[#5ab4ff]">
              Plan to start ~{config.visaTip.leadTimeDays} days before departure
            </p>
          </section>
        )}

        <div className="rise mt-10 flex flex-wrap items-center justify-center gap-5 pb-8" style={{ "--i": 8 } as React.CSSProperties}>
          <Link
            href={config.checklistHref}
            className="rounded-full px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
            style={{ background: ACCENT }}
          >
            Build my {config.destCountry} checklist
          </Link>
          <button type="button" onClick={onReset} className="text-sm font-semibold text-white/60 transition hover:text-white">
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
