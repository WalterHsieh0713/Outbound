"use client";

import { useState } from "react";
import type { PlannerConfig } from "@/lib/planner/types";

export function MajorStep({
  config,
  value,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  onSelect: (id: string) => void;
}) {
  const [hoverId, setHoverId] = useState<string>();
  const shown = config.majors.find((m) => m.id === (hoverId ?? value));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {config.majors.map((m) => {
          const selected = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(m.id)}
              onMouseEnter={() => setHoverId(m.id)}
              onMouseLeave={() => setHoverId(undefined)}
              onFocus={() => setHoverId(m.id)}
              onBlur={() => setHoverId(undefined)}
              className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                selected
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300"
                  : "border-slate-200 bg-white hover:border-indigo-300"
              }`}
            >
              <span className="text-4xl transition duration-200 group-hover:scale-125" aria-hidden>
                {m.icon}
              </span>
              <span className="text-sm font-semibold leading-tight text-slate-900">{m.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  m.fit === "strong" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.fit === "strong" ? "Strong fit" : "Possible fit"}
              </span>
              {selected && (
                <span className="pop-in absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[88px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-live="polite">
        {shown ? (
          <div key={shown.id} className="pop-in">
            <p className="text-sm font-bold text-slate-900">
              {shown.icon} {shown.label} in the {config.destCountry}
            </p>
            <p className="mt-1 text-sm text-slate-600">{shown.note}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Hover a field to see how the {config.destCountry} fits it.</p>
        )}
      </div>
    </div>
  );
}
