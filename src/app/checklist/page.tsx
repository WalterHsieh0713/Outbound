"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDeviceId } from "@/lib/deviceId";
import { buildChecklist, supportedDestinations } from "@/lib/checklist";
import type { ChecklistEntry, DestCountry } from "@/types";

const CATEGORY_META: Record<
  ChecklistEntry["category"],
  { label: string; icon: string; chip: string }
> = {
  visa: { label: "Visa", icon: "🛂", chip: "bg-indigo-100 text-indigo-700" },
  health: { label: "Health", icon: "💉", chip: "bg-emerald-100 text-emerald-700" },
  insurance: { label: "Insurance", icon: "🛡️", chip: "bg-sky-100 text-sky-700" },
  housing: { label: "Housing", icon: "🏠", chip: "bg-amber-100 text-amber-700" },
  academic: { label: "Academic", icon: "🎓", chip: "bg-purple-100 text-purple-700" },
  banking: { label: "Banking", icon: "🏦", chip: "bg-rose-100 text-rose-700" },
};

function urgencyStyle(daysRemaining: number, completed: boolean) {
  if (completed) {
    return { border: "border-l-slate-300", stat: "text-slate-400" };
  }
  if (daysRemaining < 0) return { border: "border-l-red-500", stat: "text-red-600" };
  if (daysRemaining <= 14) return { border: "border-l-orange-500", stat: "text-orange-600" };
  if (daysRemaining <= 45) return { border: "border-l-amber-500", stat: "text-amber-600" };
  return { border: "border-l-emerald-500", stat: "text-emerald-600" };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fieldClasses() {
  return "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
}

function ChecklistPageInner() {
  const searchParams = useSearchParams();
  const requestedDest = searchParams.get("dest");
  const initialDest =
    supportedDestinations.find((d) => d === requestedDest) ??
    supportedDestinations[0];

  const [destCountry, setDestCountry] = useState<DestCountry>(initialDest);
  const [startDate, setStartDate] = useState<string>("");
  const [submittedStartDate, setSubmittedStartDate] = useState<string | null>(
    null
  );
  // Lazy initializer (not an effect) so we don't cause an extra render —
  // guarded by typeof window since this still renders once on the server.
  const [deviceId] = useState<string | null>(() =>
    typeof window === "undefined" ? null : getDeviceId()
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Recompute "now" periodically so days-remaining stays accurate across a
  // long-open tab without requiring a full page reload.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const entries = useMemo<ChecklistEntry[]>(() => {
    if (!submittedStartDate) return [];
    return buildChecklist(
      "USA",
      destCountry,
      new Date(submittedStartDate),
      completedIds,
      now
    );
  }, [destCountry, submittedStartDate, completedIds, now]);

  const completedCount = entries.filter((e) => e.completed).length;
  const progressPct =
    entries.length === 0 ? 0 : Math.round((completedCount / entries.length) * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !deviceId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/checklist-status?deviceId=${encodeURIComponent(deviceId)}`
      );
      const data = await res.json();
      setCompletedIds(new Set<string>(data.completedIds ?? []));
      setSubmittedStartDate(startDate);
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompleted(requirementId: string, completed: boolean) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (completed) next.add(requirementId);
      else next.delete(requirementId);
      return next;
    });
    if (!deviceId) return;
    await fetch("/api/checklist-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, requirementId, completed }),
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Build your requirement checklist
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Pick your destination and program start date — we&apos;ll turn real
          visa, health, insurance, housing, academic, and banking requirements
          into deadlines you can actually act on.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Origin
            </label>
            <select disabled value="USA" className={`${fieldClasses()} bg-slate-100 text-slate-500`}>
              <option value="USA">United States</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Destination
            </label>
            <select
              value={destCountry}
              onChange={(e) => setDestCountry(e.target.value as DestCountry)}
              className={fieldClasses()}
            >
              {supportedDestinations.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Program start date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={fieldClasses()}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !deviceId}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Loading…" : "Build my checklist"}
        </button>
      </form>

      {submittedStartDate && (
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{destCountry}</h2>
              <p className="text-sm text-slate-500">
                Program starts {formatDate(submittedStartDate)}
              </p>
            </div>
            {entries.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-sm font-semibold text-slate-600">
                  {completedCount}/{entries.length} done
                </span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {entries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No requirement data loaded yet for this destination — the full
              dataset is still being filled in.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {entries.map((entry) => {
                const meta = CATEGORY_META[entry.category];
                const style = urgencyStyle(entry.daysRemaining, entry.completed);
                const statLabel =
                  entry.daysRemaining < 0
                    ? "overdue"
                    : entry.daysRemaining === 0
                      ? "today"
                      : "days left";

                return (
                  <li
                    key={entry.id}
                    className={`flex items-start gap-4 rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${style.border} ${
                      entry.completed ? "opacity-60" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={entry.completed}
                      onChange={(e) => toggleCompleted(entry.id, e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.chip}`}
                        >
                          <span aria-hidden>{meta.icon}</span>
                          {meta.label}
                        </span>
                        {entry.isHardDeadline && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                            ⚠ Hard deadline
                          </span>
                        )}
                      </div>

                      <h3
                        className={`mt-1.5 font-semibold text-slate-900 ${
                          entry.completed ? "text-slate-400 line-through" : ""
                        }`}
                      >
                        {entry.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm leading-relaxed ${
                          entry.completed ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {entry.description}
                      </p>
                      <div className="mt-2 text-xs text-slate-400">
                        Deadline: {formatDate(entry.deadlineDate)}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end pl-2 text-right">
                      <span className={`text-xl font-extrabold tabular-nums ${style.stat}`}>
                        {Math.abs(entry.daysRemaining)}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {statLabel}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={null}>
      <ChecklistPageInner />
    </Suspense>
  );
}
