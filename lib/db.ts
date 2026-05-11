import mysql from "mysql2/promise";

function createPool(): mysql.Pool {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !user || !password || !database) {
    throw new Error(
      "Missing required MySQL env vars: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE"
    );
  }

  const sslConfig = process.env.MYSQL_SSL === "true"
    ? { ssl: { rejectUnauthorized: true } }
    : {};

  return mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...sslConfig,
  });
}

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) pool = createPool();
  return pool;
}

const db: mysql.Pool = new Proxy({} as mysql.Pool, {
  get(_, prop: string | symbol) {
    return (getPool() as any)[prop];
  },
});

export default db;
