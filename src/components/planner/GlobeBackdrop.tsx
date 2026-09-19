"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

// react-globe.gl touches `window` at import time, so it is browser-only.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRY_POLYGONS_URL = "/globe/countries-110m.geojson";
const WORLD_VIEW = { lat: 24, lng: -30, altitude: 1.9 };
const REGION_VIEW = { lat: 52.4, lng: -1.8, altitude: 0.42 };
const FLY_IN_MS = 2800;
const ADMIN_TO_KEY: Record<string, string> = { "United States of America": "USA" };

interface GlobeInstance {
  controls: () => { autoRotate: boolean; autoRotateSpeed: number };
  pointOfView: (coords: { lat: number; lng: number; altitude: number }, durationMs?: number) => void;
}

interface Props {
  destAdminName: string;
  cityName: string;
  center: { lat: number; lng: number };
  origin: { lat: number; lng: number };
  /** "world" spins slowly; "region" flies in from the US onto the destination */
  mode: "world" | "region";
  onArrived: () => void;
}

/** Full-screen 3D globe that sits behind the whole planner and reacts to the current step. */
export function GlobeBackdrop({ destAdminName, cityName, center, origin, mode, onArrived }: Props) {
  const globeRef = useRef<GlobeInstance | undefined>(undefined);
  const arrivedRef = useRef(onArrived);
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const [countries, setCountries] = useState<object[]>([]);
  const [size, setSize] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    arrivedRef.current = onArrived;
  }, [onArrived]);

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    fetch(COUNTRY_POLYGONS_URL)
      .then((r) => r.json())
      .then((gj) => setCountries(gj.features ?? []))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!ready) return;
    globeRef.current?.pointOfView(WORLD_VIEW, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls();

    if (mode === "world") {
      g.pointOfView(WORLD_VIEW, 1600);
      const spin = setTimeout(() => {
        controls.autoRotateSpeed = 0.55;
        controls.autoRotate = true;
      }, 1600);
      return () => clearTimeout(spin);
    }

    controls.autoRotate = false;
    const start = setTimeout(() => g.pointOfView(REGION_VIEW, FLY_IN_MS), 350);
    const arrive = setTimeout(() => {
      setLanded(true);
      arrivedRef.current();
    }, 350 + FLY_IN_MS + 100);
    return () => {
      clearTimeout(start);
      clearTimeout(arrive);
      setLanded(false);
    };
  }, [ready, mode]);

  const arcs = useMemo(
    () => [{ startLat: origin.lat, startLng: origin.lng, endLat: center.lat, endLng: center.lng }],
    [origin.lat, origin.lng, center.lat, center.lng]
  );
  const cityMarker = useMemo(() => [{ lat: center.lat, lng: center.lng }], [center.lat, center.lng]);

  return (
    <Globe
      // @ts-expect-error - react-globe.gl has no bundled TS types for the ref instance
      ref={globeRef}
      width={size.w}
      height={size.h}
      backgroundColor="rgba(0,0,0,0)"
      enablePointerInteraction={false}
      showAtmosphere
      atmosphereColor="#3b82f6"
      atmosphereAltitude={0.22}
      polygonsData={countries}
      polygonCapColor={(f: object) => {
        const admin = (f as { properties?: { ADMIN?: string } }).properties?.ADMIN ?? "";
        const key = ADMIN_TO_KEY[admin] ?? admin;
        if (key === destAdminName) return "#1d4ed8";
        if (key === "USA") return "#334155";
        return "#111827";
      }}
      polygonSideColor={() => "rgba(0,0,0,0)"}
      polygonStrokeColor={() => "rgba(148,163,184,0.35)"}
      polygonAltitude={0.006}
      arcsData={landed ? [] : arcs}
      arcColor={() => ["#f59e0b", "#60a5fa"]}
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
      htmlElementsData={mode === "region" ? cityMarker : []}
      htmlLat="lat"
      htmlLng="lng"
      htmlAltitude={0.02}
      htmlElement={() => {
        const root = document.createElement("div");
        const tag = document.createElement("div");
        tag.textContent = cityName;
        Object.assign(tag.style, {
          transform: "translate(-50%, -160%)",
          padding: "3px 10px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(10px)",
          color: "#ffffff",
          font: "600 12px system-ui, sans-serif",
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.3)",
        } satisfies Partial<CSSStyleDeclaration>);
        root.appendChild(tag);
        return root;
      }}
      onGlobeReady={() => setReady(true)}
    />
  );
}
