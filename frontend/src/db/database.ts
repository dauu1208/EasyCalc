import type { SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      food TEXT NOT NULL,
      unit TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      entries_json TEXT NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}