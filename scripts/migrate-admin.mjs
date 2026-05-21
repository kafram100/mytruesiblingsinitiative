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

  console.log("Running admin feature migrations...");

  const tables = [
    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      compare_price DECIMAL(10,2) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'general',
      tags JSONB DEFAULT '[]',
      is_active SMALLINT NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT DEFAULT NULL,
      date DATE NOT NULL,
      time VARCHAR(50) DEFAULT NULL,
      location VARCHAR(200) DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      registration_url TEXT DEFAULT NULL,
      is_featured SMALLINT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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

  console.log("Admin migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
