import Database from "better-sqlite3";
import path from "node:path";

// AbroadReady persistence layer.
//
// Only two things in this app are actually user-written, mutable data:
//   1. Which checklist items a device has checked off (checklist_status)
//   2. Peer-matcher submissions (peer_profiles)
// Everything else (requirement definitions, cost-of-living figures,
// emergency-contact info) is static researched reference data that lives in
// src/data/*.ts and never touches the database — see that directory's
// comments for sourcing notes.
//
// better-sqlite3 is synchronous, which is fine (and simplest) inside Next.js
// Route Handlers / Server Components — no connection pooling needed for a
// single local file during a hackathon demo.

const DB_PATH = path.join(process.cwd(), "data", "abroadready.db");

declare global {
  var __abroadReadyDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS checklist_status (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id      TEXT NOT NULL,
      requirement_id TEXT NOT NULL,
      completed      INTEGER NOT NULL DEFAULT 0,
      completed_at   TEXT,
      updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(device_id, requirement_id)
    );
    CREATE INDEX IF NOT EXISTS idx_checklist_status_device
      ON checklist_status(device_id);

    CREATE TABLE IF NOT EXISTS peer_profiles (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id            TEXT NOT NULL,
      name                 TEXT NOT NULL,
      destination_country  TEXT NOT NULL,
      university           TEXT NOT NULL,
      program_term         TEXT NOT NULL,
      created_at           TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_peer_profiles_match
      ON peer_profiles(destination_country, program_term);
  `);
  return db;
}

// Reuse a single connection across hot-reloads in dev (Next.js dev server
// re-evaluates modules on change; without this each reload would open a
// new file handle).
export const db = globalThis.__abroadReadyDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalThis.__abroadReadyDb = db;
}
