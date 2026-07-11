import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * SQLite persistence layer. A single file database keeps the whole SaaS
 * self-contained (no external services needed) while remaining easy to
 * migrate to Postgres later — all access goes through the typed query
 * helpers in lib/queries.ts.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  // Reuse the connection across dev hot-reloads.
  var __mehfilDb: Database.Database | undefined;
}

function createDb(): Database.Database {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
      credits       INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id            TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind          TEXT NOT NULL CHECK (kind IN ('actor','product','receipt')),
      original_name TEXT NOT NULL,
      mime          TEXT NOT NULL,
      size          INTEGER NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS credit_transactions (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      delta      INTEGER NOT NULL,
      reason     TEXT NOT NULL,
      ref_type   TEXT,
      ref_id     TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS payment_requests (
      id                TEXT PRIMARY KEY,
      user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id        TEXT NOT NULL,
      credits           INTEGER NOT NULL,
      amount_pkr        INTEGER NOT NULL,
      method            TEXT NOT NULL,
      reference         TEXT NOT NULL,
      receipt_upload_id TEXT REFERENCES uploads(id),
      status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
      admin_note        TEXT,
      created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      resolved_at       TEXT
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id            TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name          TEXT NOT NULL,
      product_name  TEXT NOT NULL,
      actor_source  TEXT NOT NULL CHECK (actor_source IN ('upload','preset')),
      actor_upload_id TEXT REFERENCES uploads(id),
      actor_preset  TEXT,
      storyline     TEXT NOT NULL,
      script        TEXT NOT NULL,
      output_type   TEXT NOT NULL CHECK (output_type IN ('video','image')),
      aspect_ratio  TEXT NOT NULL DEFAULT '9:16',
      quantity      INTEGER NOT NULL,
      credits_cost  INTEGER NOT NULL,
      status        TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','completed','partial','failed')),
      created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS campaign_products (
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      upload_id   TEXT NOT NULL REFERENCES uploads(id),
      PRIMARY KEY (campaign_id, upload_id)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id                  TEXT PRIMARY KEY,
      campaign_id         TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      position            INTEGER NOT NULL,
      kind                TEXT NOT NULL CHECK (kind IN ('video','image')),
      status              TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','completed','failed')),
      provider_request_id TEXT,
      status_url          TEXT,
      result_url          TEXT,
      error               TEXT,
      created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_tx_user ON credit_transactions(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_requests(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_jobs_campaign ON jobs(campaign_id, position);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
  `);
}

export function getDb(): Database.Database {
  if (!globalThis.__mehfilDb) {
    globalThis.__mehfilDb = createDb();
  }
  return globalThis.__mehfilDb;
}

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
