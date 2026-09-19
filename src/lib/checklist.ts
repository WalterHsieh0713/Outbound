import { requirements } from "@/data/requirements";
import type { ChecklistEntry, DestCountry, OriginCountry } from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Pure, deterministic checklist builder — no LLM, no network call.
 * Looks up the static requirement set for (originCountry, destCountry),
 * computes each item's real calendar deadline by subtracting leadTimeDays
 * from the program start date, and sorts by urgency: incomplete items first
 * (soonest deadline first), completed items sink to the bottom.
 */
export function buildChecklist(
  originCountry: OriginCountry,
  destCountry: DestCountry,
  programStartDate: Date,
  completedIds: ReadonlySet<string>,
  now: Date = new Date()
): ChecklistEntry[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const matching = requirements.filter(
    (r) => r.originCountry === originCountry && r.destCountry === destCountry
  );

  const entries: ChecklistEntry[] = matching.map((r) => {
    const deadline = new Date(programStartDate);
    deadline.setHours(0, 0, 0, 0);
    deadline.setDate(deadline.getDate() - r.leadTimeDays);

    const daysRemaining = Math.round(
      (deadline.getTime() - today.getTime()) / MS_PER_DAY
    );

    return {
      ...r,
      deadlineDate: deadline.toISOString().slice(0, 10),
      daysRemaining,
      completed: completedIds.has(r.id),
    };
  });

  entries.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.daysRemaining - b.daysRemaining;
  });

  return entries;
}

export const supportedDestinations: DestCountry[] = [
  "United Kingdom",
  "Japan",
  "Germany",
];
