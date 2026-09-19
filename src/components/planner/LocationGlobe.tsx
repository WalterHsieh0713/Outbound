"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

// react-globe.gl touches `window` at import time, so it is browser-only.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRY_POLYGONS_URL = "/globe/countries-110m.geojson";
const WORLD_VIEW = { lat: 42, lng: -38, altitude: 2.4 };
const REGION_VIEW = { lat: 52.6, lng: -1.8, altitude: 0.42 };
const FLY_IN_MS = 2800;

const ADMIN_TO_KEY: Record<string, string> = { "United States of America": "USA" };

interface GlobeInstance {
  controls: () => { autoRotate: boolean };
  pointOfView: (coords: { lat: number; lng: number; altitude: number }, durationMs?: number) => void;
}

interface Props {
  destAdminName: string;
  cityName: string;
  center: { lat: number; lng: number };
  origin: { lat: number; lng: number };
  width: number;
  height: number;
  /** "region" flies in over the destination; "world" pulls back to the full globe */
  target: "region" | "world";
  onArrived: () => void;
}

/** The 3D globe: starts over the Atlantic with a US -> destination arc, then descends onto the destination. */
export function LocationGlobe({ destAdminName, cityName, center, origin, width, height, target, onArrived }: Props) {
  const globeRef = useRef<GlobeInstance | undefined>(undefined);
  const arrivedRef = useRef(onArrived);
  const [ready, setReady] = useState(false);
  const [countries, setCountries] = useState<object[]>([]);

  useEffect(() => {
    arrivedRef.current = onArrived;
  }, [onArrived]);

  useEffect(() => {
    fetch(COUNTRY_POLYGONS_URL)
      .then((r) => r.json())
      .then((gj) => setCountries(gj.features ?? []))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = false;
    g.pointOfView(WORLD_VIEW, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const g = globeRef.current;
    if (!g) return;
    if (target === "world") {
      g.pointOfView(WORLD_VIEW, 1800);
      return;
    }
    const start = setTimeout(() => g.pointOfView(REGION_VIEW, FLY_IN_MS), 500);
    const arrive = setTimeout(() => arrivedRef.current(), 500 + FLY_IN_MS + 100);
    return () => {
      clearTimeout(start);
      clearTimeout(arrive);
    };
  }, [ready, target]);

  const arcs = useMemo(
    () => [{ startLat: origin.lat, startLng: origin.lng, endLat: center.lat, endLng: center.lng }],
    [origin.lat, origin.lng, center.lat, center.lng]
  );
  const cityMarker = useMemo(() => [{ lat: center.lat, lng: center.lng }], [center.lat, center.lng]);

  return (
    <Globe
      // @ts-expect-error - react-globe.gl has no bundled TS types for the ref instance
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere
      atmosphereColor="#818cf8"
      atmosphereAltitude={0.15}
      polygonsData={countries}
      polygonCapColor={(f: object) => {
        const admin = (f as { properties?: { ADMIN?: string } }).properties?.ADMIN ?? "";
        const key = ADMIN_TO_KEY[admin] ?? admin;
        if (key === destAdminName) return "#4f46e5";
        if (key === "USA") return "#b45309";
        return "#1e293b";
      }}
      polygonSideColor={() => "rgba(0,0,0,0.15)"}
      polygonStrokeColor={() => "#334155"}
      polygonAltitude={0.006}
      arcsData={arcs}
      arcColor={() => ["#f59e0b", "#818cf8"]}
      arcStroke={0.5}
      arcAltitudeAutoScale={0.45}
      arcDashLength={0.4}
      arcDashGap={0.25}
      arcDashAnimateTime={2600}
      ringsData={cityMarker}
      ringLat="lat"
      ringLng="lng"
      ringColor={() => (t: number) => `rgba(255, 255, 255, ${0.9 * (1 - t)})`}
      ringMaxRadius={1.2}
      ringPropagationSpeed={1}
      ringRepeatPeriod={1400}
      htmlElementsData={cityMarker}
      htmlLat="lat"
      htmlLng="lng"
      htmlAltitude={0.02}
      htmlElement={() => {
        const root = document.createElement("div");
        const tag = document.createElement("div");
        tag.textContent = `📍 ${cityName}`;
        Object.assign(tag.style, {
          transform: "translate(-50%, -160%)",
          padding: "3px 9px",
          borderRadius: "9999px",
          background: "rgba(15,23,42,0.9)",
          color: "#f8fafc",
          font: "700 12px system-ui, sans-serif",
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.35)",
        } satisfies Partial<CSSStyleDeclaration>);
        root.appendChild(tag);
        return root;
      }}
      onGlobeReady={() => setReady(true)}
    />
  );
}
