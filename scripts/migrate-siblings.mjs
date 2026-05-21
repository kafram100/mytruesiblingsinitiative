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

  console.log("Running sibling feature migrations...");

  // Add columns to profiles
  const profileColumns = [
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pronouns VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_city VARCHAR(100) DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT NULL`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE DEFAULT NULL`,
  ];

  for (const sql of profileColumns) {
    try {
      await pool.query(sql);
      console.log(`  + Applied: ${sql.split(" ").slice(0, 6).join(" ")}...`);
    } catch (err) {
      console.error(`  ! Failed: ${err.message}`);
    }
  }
  console.log("  + Added profile columns");

  // New tables
  const tables = [
    `CREATE TABLE IF NOT EXISTS conversations (
      id VARCHAR(36) PRIMARY KEY,
      user1_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      user2_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user1_id, user2_id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(36) PRIMARY KEY,
      conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
      sender_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP DEFAULT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      type VARCHAR(50) NOT NULL DEFAULT 'info',
      title VARCHAR(200) NOT NULL,
      message TEXT DEFAULT NULL,
      link VARCHAR(500) DEFAULT NULL,
      read_at TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS user_activity (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      action VARCHAR(100) NOT NULL,
      details TEXT DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS match_feedback (
      id VARCHAR(36) PRIMARY KEY,
      match_id VARCHAR(36) NOT NULL REFERENCES matches(id),
      user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
      rating INTEGER NOT NULL DEFAULT 0,
      feedback TEXT DEFAULT NULL,
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

  // Add index for performance
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_match_requests_user ON match_requests(user_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user1_id, user2_id)`,
  ];

  for (const sql of indexes) {
    try {
      await pool.query(sql);
      console.log(`  + Created index`);
    } catch (err) {
      console.error(`  ! Failed index: ${err.message}`);
    }
  }

  console.log("Sibling feature migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
