import pg from "pg";

async function main() {
  const pool = new pg.Pool({
    host: process.env.PG_HOST || "localhost",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_DATABASE || "my_siblings",
    max: 1,
  });

  console.log("Running mentor field migrations...");

  const migrations = [
    `ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS occupation VARCHAR(255) DEFAULT NULL`,
    `ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS organization VARCHAR(255) DEFAULT NULL`,
    `ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS approved SMALLINT NOT NULL DEFAULT 0`,
  ];

  for (const sql of migrations) {
    try {
      await pool.query(sql);
      const name = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || "unknown";
      console.log(`  + Added column: ${name}`);
    } catch (err) {
      console.error(`  ! Failed: ${err.message}`);
    }
  }

  console.log("Mentor field migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
