"use client";

import { useMemo, useState } from "react";
import type { Level, PlannerConfig, PlannerLiving } from "@/lib/planner/types";
import { CheckBadge, Ring, SpotlightButton, StepHeading } from "../ui";

type Trait = "cost" | "immersion" | "independence";

const TRAITS: { key: Trait; label: string; hint: string }[] = [
  { key: "cost", label: "Keep it cheap", hint: "Lower housing cost scores higher" },
  { key: "immersion", label: "Immerse me", hint: "More time around locals and the language" },
  { key: "independence", label: "Independence", hint: "Your own schedule, kitchen and rules" },
];

const WEIGHT_LABEL = ["Doesn't matter", "Nice to have", "Important", "Must-have"];
const LEVEL_LABEL: Record<Level, string> = { low: "Low", medium: "Medium", high: "High", varies: "Varies" };
const LEVEL_FILL: Record<Level, number> = { low: 0.34, medium: 0.67, high: 1, varies: 0.5 };

// cost is inverted for scoring: cheaper = better. "varies" is scored as the midpoint.
function trait(option: PlannerLiving, key: Trait): number {
  const level =
    key === "cost" ? option.costLevel : key === "immersion" ? option.immersionLevel : option.independenceLevel;
  const v = level === "low" ? 0 : level === "high" ? 1 : 0.5;
  return key === "cost" ? 1 - v : v;
}

function Meter({ label, level, tone }: { label: string; level: Level; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-medium text-white/50">
        <span>{label}</span>
        <span className="text-white/80">{LEVEL_LABEL[level]}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${LEVEL_FILL[level] * 100}%`, background: tone }}
        />
      </div>
    </div>
  );
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
          : Math.round((TRAITS.reduce((s, t) => s + weights[t.key] * trait(o, t.key), 0) / totalWeight) * 100),
    }));
    return {
      scores: Object.fromEntries(scores.map((s) => [s.id, s.pct])) as Record<string, number>,
      best: Math.max(...scores.map((s) => s.pct)),
    };
  }, [config.living, weights, totalWeight]);

  return (
    <div>
      <StepHeading
        eyebrow="Step 4 of 4"
        title="Where will you live?"
        sub="Tell us what matters and each option scores itself live."
      />

      <div className="glass rise mx-auto mt-12 max-w-4xl rounded-[28px] p-7" style={{ "--i": 3 } as React.CSSProperties}>
        <div className="grid gap-7 md:grid-cols-3">
          {TRAITS.map((t) => (
            <div key={t.key}>
              <label htmlFor={`w-${t.key}`} className="text-lg font-semibold tracking-tight text-white">
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
                className="mt-3 w-full accent-[#2997ff]"
              />
              <p className="text-sm font-semibold text-[#5ab4ff]">{WEIGHT_LABEL[weights[t.key]]}</p>
              <p className="text-xs text-white/45">{t.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
        {config.living.map((o, i) => {
          const selected = value === o.id;
          const pct = scored.scores[o.id] ?? 0;
          const isBest = totalWeight > 0 && pct === scored.best;
          return (
            <div key={o.id} className="rise" style={{ "--i": i + 4 } as React.CSSProperties}>
              <SpotlightButton
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(o.id)}
                className={`glass flex h-full w-full flex-col rounded-[28px] p-6 text-left transition duration-300 hover:-translate-y-1 ${
                  selected ? "!border-white/80 shadow-[0_0_60px_rgba(41,151,255,0.35)]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-semibold tracking-tight text-white">{o.name}</h3>
                      {selected && <CheckBadge />}
                    </div>
                    {isBest && (
                      <span className="pop-in mt-2 inline-block rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                        Best match
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Ring pct={pct} size={62} />
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                      {pct}
                    </span>
                  </div>
                </div>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#a1a1a6]">{o.description}</p>
                <div className="mt-auto grid grid-cols-3 gap-4 pt-5">
                  <Meter label="Cost" level={o.costLevel} tone="#f59e0b" />
                  <Meter label="Immersion" level={o.immersionLevel} tone="#34d399" />
                  <Meter label="Independence" level={o.independenceLevel} tone="#60a5fa" />
                </div>
              </SpotlightButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
