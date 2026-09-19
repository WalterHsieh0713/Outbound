"use client";

import { useState } from "react";
import type { CityHotspot, DestCountry, Neighborhood } from "@/types";
import { requirements } from "@/data/requirements";
import { emergencyInfo } from "@/data/emergencyInfo";
import { convertToUsd } from "@/data/exchangeRates";
import { HotspotPopup } from "./HotspotPopup";

interface CityMapProps {
  destCountry: DestCountry;
  neighborhoods: Neighborhood[];
  hotspots: CityHotspot[];
  citywideMonthlyTotalUsd: number;
}

const HOTSPOT_ICONS: Record<CityHotspot["type"], string> = {
  banking: "🏦",
  academic: "🎓",
  housing: "🏠",
  "health-insurance": "🏥",
  embassy: "🏛️",
};

type Selection = { kind: "neighborhood"; id: string } | { kind: "hotspot"; id: string };

function requirementSection(id: string) {
  const req = requirements.find((r) => r.id === id);
  if (!req) return null;
  const leadTimeLine =
    req.leadTimeDays >= 0
      ? `Plan to start ~${req.leadTimeDays} days before departure`
      : `Typically done ~${-req.leadTimeDays} days after arrival`;
  return (
    <div key={id}>
      <h4 className="font-semibold text-slate-900">{req.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{req.description}</p>
      <p className="mt-2 text-xs font-semibold text-indigo-600">{leadTimeLine}</p>
    </div>
  );
}

export function CityMap({
  destCountry,
  neighborhoods,
  hotspots,
  citywideMonthlyTotalUsd,
}: CityMapProps) {
  const [budgetUsd, setBudgetUsd] = useState(citywideMonthlyTotalUsd);
  const [selection, setSelection] = useState<Selection | null>(null);

  const selectedNeighborhood =
    selection?.kind === "neighborhood"
      ? neighborhoods.find((n) => n.id === selection.id)
      : undefined;
  const selectedHotspot =
    selection?.kind === "hotspot" ? hotspots.find((h) => h.id === selection.id) : undefined;

  function neighborhoodColor(n: Neighborhood): string {
    const lowUsd = convertToUsd(n.monthlyRentLocalLow, n.currencyCode);
    const highUsd = convertToUsd(n.monthlyRentLocalHigh, n.currencyCode);
    if (budgetUsd >= highUsd) return "#22c55e";
    if (budgetUsd >= lowUsd) return "#eab308";
    return "#ef4444";
  }

  function renderHotspotContent(hotspot: CityHotspot) {
    if (hotspot.type === "embassy") {
      const info = emergencyInfo.find((e) => e.destCountry === destCountry);
      if (!info) return <p>No emergency info available for this destination.</p>;
      return (
        <dl className="space-y-3">
          <div>
            <dt className="font-semibold text-slate-900">{info.usEmbassyName}</dt>
            <dd>{info.usEmbassyAddress}</dd>
            <dd>{info.usEmbassyPhone}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Local emergency number
            </dt>
            <dd>{info.localEmergencyNumber}</dd>
          </div>
          {info.notes && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Notes
              </dt>
              <dd>{info.notes}</dd>
            </div>
          )}
        </dl>
      );
    }

    const ids = hotspot.requirementIds ?? [];
    return <div className="space-y-4">{ids.map(requirementSection)}</div>;
  }

  return (
    <div className="relative">
      <p className="text-sm text-slate-600">
        Citywide average: ~${Math.round(citywideMonthlyTotalUsd).toLocaleString()}/month — see how
        that compares by neighborhood below
      </p>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your monthly budget (USD)
        </label>
        <input
          type="number"
          value={budgetUsd}
          onChange={(e) => setBudgetUsd(Number(e.target.value) || 0)}
          className="mt-1.5 block w-full max-w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="block w-full">
          <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />
          <rect x="0" y="0" width="44" height="44" fill="#eef2ff" />
          <rect x="56" y="0" width="44" height="44" fill="#e2e8f0" />
          <rect x="0" y="56" width="44" height="44" fill="#e2e8f0" />
          <rect x="56" y="56" width="44" height="44" fill="#eef2ff" />
          <path d="M0 52 Q50 42 100 52 L100 60 Q50 50 0 60 Z" fill="#a5b4fc" opacity="0.45" />
          <rect x="41" y="0" width="18" height="100" fill="#cbd5e1" opacity="0.35" />

          {neighborhoods.map((n) => (
            <circle
              key={n.id}
              cx={n.relativeX}
              cy={n.relativeY}
              r={6}
              fill={neighborhoodColor(n)}
              stroke="white"
              strokeWidth={1}
              className="cursor-pointer"
              onClick={() => setSelection({ kind: "neighborhood", id: n.id })}
            >
              <title>{n.name}</title>
            </circle>
          ))}

          {hotspots.map((h) => {
            // Anchor label text away from the nearest map edge instead of
            // always centering it, so labels near the margins grow inward
            // rather than clipping outside the map at the container edge.
            const anchor = h.relativeX < 40 ? "start" : h.relativeX > 60 ? "end" : "middle";
            const labelX = anchor === "start" ? 6 : anchor === "end" ? -6 : 0;
            return (
              <g
                key={h.id}
                transform={`translate(${h.relativeX}, ${h.relativeY})`}
                className="cursor-pointer"
                onClick={() => setSelection({ kind: "hotspot", id: h.id })}
              >
                <circle r={5} fill="white" stroke="#4338ca" strokeWidth={1} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={5}>
                  {HOTSPOT_ICONS[h.type]}
                </text>
                <text x={labelX} y={9} textAnchor={anchor} fontSize={2.6} fill="#334155">
                  {h.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNeighborhood && (
        <HotspotPopup title={selectedNeighborhood.name} onClose={() => setSelection(null)}>
          <p>{selectedNeighborhood.vibe}</p>
          <p className="mt-2 font-semibold text-slate-900">
            $
            {Math.round(
              convertToUsd(selectedNeighborhood.monthlyRentLocalLow, selectedNeighborhood.currencyCode)
            ).toLocaleString()}
            –$
            {Math.round(
              convertToUsd(selectedNeighborhood.monthlyRentLocalHigh, selectedNeighborhood.currencyCode)
            ).toLocaleString()}
            /month
          </p>
        </HotspotPopup>
      )}

      {selectedHotspot && (
        <HotspotPopup title={selectedHotspot.label} onClose={() => setSelection(null)}>
          {renderHotspotContent(selectedHotspot)}
        </HotspotPopup>
      )}
    </div>
  );
}
