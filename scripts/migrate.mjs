import mysql from "mysql2/promise";

async function main() {
  const host = process.env.MYSQL_HOST || "localhost";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "my_siblings";

  const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

  console.log("Running schema migrations...");

  // Create all tables if they do not already exist
  const tables = [
    `CREATE TABLE IF NOT EXISTS contacts (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS donations (
      id VARCHAR(36) PRIMARY KEY,
      amount_usd DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      recurrence VARCHAR(20) NOT NULL DEFAULT 'once',
      purpose VARCHAR(255) NOT NULL,
      sponsor_tier VARCHAR(100),
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      donor_email VARCHAR(254),
      donor_name VARCHAR(100),
      stripe_payment_intent_id VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254),
      full_name VARCHAR(100),
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      password_hash VARCHAR(255) NOT NULL,
      must_change_password TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      \`value\` TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS reset_tokens (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS password_resets (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      token VARCHAR(36) NOT NULL,
      ip_address VARCHAR(45) DEFAULT NULL,
      expires_at DATETIME NOT NULL,
      used TINYINT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS activity_log (
      id VARCHAR(36) PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      items JSON NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      stripe_session_id VARCHAR(255),
      stripe_payment_intent_id VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS rate_limits (
      \`key\` VARCHAR(255) PRIMARY KEY,
      \`count\` INT NOT NULL DEFAULT 1,
      reset_at BIGINT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    try {
      await pool.execute(sql);
    } catch (err) {
      console.error("  ! Failed to create table:", err.message);
    }
  }
  console.log(`  + Ensured ${tables.length} tables exist`);

  // Add must_change_password column if not present (legacy migration)
  try {
    await pool.execute(
      "ALTER TABLE profiles ADD COLUMN must_change_password TINYINT(1) NOT NULL DEFAULT 1"
    );
    console.log("  + Added must_change_password column to profiles");
  } catch {
    // column already exists
  }

  // Add ip_address to password_resets if not present (legacy migration)
  try {
    await pool.execute(
      "ALTER TABLE password_resets ADD COLUMN ip_address VARCHAR(45) DEFAULT NULL"
    );
    console.log("  + Added ip_address column to password_resets");
  } catch {
    // column already exists
  }

  console.log("Migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
