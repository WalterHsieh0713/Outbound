"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { destinationMeta, originMeta } from "@/data/destinationMeta";

// react-globe.gl touches `window` at import time (it's a thin wrapper around
// three.js), so it can only ever run in the browser — ssr:false keeps Next.js
// from trying to render it on the server.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Country borders, copied locally into /public/globe (from three-globe's
// bundled Natural Earth 110m dataset) rather than pulled from a CDN, so the
// globe still renders with no internet connection during a live demo.
const COUNTRY_POLYGONS_URL = "/globe/countries-110m.geojson";

// The bundled GeoJSON's `ADMIN` property uses full country names — only the
// origin needs mapping since the 3 destination names already match exactly.
const ADMIN_NAME_TO_OURS: Record<string, string> = {
  "United States of America": "USA",
};

const DESTINATION_COLOR = "#818cf8";
const ORIGIN_COLOR = "#f59e0b";
const NEUTRAL_COUNTRY_COLOR = "#1e293b";

const destinationCountryNames = new Set(destinationMeta.map((d) => d.destCountry));

// NOTE: three-globe's text-label layer renders 3D lit mesh text (old
// TextGeometry-style, MeshLambertMaterial) rather than canvas sprites — it
// turned out invisible/unreliable under our lighting setup and wasn't worth
// fighting for a demo. Destination names are legible instead via the hover
// tooltip (pointLabel) and the always-visible pill row under the globe.

interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
  color: string;
  size: number;
  slug?: string;
}

interface GlobeRing {
  lat: number;
  lng: number;
  color: string;
}

interface CountryFeature {
  properties: { ADMIN: string };
}

// Minimal shape of the globe.gl controls object we actually touch —
// react-globe.gl doesn't ship types for its imperative ref API.
interface GlobeControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
}
interface GlobeInstance {
  controls: () => GlobeControls;
  pointOfView: (
    coords: { lat: number; lng: number; altitude: number },
    durationMs?: number
  ) => void;
}

function getCountryFillColor(feature: object): string {
  const admin = (feature as CountryFeature).properties?.ADMIN;
  const label = ADMIN_NAME_TO_OURS[admin] ?? admin;
  if (destinationCountryNames.has(label as never)) return DESTINATION_COLOR;
  if (label === originMeta.destCountry) return ORIGIN_COLOR;
  return NEUTRAL_COUNTRY_COLOR;
}

export function DestinationGlobe() {
  const router = useRouter();
  const globeRef = useRef<GlobeInstance | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const [size, setSize] = useState(420);
  const [ready, setReady] = useState(false);
  const [countryPolygons, setCountryPolygons] = useState<object[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setSize(Math.min(width, 560));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetched as a static asset (not statically imported) so its ~480KB stays
  // out of this component's JS bundle — see plan notes on GeoJSON loading.
  useEffect(() => {
    fetch(COUNTRY_POLYGONS_URL)
      .then((r) => r.json())
      .then((gj) => setCountryPolygons(gj.features ?? []))
      .catch(() => setCountryPolygons([]));
  }, []);

  const points: GlobePoint[] = useMemo(() => {
    const destPoints: GlobePoint[] = destinationMeta.map((d) => ({
      lat: d.lat,
      lng: d.lng,
      label: `${d.flagEmoji} ${d.destCountry} — click to explore`,
      color: DESTINATION_COLOR,
      size: 2.2,
      slug: d.slug,
    }));
    const origin: GlobePoint = {
      lat: originMeta.lat,
      lng: originMeta.lng,
      label: `${originMeta.flagEmoji} United States (origin)`,
      color: ORIGIN_COLOR,
      size: 1.4,
    };
    return [...destPoints, origin];
  }, []);

  // Pulsing highlight rings on each clickable destination (skips the
  // origin) — a simple additive ring mesh, unlike the text layer this
  // renders reliably with no lighting dependency.
  const rings: GlobeRing[] = useMemo(
    () =>
      destinationMeta.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        color: DESTINATION_COLOR,
      })),
    []
  );

  useEffect(() => {
    if (!ready) return;
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = true;
    g.controls().autoRotateSpeed = 0.5;
    // Frames the US + UK + Germany cluster on first paint; Japan comes into
    // view as the globe auto-rotates or the user drags.
    g.pointOfView({ lat: 40, lng: -35, altitude: 2.0 }, 0);
  }, [ready, size]);

  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as GlobePoint;
      if (!p.slug || navigatingRef.current) return;
      navigatingRef.current = true;

      const g = globeRef.current;
      if (g) {
        g.controls().autoRotate = false;
        // Animated zoom toward the clicked country before navigating.
        // react-globe.gl's pointOfView has no completion callback (it's
        // void-returning per its typings), so a setTimeout tuned just under
        // the animation duration is the only sequencing option available.
        g.pointOfView({ lat: p.lat, lng: p.lng, altitude: 0.35 }, 1200);
      }
      setTimeout(() => router.push(`/destinations/${p.slug}`), 1100);
    },
    [router]
  );

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-[560px]">
      <Globe
        // @ts-expect-error - react-globe.gl has no bundled TS types for the ref instance
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere
        atmosphereColor="#818cf8"
        atmosphereAltitude={0.15}
        polygonsData={countryPolygons}
        polygonCapColor={getCountryFillColor}
        polygonSideColor={() => "rgba(0,0,0,0.15)"}
        polygonStrokeColor={() => "#1e293b"}
        polygonAltitude={0.01}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.015}
        pointRadius="size"
        pointLabel="label"
        onPointClick={handlePointClick}
        pointsMerge={false}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t: number) => `rgba(99, 102, 241, ${1 - t})`}
        ringMaxRadius={4}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={2200}
        onGlobeReady={() => setReady(true)}
      />
    </div>
  );
}
