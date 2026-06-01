import { Pool } from "pg";

const isServerless = !!process.env.VERCEL;

function createPool(): Pool {
  const connectionString = process.env.PG_CONNECTION_STRING || process.env.POSTGRES_URL;

  if (connectionString) {
    return new Pool({
      connectionString,
      max: isServerless ? 1 : 10,
      idleTimeoutMillis: isServerless ? 0 : 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  const host = process.env.PG_HOST;
  const user = process.env.PG_USER;
  const password = process.env.PG_PASSWORD;
  const database = process.env.PG_DATABASE;

  if (!host || !user || !password || !database) {
    throw new Error(
      "Missing required PG env vars: PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE (or set PG_CONNECTION_STRING)"
    );
  }

  const sslConfig = process.env.PG_SSL === "true"
    ? { ssl: { rejectUnauthorized: true } }
    : {};

  return new Pool({
    host,
    user,
    password,
    database,
    max: isServerless ? 1 : 10,
    idleTimeoutMillis: isServerless ? 0 : 30000,
    connectionTimeoutMillis: 5000,
    ...sslConfig,
  });
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) pool = createPool();
  return pool;
}

function convertPlaceholders(sql: string): string {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

const db = {
  execute(sql: string, params?: unknown[]) {
    const p = getPool();
    const convertedSql = params ? convertPlaceholders(sql) : sql;
    return p.query(convertedSql, params).then((result) => [result.rows]);
  },
};

export default db;
