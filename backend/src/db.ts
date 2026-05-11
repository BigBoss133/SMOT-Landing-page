import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'smot.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      key TEXT UNIQUE NOT NULL,
      plan TEXT NOT NULL CHECK(plan IN ('monthly', 'annual', 'trial')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      trial_used INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      license_id TEXT REFERENCES licenses(id),
      stripe_session_id TEXT UNIQUE,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'eur',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'refunded')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
    CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
  `);
  console.log('[DB] Initialized');
}

export default db;
