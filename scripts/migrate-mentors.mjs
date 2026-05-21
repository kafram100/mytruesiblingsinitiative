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

  console.log("Running mentor/coach migrations...");

  const tables = [
    `CREATE TABLE IF NOT EXISTS mentor_profiles (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
      expertise_areas JSONB DEFAULT '[]',
      experience_years INT DEFAULT 0,
      mentorship_bio TEXT DEFAULT NULL,
      certification TEXT DEFAULT NULL,
      max_mentees INT NOT NULL DEFAULT 5,
      current_mentees INT NOT NULL DEFAULT 0,
      is_available SMALLINT NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS mentor_mentees (
      id VARCHAR(36) PRIMARY KEY,
      mentor_id VARCHAR(36) NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
      mentee_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      request_message TEXT DEFAULT NULL,
      matched_at TIMESTAMP DEFAULT NULL,
      completed_at TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(mentor_id, mentee_id)
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
    `CREATE INDEX IF NOT EXISTS idx_mentor_mentees_mentor ON mentor_mentees(mentor_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_mentor_mentees_mentee ON mentor_mentees(mentee_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_mentor_profiles_available ON mentor_profiles(is_available)`,
  ];

  for (const sql of indexes) {
    try {
      await pool.query(sql);
      console.log(`  + Created index`);
    } catch (err) {
      console.error(`  ! Failed index: ${err.message}`);
    }
  }

  console.log("Mentor migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
