"use client";

import { useState } from "react";
import type { Choices, PlannerConfig, StepKey } from "@/lib/planner/types";
import { TripCard } from "./TripCard";
import { LivingStep } from "./steps/LivingStep";
import { LocationStep } from "./steps/LocationStep";
import { MajorStep } from "./steps/MajorStep";
import { ProgramStep } from "./steps/ProgramStep";
import { SummaryStep } from "./steps/SummaryStep";

const STEPS: { key: StepKey; label: string; question: string; hint: string }[] = [
  { key: "major", label: "Major", question: "What are you studying?", hint: "Tap a field to see how well it fits." },
  {
    key: "program",
    label: "Program",
    question: "How will you go?",
    hint: "The program type decides who you pay and how much support you get.",
  },
  {
    key: "location",
    label: "Location",
    question: "Where will you be based?",
    hint: "Fly in from the US, set your rent budget, and pick a neighborhood on the map.",
  },
  {
    key: "living",
    label: "Living",
    question: "What kind of housing do you want?",
    hint: "Set your priorities and we'll score each option.",
  },
];

const SUMMARY_INDEX = STEPS.length;

export function PlannerWizard({ config }: { config: PlannerConfig }) {
  const [choices, setChoices] = useState<Choices>({});
  const [step, setStep] = useState(0);
  const [rentPos, setRentPos] = useState(0.5);

  const firstUnanswered = STEPS.findIndex((s) => !choices[s.key]);
  const allAnswered = firstUnanswered === -1;
  const furthestReachable = allAnswered ? SUMMARY_INDEX : firstUnanswered;
  const current = step < SUMMARY_INDEX ? STEPS[step] : undefined;

  function pick(key: StepKey, id: string) {
    setChoices((c) => ({ ...c, [key]: id }));
  }

  function next() {
    setStep(allAnswered ? SUMMARY_INDEX : step + 1);
  }

  function reset() {
    setChoices({});
    setRentPos(0.5);
    setStep(0);
  }

  const chosenLabel: Record<StepKey, string | undefined> = {
    major: config.majors.find((m) => m.id === choices.major)?.label,
    program: config.programs.find((p) => p.id === choices.program)?.name,
    location: config.locations.find((l) => l.id === choices.location)?.name,
    living: config.living.find((l) => l.id === choices.living)?.name,
  };

  // Plane position along the route: 0 at step 1, 1 at the final "Your plan" node.
  const progress = step / SUMMARY_INDEX;
  const nodes = [
    ...STEPS.map((s) => ({ key: s.key as string, label: chosenLabel[s.key] ?? s.label, done: !!choices[s.key] })),
    { key: "plan", label: "Your plan", done: false },
  ];

  return (
    <div>
      <nav aria-label="Progress" className="relative pt-5">
        <div className="absolute left-8 right-8 top-[38px] h-1 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width] duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span
          aria-hidden
          className="absolute top-[-6px] z-10 text-xl transition-[left] duration-700"
          style={{ left: `calc(2rem + (100% - 4rem) * ${progress})`, transform: "translateX(-50%) rotate(0deg)" }}
        >
          ✈️
        </span>
        <ol className="relative flex justify-between">
          {nodes.map((n, i) => {
            const reachable = i <= furthestReachable;
            const active = i === step;
            return (
              <li key={n.key} className="w-16">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => setStep(i)}
                  className="group flex w-full flex-col items-center gap-1 disabled:cursor-not-allowed"
                >
                  <span
                    className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                      active
                        ? "scale-110 border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-300"
                        : n.done
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : reachable
                            ? "border-indigo-300 bg-white text-indigo-500"
                            : "border-slate-200 bg-white text-slate-300"
                    }`}
                  >
                    {n.done && !active ? "✓" : i + 1}
                  </span>
                  <span
                    className={`w-full truncate text-center text-[11px] font-semibold ${
                      active ? "text-indigo-700" : reachable ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    {n.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section key={step} className="step-in min-w-0">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {current ? current.question : `Your ${config.destCountry} plan ${config.flagEmoji}`}
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">
            {current ? current.hint : "Tweak the sliders to see how your budget changes."}
          </p>

          {step === 0 && <MajorStep config={config} value={choices.major} onSelect={(id) => pick("major", id)} />}
          {step === 1 && <ProgramStep config={config} value={choices.program} onSelect={(id) => pick("program", id)} />}
          {step === 2 && (
            <LocationStep config={config} value={choices.location} onSelect={(id) => pick("location", id)} />
          )}
          {step === 3 && <LivingStep config={config} value={choices.living} onSelect={(id) => pick("living", id)} />}
          {step === SUMMARY_INDEX && (
            <SummaryStep
              config={config}
              choices={choices}
              rentPos={rentPos}
              onRentPos={setRentPos}
              onEdit={setStep}
              onReset={reset}
            />
          )}

          {current && (
            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={!choices[current.key]}
                onClick={next}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {allAnswered ? "See my plan →" : "Continue →"}
              </button>
            </div>
          )}
        </section>

        <TripCard config={config} choices={choices} rentPos={rentPos} onJump={(i) => i <= furthestReachable && setStep(i)} />
      </div>
    </div>
  );
}
