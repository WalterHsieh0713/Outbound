"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MaplibreMap } from "maplibre-gl";
import { AFFORDABILITY_COLOR, affordability } from "@/lib/planner/budget";
import { range, usd } from "@/lib/planner/format";
import type { PlannerLocation } from "@/lib/planner/types";

// Same keyless OpenFreeMap style used by the food map; needs a live connection for tiles.
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const START_VIEW = { center: [-1.8, 52.6] as [number, number], zoom: 5.4 };

interface Props {
  locations: PlannerLocation[];
  budgetUsd: number;
  selectedId?: string;
  hoveredId?: string;
  visible: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
  onLoaded: () => void;
}

interface MarkerParts {
  dot: HTMLDivElement;
  pill: HTMLButtonElement;
}

interface PaintState {
  budgetUsd: number;
  selectedId?: string;
  hoveredId?: string;
}

function paint(parts: MarkerParts, loc: PlannerLocation, state: PaintState) {
  const color = AFFORDABILITY_COLOR[affordability(loc, state.budgetUsd)];
  const selected = loc.id === state.selectedId;
  const active = selected || loc.id === state.hoveredId;
  Object.assign(parts.dot.style, {
    background: color,
    boxShadow: selected ? `0 0 0 5px ${color}66, 0 0 0 2px #fff inset` : "0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,0.35)",
    transform: `translate(-50%, -50%) scale(${active ? 1.35 : 1})`,
  });
  Object.assign(parts.pill.style, {
    border: `2px solid ${active ? "#0f172a" : color}`,
    background: active ? "#0f172a" : "#ffffff",
    color: active ? "#ffffff" : "#0f172a",
    transform: `translateX(-50%) scale(${active ? 1.08 : 1})`,
    zIndex: active ? "2" : "1",
  });
  const rent = parts.pill.querySelector("[data-rent]") as HTMLElement | null;
  if (rent) rent.style.color = active ? "#cbd5e1" : "#475569";
}

export function CityStreetMap({
  locations,
  budgetUsd,
  selectedId,
  hoveredId,
  visible,
  onSelect,
  onHover,
  onLoaded,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const partsRef = useRef<Map<string, MarkerParts>>(new Map());
  const stateRef = useRef<PaintState>({ budgetUsd, selectedId, hoveredId });
  const revealedRef = useRef(false);
  const lastSelectedRef = useRef(selectedId);
  const callbacksRef = useRef({ onSelect, onHover, onLoaded });

  useEffect(() => {
    callbacksRef.current = { onSelect, onHover, onLoaded };
  }, [onSelect, onHover, onLoaded]);

  useEffect(() => {
    stateRef.current = { budgetUsd, selectedId, hoveredId };
    for (const loc of locations) {
      const parts = partsRef.current.get(loc.id);
      if (parts) paint(parts, loc, stateRef.current);
    }
  }, [budgetUsd, selectedId, hoveredId, locations]);

  useEffect(() => {
    let cancelled = false;
    const parts = partsRef.current;

    import("maplibre-gl")
      .then(({ Map, Marker, setWorkerUrl }) => {
        if (cancelled || !containerRef.current) return;
        // Turbopack breaks MapLibre's default worker resolution; use the static copies in /public.
        setWorkerUrl("/maplibre-gl-worker.mjs");

        const map = new Map({
          container: containerRef.current,
          style: MAP_STYLE_URL,
          center: START_VIEW.center,
          zoom: START_VIEW.zoom,
          attributionControl: { compact: true },
        });
        mapRef.current = map;
        map.on("load", () => callbacksRef.current.onLoaded());

        for (const loc of locations) {
          const root = document.createElement("div");
          Object.assign(root.style, { width: "0px", height: "0px", cursor: "pointer" });

          const dot = document.createElement("div");
          Object.assign(dot.style, {
            position: "absolute",
            left: "0",
            top: "0",
            width: "16px",
            height: "16px",
            borderRadius: "9999px",
            transition: "transform 150ms, box-shadow 150ms, background 300ms",
          } satisfies Partial<CSSStyleDeclaration>);

          const pill = document.createElement("button");
          pill.type = "button";
          Object.assign(pill.style, {
            position: "absolute",
            left: "0",
            bottom: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: "10px",
            font: "700 12px system-ui, sans-serif",
            whiteSpace: "nowrap",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            transition: "transform 150ms, background 200ms, border-color 300ms",
          } satisfies Partial<CSSStyleDeclaration>);
          const name = document.createElement("span");
          name.textContent = loc.name;
          const rent = document.createElement("span");
          rent.setAttribute("data-rent", "");
          rent.textContent = `${range(loc.rentLowUsd, loc.rentHighUsd, usd)}/mo`;
          Object.assign(rent.style, { fontWeight: "500", fontSize: "11px" });
          pill.append(name, rent);

          root.append(dot, pill);
          root.setAttribute("data-location", loc.id);
          root.addEventListener("click", () => callbacksRef.current.onSelect(loc.id));
          root.addEventListener("mouseenter", () => callbacksRef.current.onHover(loc.id));
          root.addEventListener("mouseleave", () => callbacksRef.current.onHover(undefined));

          const entry = { dot, pill };
          parts.set(loc.id, entry);
          paint(entry, loc, stateRef.current);
          new Marker({ element: root }).setLngLat([loc.lng, loc.lat]).addTo(map);
        }
      })
      .catch((err) => console.error("Failed to initialize map:", err));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      parts.clear();
    };
    // Markers are created once per mounted map; later state changes repaint them in place.
  }, [locations]);

  // First reveal: zoom down from the country view onto the neighborhoods.
  useEffect(() => {
    const map = mapRef.current;
    if (!visible || !map) return;
    map.resize();
    if (revealedRef.current) return;
    revealedRef.current = true;
    const lngs = locations.map((l) => l.lng);
    const lats = locations.map((l) => l.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 110, maxZoom: 13.4, duration: 2400 }
    );
  }, [visible, locations]);

  useEffect(() => {
    if (selectedId === lastSelectedRef.current) return;
    lastSelectedRef.current = selectedId;
    const loc = locations.find((l) => l.id === selectedId);
    const map = mapRef.current;
    if (loc && map) map.flyTo({ center: [loc.lng, loc.lat], zoom: Math.max(map.getZoom(), 13.2), duration: 700 });
  }, [selectedId, locations]);

  // MapLibre's stylesheet forces `position: relative` on its container, so sizing lives on the wrapper.
  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
