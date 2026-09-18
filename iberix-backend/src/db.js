import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'iberix.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     TEXT,
    role          TEXT DEFAULT 'user',
    is_verified   INTEGER DEFAULT 0,
    created_date  TEXT DEFAULT (datetime('now')),
    updated_date  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    id            TEXT PRIMARY KEY,
    company       TEXT NOT NULL,
    contact_name  TEXT NOT NULL,
    email         TEXT NOT NULL,
    region        TEXT DEFAULT 'Global',
    service       TEXT DEFAULT 'Multiple',
    scope         TEXT,
    status        TEXT DEFAULT 'new',
    created_by_id TEXT,
    created_date  TEXT DEFAULT (datetime('now')),
    updated_date  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS otp_codes (
    id           TEXT PRIMARY KEY,
    email        TEXT NOT NULL,
    code         TEXT NOT NULL,
    expires_at   TEXT NOT NULL,
    used         INTEGER DEFAULT 0,
    created_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reset_tokens (
    id           TEXT PRIMARY KEY,
    email        TEXT NOT NULL,
    token        TEXT UNIQUE NOT NULL,
    expires_at   TEXT NOT NULL,
    used         INTEGER DEFAULT 0,
    created_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id           TEXT PRIMARY KEY,
    session_id   TEXT NOT NULL,
    otp_code     TEXT,
    purpose      TEXT DEFAULT 'otp',
    expires_at   TEXT NOT NULL,
    used         INTEGER DEFAULT 0,
    created_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    id              TEXT PRIMARY KEY,
    public_settings TEXT DEFAULT '{}'
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
  CREATE INDEX IF NOT EXISTS idx_admin_session ON admin_sessions(session_id);
`);

// Seed app settings
const settings = db.prepare('SELECT id FROM app_settings LIMIT 1').get();
if (!settings) {
  db.prepare('INSERT INTO app_settings (id, public_settings) VALUES (?, ?)').run('singleton', JSON.stringify({ is_public: true }));
}

export { db };