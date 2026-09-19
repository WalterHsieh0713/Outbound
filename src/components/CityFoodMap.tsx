"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LngLatBoundsLike, Map as MaplibreMap } from "maplibre-gl";
import type { DestCountry, FoodSpot, PriceRange } from "@/types";

interface CityFoodMapProps {
  destCountry: DestCountry;
  centerLat: number;
  centerLng: number;
  foodSpots: FoodSpot[];
}

// OpenFreeMap's "liberty" style — free, keyless vector tiles, no account or
// API key required. This does need a live internet connection to fetch map
// tiles (unlike the globe's bundled textures/geojson), a deliberate
// trade-off for a real street-level map instead of an illustrated one.
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const PRICE_RANGE_COLOR: Record<PriceRange, string> = {
  $: "#22c55e",
  $$: "#eab308",
  $$$: "#ef4444",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function CityFoodMap({ destCountry, centerLat, centerLng, foodSpots }: CityFoodMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    // maplibre-gl touches `window`/`document` at import time, same
    // SSR-avoidance constraint as react-globe.gl elsewhere in this app —
    // dynamically imported inside the effect rather than at module scope.
    import("maplibre-gl").then(({ Map, Marker, Popup, NavigationControl, setWorkerUrl }) => {
      if (cancelled || !containerRef.current) return;

      // MapLibre's default worker-URL auto-resolution (via import.meta.url)
      // doesn't survive Next.js's Turbopack dev bundler — tiles silently
      // never load because the tile-parsing worker never starts, with no
      // thrown error (the worker itself spins up but fails to fetch its own
      // sibling chunk). Pointing it at copies of the worker + its shared
      // chunk served as plain static assets (public/maplibre-gl-worker.mjs,
      // public/maplibre-gl-shared.mjs) sidesteps the bundler entirely.
      setWorkerUrl("/maplibre-gl-worker.mjs");

      const map = new Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [centerLng, centerLat],
        zoom: 12,
      });
      map.addControl(new NavigationControl(), "top-right");
      mapRef.current = map;

      for (const spot of foodSpots) {
        const el = document.createElement("div");
        el.className =
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md";
        el.style.backgroundColor = PRICE_RANGE_COLOR[spot.priceRange];
        el.style.fontSize = "16px";
        el.textContent = "🍽️";

        const popupHtml = `
          <div class="p-1">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900">${escapeHtml(spot.name)}</h3>
              <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">${escapeHtml(spot.priceRange)}</span>
            </div>
            <p class="mt-1 text-sm text-slate-600">${escapeHtml(spot.description)}</p>
            ${spot.cuisineNote ? `<p class="mt-1 text-xs font-medium text-indigo-600">${escapeHtml(spot.cuisineNote)}</p>` : ""}
          </div>
        `;

        new Marker({ element: el })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(new Popup({ offset: 20 }).setHTML(popupHtml))
          .addTo(map);
      }

      // Frame all food spots on first paint instead of a fixed zoom, so
      // outlying spots (e.g. a market in outer London) aren't cropped out
      // of view just because the city center was used as the initial camera.
      if (foodSpots.length > 0) {
        const lngs = foodSpots.map((s) => s.lng).concat(centerLng);
        const lats = foodSpots.map((s) => s.lat).concat(centerLat);
        const bounds: LngLatBoundsLike = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ];
        map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 });
      }
    }).catch((err) => console.error("Failed to initialize map:", err));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init only when destination changes
  }, [destCountry]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
    />
  );
}
