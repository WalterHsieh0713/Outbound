"use client";

import type { PlannerConfig } from "@/lib/planner/types";

export function ProgramStep({
  config,
  value,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {config.programs.map((p) => {
        const selected = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={selected}
            disabled={!p.available}
            onClick={() => onSelect(p.id)}
            className={`rounded-2xl border p-4 text-left shadow-sm transition duration-200 ${
              !p.available
                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                : selected
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {p.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  <span className="text-xs font-bold text-slate-700">{p.costRange}</span>
                </div>
                {!selected && <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{p.description}</p>}
              </div>
            </div>

            {selected && (
              <div className="pop-in mt-3 border-t border-indigo-200 pt-3">
                <p className="text-sm text-slate-700">{p.description}</p>
                <p className="mt-2 rounded-lg bg-white/70 p-2 text-xs font-medium text-indigo-700">
                  💰 {p.costModel}
                </p>
              </div>
            )}
            {p.caveat && <p className="mt-2 text-xs font-medium text-amber-700">{p.caveat}</p>}
          </button>
        );
      })}
    </div>
  );
}
