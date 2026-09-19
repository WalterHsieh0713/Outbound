"use client";

import { useRef } from "react";
import type { PlannerConfig } from "@/lib/planner/types";
import { CheckBadge, SpotlightButton, StepHeading } from "../ui";

export function ProgramStep({
  config,
  value,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  onSelect: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div>
      <StepHeading
        eyebrow="Step 2 of 4"
        title="How will you go?"
        sub="The program type decides who you pay and how much support you get."
      />

      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2">
        <div className="mx-auto mb-3 hidden max-w-6xl justify-end gap-2 px-6 md:flex">
          {(["‹", "›"] as const).map((arrow, i) => (
            <button
              key={arrow}
              type="button"
              aria-label={i === 0 ? "Scroll left" : "Scroll right"}
              onClick={() => nudge(i === 0 ? -1 : 1)}
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/15"
            >
              {arrow}
            </button>
          ))}
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-10 pt-2 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:scroll-px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {config.programs.map((p, i) => {
            const selected = value === p.id;
            return (
              <div key={p.id} className="rise snap-center" style={{ "--i": i + 3 } as React.CSSProperties}>
                <SpotlightButton
                  type="button"
                  aria-pressed={selected}
                  disabled={!p.available}
                  onClick={() => onSelect(p.id)}
                  className={`flex h-[420px] w-[300px] flex-col rounded-[28px] border p-6 text-left transition duration-300 md:w-[330px] ${
                    !p.available
                      ? "cursor-not-allowed border-white/10 opacity-45"
                      : selected
                        ? "scale-[1.03] border-white/80 shadow-[0_0_60px_rgba(41,151,255,0.35)]"
                        : "border-white/12 hover:-translate-y-1 hover:border-white/30"
                  }`}
                  style={{
                    background: `linear-gradient(165deg, hsla(${212 + i * 26}, 85%, 58%, ${selected ? 0.34 : 0.2}), rgba(255,255,255,0.04) 58%)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.18em] text-white/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {selected && <CheckBadge />}
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white">{p.name}</h3>
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-[#a1a1a6]">{p.description}</p>

                  <div className="mt-auto">
                    {p.bundlesHousing && (
                      <span className="mb-3 inline-block rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                        Housing usually included
                      </span>
                    )}
                    <p className="text-[1.65rem] font-semibold leading-none tracking-tight text-white">
                      {p.costHeadline}
                    </p>
                    <p className="mt-1 text-sm text-[#a1a1a6]">{p.costCaption}</p>
                    <p className="mt-3 line-clamp-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/55">
                      {p.costModel}
                    </p>
                    {p.caveat && <p className="mt-2 text-xs font-medium text-amber-300">{p.caveat}</p>}
                  </div>
                </SpotlightButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
