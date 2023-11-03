import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";

export async function dbInit(createTableQuery?: string) {
  const db = await sqlite.open({
    filename: ":memory:",
    driver: sqlite3.Database,
  });

  if (createTableQuery) {
    await db.exec(createTableQuery);
  }
  return db;
}
