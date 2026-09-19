"use client";

import { useMemo, useState } from "react";
import { AFFORDABILITY_COLOR, affordability } from "@/lib/planner/budget";
import { range, usd } from "@/lib/planner/format";
import type { PlannerConfig } from "@/lib/planner/types";
import { LocationExplorer } from "../LocationExplorer";

const AFFORD_TEXT = {
  ok: "Within your budget",
  stretch: "A stretch",
  over: "Over budget",
} as const;

export function LocationStep({
  config,
  value,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  onSelect: (id: string) => void;
}) {
  const bounds = useMemo(() => {
    const lows = config.locations.map((l) => l.rentLowUsd);
    const highs = config.locations.map((l) => l.rentHighUsd);
    const min = Math.floor((Math.min(...lows) * 0.6) / 100) * 100;
    const max = Math.ceil((Math.max(...highs) * 1.15) / 100) * 100;
    const mid = Math.round((highs.reduce((a, b) => a + b, 0) / highs.length) / 50) * 50;
    return { min, max, mid };
  }, [config.locations]);

  const [budget, setBudget] = useState(bounds.mid);
  const [hoverId, setHoverId] = useState<string>();

  return (
    <div>
      <LocationExplorer
        config={config}
        budgetUsd={budget}
        selectedId={value}
        hoveredId={hoverId}
        onSelect={onSelect}
        onHover={setHoverId}
      />

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="rent-budget" className="text-sm font-semibold text-slate-800">
            Your monthly rent budget
          </label>
          <span className="text-lg font-extrabold text-slate-900">{usd(budget)}</span>
        </div>
        <input
          id="rent-budget"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-2 w-full accent-indigo-600"
        />
        <p className="mt-1 text-xs text-slate-500">
          Drag to recolor the neighborhoods on the map:{" "}
          <span className="font-semibold text-emerald-600">green</span> fits,{" "}
          <span className="font-semibold text-yellow-600">yellow</span> is a stretch,{" "}
          <span className="font-semibold text-red-600">red</span> is over.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {config.locations.map((l) => {
          const a = affordability(l, budget);
          const selected = value === l.id;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(l.id)}
              onMouseEnter={() => setHoverId(l.id)}
              onMouseLeave={() => setHoverId(undefined)}
              onFocus={() => setHoverId(l.id)}
              onBlur={() => setHoverId(undefined)}
              className={`rounded-2xl border p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                selected ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{l.name}</span>
                <span
                  className="h-3 w-3 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: AFFORDABILITY_COLOR[a] }}
                  aria-hidden
                />
              </div>
              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {range(l.rentLowUsd, l.rentHighUsd)}/mo
                <span className="ml-1 text-xs font-medium text-slate-400">
                  ({range(l.rentLowLocal, l.rentHighLocal, (n) => `${config.currencySymbol}${n.toLocaleString()}`)})
                </span>
              </p>
              <p className="text-xs font-semibold" style={{ color: AFFORDABILITY_COLOR[a] }}>
                {AFFORD_TEXT[a]}
              </p>
              <p className="mt-1 line-clamp-3 text-xs text-slate-500">{l.vibe}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-400">Only {config.city} neighborhoods are researched so far.</p>
    </div>
  );
}
