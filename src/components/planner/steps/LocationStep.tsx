"use client";

import { useMemo, useState } from "react";
import { AFFORDABILITY_COLOR, affordability } from "@/lib/planner/budget";
import { distanceKm, formatKm, range, usd } from "@/lib/planner/format";
import type { PlannerConfig, PoiKind } from "@/lib/planner/types";
import { LocationExplorer } from "../LocationExplorer";
import { CheckBadge, SpotlightButton, StepHeading } from "../ui";

const AFFORD_TEXT = { ok: "Within budget", stretch: "A stretch", over: "Over budget" } as const;

export function LocationStep({
  config,
  value,
  arrived,
  onSelect,
}: {
  config: PlannerConfig;
  value?: string;
  arrived: boolean;
  onSelect: (id: string) => void;
}) {
  const bounds = useMemo(() => {
    const lows = config.locations.map((l) => l.rentLowUsd);
    const highs = config.locations.map((l) => l.rentHighUsd);
    return {
      min: Math.floor((Math.min(...lows) * 0.6) / 100) * 100,
      max: Math.ceil((Math.max(...highs) * 1.15) / 100) * 100,
      mid: Math.round(highs.reduce((a, b) => a + b, 0) / highs.length / 50) * 50,
    };
  }, [config.locations]);

  const [budget, setBudget] = useState(bounds.mid);
  const [hoverId, setHoverId] = useState<string>();
  const [kinds, setKinds] = useState<Record<PoiKind, boolean>>({ food: true, embassy: true });
  const [activePoiId, setActivePoiId] = useState<string>();

  const selected = config.locations.find((l) => l.id === value);
  const activePoi = config.pois.find((p) => p.id === activePoiId);

  const nearbyFood = useMemo(() => {
    if (!selected) return [];
    return config.pois
      .filter((p) => p.kind === "food")
      .map((p) => ({ poi: p, km: distanceKm(selected, p) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 4);
  }, [config.pois, selected]);

  function focusPoi(id: string) {
    setActivePoiId(id);
    document.getElementById("planner-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const toolbar = (
    <>
      {(
        [
          ["food", "🍽️ Food & markets"],
          ["embassy", "🏛️ U.S. Embassy"],
        ] as const
      ).map(([kind, label]) => (
        <button
          key={kind}
          type="button"
          aria-pressed={kinds[kind]}
          onClick={() => setKinds((k) => ({ ...k, [kind]: !k[kind] }))}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-xl transition ${
            kinds[kind] ? "bg-white text-black" : "bg-black/55 text-white/80 ring-1 ring-white/25 hover:bg-black/70"
          }`}
        >
          {label}
        </button>
      ))}
    </>
  );

  return (
    <div>
      <StepHeading
        eyebrow="Step 3 of 4"
        title={`Where in ${config.city}?`}
        sub="Set your rent budget, then pick a neighborhood. Food and essentials are on the map too."
      />

      <div id="planner-map" className="rise mt-8" style={{ "--i": 3 } as React.CSSProperties}>
        <LocationExplorer
          config={config}
          arrived={arrived}
          budgetUsd={budget}
          selectedId={value}
          hoveredId={hoverId}
          visibleKinds={kinds}
          activePoiId={activePoiId}
          onSelect={onSelect}
          onHover={setHoverId}
          onPoiSelect={setActivePoiId}
          toolbar={toolbar}
        >
          <div className="glass-strong rounded-2xl p-4">
            {activePoi ? (
              <div key={activePoi.id} className="pop-in">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{activePoi.name}</h3>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setActivePoiId(undefined)}
                    className="text-lg leading-none text-white/50 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {activePoi.priceRange && (
                    <span className="rounded-full bg-white/12 px-2 py-0.5 text-[11px] font-bold text-white">
                      {activePoi.priceRange}
                    </span>
                  )}
                  {activePoi.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/75">
                      {t}
                    </span>
                  ))}
                  {selected && (
                    <span className="text-[11px] font-semibold text-[#5ab4ff]">
                      {formatKm(distanceKm(selected, activePoi))} from {selected.name}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-white/70">{activePoi.blurb}</p>
                {activePoi.lines.map((l) => (
                  <p key={l} className="mt-1 text-xs leading-relaxed text-white/60">
                    {l}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/70">Tap a pin to see restaurants, markets and the embassy nearby.</p>
            )}
          </div>
        </LocationExplorer>
      </div>

      <div className="glass mt-6 rounded-3xl p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <label htmlFor="rent-budget" className="text-lg font-semibold text-white">
            Your monthly rent budget
          </label>
          <span className="text-3xl font-semibold tracking-tight text-white">{usd(budget)}</span>
        </div>
        <input
          id="rent-budget"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-3 w-full accent-[#2997ff]"
        />
        <p className="mt-1 text-sm text-[#a1a1a6]">
          Drag to recolor the map: <span className="font-semibold text-emerald-400">green</span> fits,{" "}
          <span className="font-semibold text-yellow-400">yellow</span> is a stretch,{" "}
          <span className="font-semibold text-red-400">red</span> is over.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {config.locations.map((l, i) => {
          const a = affordability(l, budget);
          const isSelected = value === l.id;
          return (
            <div key={l.id} className="rise" style={{ "--i": i } as React.CSSProperties}>
              <SpotlightButton
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(l.id)}
                onMouseEnter={() => setHoverId(l.id)}
                onMouseLeave={() => setHoverId(undefined)}
                onFocus={() => setHoverId(l.id)}
                onBlur={() => setHoverId(undefined)}
                className={`glass h-full w-full rounded-3xl p-5 text-left transition duration-300 hover:-translate-y-0.5 ${
                  isSelected ? "!border-white/80 shadow-[0_0_50px_rgba(41,151,255,0.3)]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-semibold tracking-tight text-white">{l.name}</span>
                  {isSelected ? (
                    <CheckBadge />
                  ) : (
                    <span
                      className="h-3 w-3 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: AFFORDABILITY_COLOR[a] }}
                    />
                  )}
                </div>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  {range(l.rentLowUsd, l.rentHighUsd)}
                  <span className="text-sm font-medium text-white/45">/mo</span>
                </p>
                <p className="text-xs text-white/45">
                  {range(l.rentLowLocal, l.rentHighLocal, (n) => `${config.currencySymbol}${n.toLocaleString()}`)}
                </p>
                <p className="mt-2 text-xs font-semibold" style={{ color: AFFORDABILITY_COLOR[a] }}>
                  {AFFORD_TEXT[a]}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#a1a1a6]">{l.vibe}</p>
              </SpotlightButton>
            </div>
          );
        })}
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {selected ? `Eat near ${selected.name}` : "Eat around town"}
        </h2>
        <p className="mt-1 text-[#a1a1a6]">
          {selected
            ? "Closest food spots to your neighborhood — tap one to see it on the map."
            : "Pick a neighborhood to see what's closest."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(selected ? nearbyFood : config.pois.filter((p) => p.kind === "food").slice(0, 4).map((poi) => ({ poi, km: undefined }))).map(
            ({ poi, km }) => (
              <SpotlightButton
                key={poi.id}
                type="button"
                onClick={() => focusPoi(poi.id)}
                className="glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold text-white">{poi.name}</p>
                <p className="mt-1 text-xs text-white/50">{poi.tags[0]}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white/80">{poi.priceRange}</span>
                  {km !== undefined && <span className="font-semibold text-[#5ab4ff]">{formatKm(km)}</span>}
                </div>
              </SpotlightButton>
            )
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Sort these out in {config.city}
        </h2>
        <p className="mt-1 text-[#a1a1a6]">The essentials every study-abroad student has to handle, with real lead times.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {config.essentials.map((e) => (
            <div key={e.id} className="glass rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#5ab4ff" }}>
                {e.label}
              </p>
              {e.items.map((item) => (
                <div key={item.title} className="mt-3 first:mt-2">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-white">{item.title}</h3>
                  <p className="mt-1 line-clamp-4 text-sm leading-relaxed text-[#a1a1a6]">{item.description}</p>
                  <p className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                    {item.timing}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
