import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

type Schema = typeof schema;

// db is null when DATABASE_URL is not set — routes handle this gracefully
let _pool: pg.Pool | null = null;
let _db: NodePgDatabase<Schema> | null = null;

if (process.env.DATABASE_URL) {
  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(_pool, { schema });
}

export const pool = _pool;
export const db = _db;

export * from "./schema";
