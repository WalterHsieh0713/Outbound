"use client";

import { useState } from "react";
import type { PlannerConfig } from "@/lib/planner/types";
import { ACCENT, CheckBadge, StepHeading } from "../ui";

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
  const activeId = hoverId ?? value ?? config.majors.find((m) => m.fit === "strong")?.id ?? config.majors[0].id;
  const active = config.majors.find((m) => m.id === activeId) ?? config.majors[0];

  return (
    <div>
      <StepHeading
        eyebrow="Step 1 of 4"
        title="What are you studying?"
        sub={`Your field shapes how well the ${config.destCountry} fits. Hover to preview, click to choose.`}
      />

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 md:grid-cols-[1.3fr_1fr] md:gap-14">
        <ul className="flex flex-col" onMouseLeave={() => setHoverId(undefined)}>
          {config.majors.map((m, i) => {
            const selected = value === m.id;
            const lit = selected || hoverId === m.id;
            return (
              <li key={m.id} className="rise" style={{ "--i": i + 3 } as React.CSSProperties}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(m.id)}
                  onMouseEnter={() => setHoverId(m.id)}
                  onFocus={() => setHoverId(m.id)}
                  onBlur={() => setHoverId(undefined)}
                  className="group flex w-full items-center gap-4 rounded-2xl py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <span
                    className={`text-3xl font-semibold leading-tight tracking-tight transition-all duration-300 md:text-[2.6rem] ${
                      lit ? "translate-x-2 text-white" : value ? "text-white/25" : "text-white/45"
                    }`}
                  >
                    {m.label}
                  </span>
                  {m.fit === "strong" && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                      title="Strong fit"
                    />
                  )}
                  {selected && <CheckBadge className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="md:sticky md:top-28 md:self-start">
          <div key={active.id} className="pop-in glass-strong rounded-[28px] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              How the {config.destCountry} fits
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-white">{active.label}</h2>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                active.fit === "strong" ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/60"
              }`}
            >
              {active.fit === "strong" ? "Strong fit" : "Possible fit"}
            </span>
            <p className="mt-4 text-[15px] leading-relaxed text-[#a1a1a6]">{active.note}</p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Top destinations for this field
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {active.topCountries.map((c) => {
                const isUk = c === config.destCountry;
                return (
                  <span
                    key={c}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isUk ? "text-white" : "bg-white/8 text-white/60"
                    }`}
                    style={isUk ? { background: ACCENT } : { background: "rgba(255,255,255,0.08)" }}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
