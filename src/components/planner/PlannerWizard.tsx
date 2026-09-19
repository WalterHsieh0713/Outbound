"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { Choices, PlannerConfig, StepKey } from "@/lib/planner/types";
import { GlobeBackdrop } from "./GlobeBackdrop";
import { LivingStep } from "./steps/LivingStep";
import { LocationStep } from "./steps/LocationStep";
import { MajorStep } from "./steps/MajorStep";
import { ProgramStep } from "./steps/ProgramStep";
import { SummaryStep } from "./steps/SummaryStep";
import { ACCENT } from "./ui";

const STEPS: { key: StepKey; label: string; prompt: string }[] = [
  { key: "major", label: "Field", prompt: "Choose your field" },
  { key: "program", label: "Program", prompt: "Choose a program" },
  { key: "location", label: "Location", prompt: "Choose a neighborhood" },
  { key: "living", label: "Housing", prompt: "Choose your housing" },
];
const REVIEW_INDEX = STEPS.length;

export function PlannerWizard({ config }: { config: PlannerConfig }) {
  const [choices, setChoices] = useState<Choices>({});
  const [step, setStep] = useState(0);
  const [rentPos, setRentPos] = useState(0.5);
  const [arrived, setArrived] = useState(false);

  const inRegion = step >= 2;
  const handleArrived = useCallback(() => setArrived(true), []);

  const firstUnanswered = STEPS.findIndex((s) => !choices[s.key]);
  const allAnswered = firstUnanswered === -1;
  const furthestReachable = allAnswered ? REVIEW_INDEX : firstUnanswered;
  const current = step < REVIEW_INDEX ? STEPS[step] : undefined;

  const chosenLabel: Record<StepKey, string | undefined> = {
    major: config.majors.find((m) => m.id === choices.major)?.label,
    program: config.programs.find((p) => p.id === choices.program)?.name,
    location: config.locations.find((l) => l.id === choices.location)?.name,
    living: config.living.find((l) => l.id === choices.living)?.name,
  };

  function pick(key: StepKey, id: string) {
    setChoices((c) => ({ ...c, [key]: id }));
  }

  function goTo(i: number) {
    if (i === step) return;
    // Leaving the region view should re-run the fly-in next time.
    if (i < 2) setArrived(false);
    setStep(i);
  }

  function reset() {
    setChoices({});
    setRentPos(0.5);
    setArrived(false);
    setStep(0);
  }

  const labels = [...STEPS.map((s) => s.label), "Review"];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black text-white">
      <div className="stars absolute inset-0 opacity-70" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(30,64,175,0.28),transparent_60%)]"
        aria-hidden
      />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${step === 0 ? "opacity-100" : "opacity-55"}`}>
        <GlobeBackdrop
          destAdminName={config.destCountry}
          cityName={config.city}
          center={{ lat: config.cityLat, lng: config.cityLng }}
          origin={config.origin}
          mode={inRegion ? "region" : "world"}
          onArrived={handleArrived}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,0,0,0.25),rgba(0,0,0,0.78)_78%)]"
        aria-hidden
      />

      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
            <Link href="/" className="text-sm font-semibold text-white/80 transition hover:text-white">
              ←<span className="hidden sm:inline"> AbroadReady</span>
            </Link>
            <nav aria-label="Progress" className="flex items-center gap-1 sm:gap-2">
              {labels.map((label, i) => {
                const reachable = i <= furthestReachable;
                const active = i === step;
                const done = i < REVIEW_INDEX && !!choices[STEPS[i].key];
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={!reachable}
                    onClick={() => goTo(i)}
                    className={`relative rounded-full px-2.5 py-1 text-xs font-semibold transition sm:px-3.5 ${
                      active ? "text-white" : reachable ? "text-white/60 hover:text-white" : "text-white/25"
                    }`}
                  >
                    {active && <span className="absolute inset-0 rounded-full bg-white/15" aria-hidden />}
                    <span className="relative flex items-center gap-1.5">
                      {done && !active && <span style={{ color: ACCENT }}>✓</span>}
                      {label}
                    </span>
                  </button>
                );
              })}
            </nav>
            <span className="hidden w-24 sm:block" />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-40 pt-10 md:pt-14">
          <div key={step}>
            {step === 0 && <MajorStep config={config} value={choices.major} onSelect={(id) => pick("major", id)} />}
            {step === 1 && (
              <ProgramStep config={config} value={choices.program} onSelect={(id) => pick("program", id)} />
            )}
            {step === 2 && (
              <LocationStep
                config={config}
                value={choices.location}
                arrived={arrived}
                onSelect={(id) => pick("location", id)}
              />
            )}
            {step === 3 && <LivingStep config={config} value={choices.living} onSelect={(id) => pick("living", id)} />}
            {step === REVIEW_INDEX && (
              <SummaryStep
                config={config}
                choices={choices}
                rentPos={rentPos}
                onRentPos={setRentPos}
                onEdit={goTo}
                onReset={reset}
              />
            )}
          </div>
        </main>
      </div>

      {current && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="glass-strong pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-full py-2 pl-5 pr-2 shadow-2xl shadow-black/60">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="text-sm font-semibold text-white/60 transition hover:text-white"
              >
                Back
              </button>
            ) : null}
            <p className="min-w-0 flex-1 truncate text-sm">
              {chosenLabel[current.key] ? (
                <span className="font-semibold text-white">{chosenLabel[current.key]}</span>
              ) : (
                <span className="text-white/50">{current.prompt}</span>
              )}
            </p>
            <button
              type="button"
              disabled={!choices[current.key]}
              onClick={() => goTo(allAnswered ? REVIEW_INDEX : step + 1)}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
              style={choices[current.key] ? { background: ACCENT } : undefined}
            >
              {allAnswered ? "Review" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
