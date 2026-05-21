import pg from "pg";

async function main() {
  const connectionString = process.env.PG_CONNECTION_STRING;

  const pool = connectionString
    ? new pg.Pool({ connectionString })
    : new pg.Pool({
        host: process.env.PG_HOST || "localhost",
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "",
        database: process.env.PG_DATABASE || "my_siblings",
        max: 1,
      });

  console.log("Running support system migrations...");

  const tables = [
    `CREATE TABLE IF NOT EXISTS support_requests (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      type VARCHAR(50) NOT NULL DEFAULT 'general',
      subject VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS support_replies (
      id VARCHAR(36) PRIMARY KEY,
      request_id VARCHAR(36) NOT NULL REFERENCES support_requests(id) ON DELETE CASCADE,
      user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    try {
      await pool.query(sql);
      const name = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || "unknown";
      console.log(`  + Created table: ${name}`);
    } catch (err) {
      console.error(`  ! Failed to create table: ${err.message}`);
    }
  }

  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_support_requests_user ON support_requests(user_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_support_replies_request ON support_replies(request_id, created_at)`,
  ];

  for (const sql of indexes) {
    try {
      await pool.query(sql);
      console.log(`  + Created index`);
    } catch (err) {
      console.error(`  ! Failed index: ${err.message}`);
    }
  }

  console.log("Support system migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
