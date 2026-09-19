"use client";

import { useMemo, useState } from "react";
import type { Level, PlannerConfig, PlannerLiving } from "@/lib/planner/types";

type Trait = "cost" | "immersion" | "independence";

const TRAITS: { key: Trait; label: string; hint: string }[] = [
  { key: "cost", label: "Keep it cheap", hint: "Lower housing cost scores higher" },
  { key: "immersion", label: "Immerse me", hint: "More time around locals and the language" },
  { key: "independence", label: "Independence", hint: "Your own schedule, kitchen and rules" },
];

const WEIGHT_LABEL = ["Doesn't matter", "Nice to have", "Important", "Must-have"];

const LEVEL_LABEL: Record<Level, string> = { low: "Low", medium: "Medium", high: "High", varies: "Varies" };

// cost is inverted: cheaper = better. "varies" is scored as the midpoint.
function trait(option: PlannerLiving, key: Trait): number {
  const level =
    key === "cost" ? option.costLevel : key === "immersion" ? option.immersionLevel : option.independenceLevel;
  const v = level === "low" ? 0 : level === "high" ? 1 : 0.5;
  return key === "cost" ? 1 - v : v;
}

export function LivingStep({
  config,
  value,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  onSelect: (id: string) => void;
}) {
  const [weights, setWeights] = useState<Record<Trait, number>>({ cost: 2, immersion: 2, independence: 2 });
  const totalWeight = weights.cost + weights.immersion + weights.independence;

  const scored = useMemo(() => {
    const scores = config.living.map((o) => ({
      id: o.id,
      pct:
        totalWeight === 0
          ? 0
          : Math.round(
              (TRAITS.reduce((s, t) => s + weights[t.key] * trait(o, t.key), 0) / totalWeight) * 100
            ),
    }));
    const best = Math.max(...scores.map((s) => s.pct));
    return { scores: Object.fromEntries(scores.map((s) => [s.id, s.pct])), best };
  }, [config.living, weights, totalWeight]);

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800">What matters to you?</p>
        <p className="text-xs text-slate-500">Slide to set priorities — the match scores below update live.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {TRAITS.map((t) => (
            <div key={t.key}>
              <label htmlFor={`w-${t.key}`} className="text-sm font-semibold text-slate-900">
                {t.label}
              </label>
              <input
                id={`w-${t.key}`}
                type="range"
                min={0}
                max={3}
                step={1}
                value={weights[t.key]}
                onChange={(e) => setWeights((w) => ({ ...w, [t.key]: Number(e.target.value) }))}
                className="mt-1 w-full accent-indigo-600"
              />
              <p className="text-xs font-semibold text-indigo-600">{WEIGHT_LABEL[weights[t.key]]}</p>
              <p className="text-[11px] text-slate-400">{t.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {config.living.map((o) => {
          const selected = value === o.id;
          const pct = scored.scores[o.id] ?? 0;
          const isBest = totalWeight > 0 && pct === scored.best;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(o.id)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition duration-200 ${
                selected
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {o.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{o.name}</span>
                    {isBest && (
                      <span className="pop-in rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        Best match
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-bold text-slate-700">{pct}%</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{o.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Cost: <b className="text-slate-800">{LEVEL_LABEL[o.costLevel]}</b></span>
                <span>Immersion: <b className="text-slate-800">{LEVEL_LABEL[o.immersionLevel]}</b></span>
                <span>Independence: <b className="text-slate-800">{LEVEL_LABEL[o.independenceLevel]}</b></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
