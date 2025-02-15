import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { schema } from "./schema";

let db: any = null;

export async function getDb() {
  if (db) return db;

  db = await open({
    filename: "./okr.db",
    driver: sqlite3.Database,
  });

  await db.exec(schema);
  return db;
}
