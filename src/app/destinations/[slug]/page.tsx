import Link from "next/link";
import { notFound } from "next/navigation";
import { destinationMeta, getDestinationMetaBySlug } from "@/data/destinationMeta";
import { oneTimeCosts } from "@/data/costOfLiving";
import { requirements } from "@/data/requirements";
import { convertToUsd } from "@/data/exchangeRates";
import { getFoodSpotsByDestination } from "@/data/foodSpots";
import { CityFoodMap } from "@/components/CityFoodMap";

export function generateStaticParams() {
  return destinationMeta.map((d) => ({ slug: d.slug }));
}

function usd(amountLocal: number, currencyCode: string): string {
  return `$${Math.round(convertToUsd(amountLocal, currencyCode)).toLocaleString()}`;
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getDestinationMetaBySlug(slug);
  if (!meta) notFound();

  const setup = oneTimeCosts.find((c) => c.destCountry === meta.destCountry);
  const destRequirements = requirements.filter(
    (r) => r.destCountry === meta.destCountry
  );
  const visaRequirement = destRequirements.find((r) => r.category === "visa");
  const foodSpots = getFoodSpotsByDestination(meta.destCountry);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        ← Back to globe
      </Link>

      <header className="mt-4 flex items-center gap-4">
        <span aria-hidden className="text-5xl">
          {meta.flagEmoji}
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {meta.destCountry}
          </h1>
          <p className="text-sm text-slate-500">Primary city: {meta.capitalCity}</p>
        </div>
      </header>

      <p className="mt-4 max-w-xl text-slate-600">{meta.blurb}</p>

      {setup && (
        <p className="mt-4 text-sm text-slate-500">
          Visa {usd(setup.visaFeeLocal, setup.visaFeeCurrency)} · Flight $
          {setup.flightCostUsdLow}–${setup.flightCostUsdHigh} · Insurance{" "}
          {usd(setup.insurancePremiumMonthlyLocal, setup.insurancePremiumCurrency)}/mo
        </p>
      )}

      {visaRequirement && (
        <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-700">
            Start here: {visaRequirement.title}
          </h2>
          <p className="mt-1 text-sm text-slate-700">{visaRequirement.description}</p>
          <p className="mt-2 text-xs font-semibold text-indigo-600">
            Plan to start ~{visaRequirement.leadTimeDays} days before departure
          </p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Where to eat in {meta.capitalCity}
        </h2>
        <CityFoodMap
          destCountry={meta.destCountry}
          centerLat={meta.lat}
          centerLng={meta.lng}
          foodSpots={foodSpots}
        />
      </div>

      <Link
        href={`/checklist?dest=${encodeURIComponent(meta.destCountry)}`}
        className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Build my full {meta.destCountry} checklist →
      </Link>
    </main>
  );
}
