import Link from "next/link";
import { DestinationGlobe } from "@/components/DestinationGlobe";
import { destinationMeta } from "@/data/destinationMeta";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        AbroadReady
      </h1>
      <p className="mt-3 max-w-md text-lg text-slate-600">
        Click a destination on the globe to see what it&apos;s actually like
        to move there — visa, cost of living, and emergency info, backed by
        real sources.
      </p>

      <Link
        href="/plan/uk"
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Plan a UK semester, step by step →
      </Link>

      <div className="mt-8 w-full">
        <DestinationGlobe />
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Drag to rotate · click a dot to explore that destination
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {destinationMeta.map((d) => (
          <Link
            key={d.slug}
            href={`/destinations/${d.slug}`}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
          >
            <span aria-hidden>{d.flagEmoji}</span>
            {d.destCountry}
          </Link>
        ))}
      </div>
    </main>
  );
}
