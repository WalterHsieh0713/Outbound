"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PlannerConfig, PoiKind } from "@/lib/planner/types";
import { CityStreetMap } from "./CityStreetMap";

const MAP_LOAD_TIMEOUT_MS = 12000;

interface Props {
  config: PlannerConfig;
  /** true once the background globe has finished flying in over the destination */
  arrived: boolean;
  budgetUsd: number;
  selectedId?: string;
  hoveredId?: string;
  visibleKinds: Record<PoiKind, boolean>;
  activePoiId?: string;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
  onPoiSelect: (id: string | undefined) => void;
  toolbar?: ReactNode;
  children?: ReactNode;
}

/**
 * A glass window onto the street map. It stays transparent while the background globe flies in,
 * then the map fades in on top. If tiles can't load, the cards outside the panel still work.
 */
export function LocationExplorer({ config, arrived, toolbar, children, ...mapProps }: Props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    if (mapLoaded) return;
    const t = setTimeout(() => setMapFailed(true), MAP_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [mapLoaded]);

  const handleLoaded = useCallback(() => setMapLoaded(true), []);
  const showMap = arrived && mapLoaded;

  return (
    <div className="relative h-[62vh] min-h-[460px] w-full overflow-hidden rounded-[28px] border border-white/15 shadow-2xl shadow-black/50">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${showMap ? "opacity-100" : "opacity-0"}`}>
        <CityStreetMap
          locations={config.locations}
          pois={config.pois}
          visible={showMap}
          onLoaded={handleLoaded}
          {...mapProps}
        />
      </div>

      {!showMap && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-8">
          <p className="glass rounded-full px-4 py-2 text-sm text-white/80">
            {mapFailed && !mapLoaded
              ? "Street map unavailable offline — pick a neighborhood from the cards below"
              : arrived
                ? "Loading street map…"
                : `Flying to ${config.city}…`}
          </p>
        </div>
      )}

      {showMap && toolbar && <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">{toolbar}</div>}
      {showMap && children && (
        <div className="absolute bottom-4 left-4 right-4 z-10 sm:right-auto sm:w-[380px]">{children}</div>
      )}
    </div>
  );
}
