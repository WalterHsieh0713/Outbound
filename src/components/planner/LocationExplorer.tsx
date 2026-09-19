"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlannerConfig } from "@/lib/planner/types";
import { CityStreetMap } from "./CityStreetMap";
import { LocationGlobe } from "./LocationGlobe";

const MAP_LOAD_TIMEOUT_MS = 12000;

interface Props {
  config: PlannerConfig;
  budgetUsd: number;
  selectedId?: string;
  hoveredId?: string;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
}

/**
 * 3D globe fly-in (US -> UK) that hands off to a street-level map for picking a neighborhood.
 * If map tiles can't load, the globe simply stays up and the cards beneath still work.
 */
export function LocationExplorer({ config, budgetUsd, selectedId, hoveredId, onSelect, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [arrived, setArrived] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [view, setView] = useState<"auto" | "globe">("auto");
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(Math.min(Math.round(w), 760));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mapLoaded) return;
    const t = setTimeout(() => setMapFailed(true), MAP_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [mapLoaded]);

  const handleArrived = useCallback(() => setArrived(true), []);
  const handleLoaded = useCallback(() => setMapLoaded(true), []);

  const showMap = view === "auto" && arrived && mapLoaded;
  const height = Math.max(380, Math.min(Math.round(width * 0.85), 540));

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_50%_38%,#1e1b4b,#020617_72%)] shadow-md"
      style={{ height }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${showMap ? "opacity-0 delay-700" : "opacity-100"}`}
      >
        <LocationGlobe
          destAdminName={config.destCountry}
          cityName={config.city}
          center={{ lat: config.cityLat, lng: config.cityLng }}
          origin={config.origin}
          width={width}
          height={height}
          target={view === "globe" ? "world" : "region"}
          onArrived={handleArrived}
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showMap ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <CityStreetMap
          locations={config.locations}
          budgetUsd={budgetUsd}
          selectedId={selectedId}
          hoveredId={hoveredId}
          visible={showMap}
          onSelect={onSelect}
          onHover={onHover}
          onLoaded={handleLoaded}
        />
      </div>

      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setView("globe")}
          className="rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-800"
        >
          🌍 World view
        </button>
        <button
          type="button"
          onClick={() => setView("auto")}
          className="rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-800"
        >
          📍 {config.city}
        </button>
      </div>

      <p className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[80%] rounded bg-slate-900/60 px-2 py-1 text-[11px] text-slate-200">
        {showMap
          ? "Click a neighborhood pin · colors follow your rent budget"
          : mapFailed && !mapLoaded
            ? "Street map unavailable offline — pick a neighborhood from the cards below"
            : arrived
              ? "Loading street map…"
              : "Flying in from the US…"}
      </p>
    </div>
  );
}
