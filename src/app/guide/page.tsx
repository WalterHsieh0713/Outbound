import Link from "next/link";
import { planningSteps } from "@/data/studyAbroadProcess";
import { programTypes } from "@/data/programTypes";
import { programCostRanges } from "@/data/programCosts";
import { housingOptions } from "@/data/housingOptions";
import { majorDestinationGuides } from "@/data/majorDestinations";
import { exchangePartners } from "@/data/exchangePartners";
import { generalLogisticsItems } from "@/data/generalLogistics";
import { destinationMeta } from "@/data/destinationMeta";

function formatUsd(amount: number): string {
  const sign = amount < 0 ? "-" : "+";
  return `${sign}$${Math.abs(amount).toLocaleString()}`;
}

const LEVEL_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  varies: "Varies",
};

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Planning Guide
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          General study-abroad planning knowledge — program types, costs,
          housing, and which destinations fit which majors — sourced from
          Carnegie Mellon&apos;s study-abroad office and external research.
        </p>
      </header>

      {/* General process */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          The general process
        </h2>
        <ol className="mt-3 flex flex-col gap-3">
          {planningSteps.map((step) => (
            <li
              key={step.order}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {step.order}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Program types */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Program types
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {programTypes.map((type) => (
            <div key={type.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{type.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{type.description}</p>
              <p className="mt-2 text-xs font-medium text-indigo-600">{type.costModel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost ranges */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          What it costs
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {programCostRanges.map((range) => {
            const type = programTypes.find((t) => t.id === range.programType);
            return (
              <div
                key={range.programType}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{type?.name ?? range.programType}</h3>
                  <span className="text-sm font-bold text-slate-900">
                    {range.lowUsd === 0 && range.highUsd === 0
                      ? "Varies by institution"
                      : range.lowUsd < 0
                        ? `${formatUsd(range.lowUsd)} to ${formatUsd(range.highUsd)}`
                        : `$${range.lowUsd.toLocaleString()}–$${range.highUsd.toLocaleString()}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{range.perTerm}</p>
                <p className="mt-2 text-sm text-slate-600">{range.notes}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Housing */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Where you&apos;ll live
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="p-3">Option</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Immersion</th>
                <th className="p-3">Independence</th>
              </tr>
            </thead>
            <tbody>
              {housingOptions.map((option) => (
                <tr key={option.id} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{option.name}</div>
                    <div className="mt-1 max-w-xs text-xs text-slate-500">{option.description}</div>
                  </td>
                  <td className="p-3 text-slate-600">{LEVEL_LABEL[option.costLevel]}</td>
                  <td className="p-3 text-slate-600">{LEVEL_LABEL[option.immersionLevel]}</td>
                  <td className="p-3 text-slate-600">{LEVEL_LABEL[option.independenceLevel]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Destinations by major */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Best destinations by major
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {majorDestinationGuides.map((guide) => {
            const meta = guide.supportedDestCountry
              ? destinationMeta.find((d) => d.destCountry === guide.supportedDestCountry)
              : undefined;
            return (
              <div
                key={guide.major}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{guide.major}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    {guide.countries.join(", ")}
                  </span>{" "}
                  — {guide.reason}
                </p>
                {meta && (
                  <Link
                    href={`/destinations/${meta.slug}`}
                    className="mt-2 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Explore {meta.destCountry} in AbroadReady →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CMU exchange partners */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          CMU exchange partners (reference)
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="p-3">Country</th>
                <th className="p-3">University</th>
                <th className="p-3">City</th>
              </tr>
            </thead>
            <tbody>
              {exchangePartners.map((partner) => (
                <tr key={partner.university} className="border-b border-slate-100 last:border-0">
                  <td className="p-3 text-slate-600">{partner.country}</td>
                  <td className="p-3 font-medium text-slate-900">{partner.university}</td>
                  <td className="p-3 text-slate-600">{partner.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Before you go */}
      <section className="mt-10 mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Before you go
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {generalLogisticsItems.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
