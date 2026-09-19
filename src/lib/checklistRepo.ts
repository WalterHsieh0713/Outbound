import { db } from "@/lib/db";

interface ChecklistStatusRow {
  requirementId: string;
  completed: number;
}

export function getCompletedRequirementIds(deviceId: string): Set<string> {
  const rows = db
    .prepare(
      `SELECT requirement_id as requirementId, completed
       FROM checklist_status WHERE device_id = ?`
    )
    .all(deviceId) as ChecklistStatusRow[];
  return new Set(rows.filter((r) => r.completed === 1).map((r) => r.requirementId));
}

export function setChecklistStatus(
  deviceId: string,
  requirementId: string,
  completed: boolean
): void {
  db.prepare(
    `INSERT INTO checklist_status (device_id, requirement_id, completed, completed_at, updated_at)
     VALUES (@deviceId, @requirementId, @completed, @completedAt, datetime('now'))
     ON CONFLICT(device_id, requirement_id) DO UPDATE SET
       completed = @completed,
       completed_at = @completedAt,
       updated_at = datetime('now')`
  ).run({
    deviceId,
    requirementId,
    completed: completed ? 1 : 0,
    completedAt: completed ? new Date().toISOString() : null,
  });
}
