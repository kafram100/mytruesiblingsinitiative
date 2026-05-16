import db from "@/lib/db";

let migrated = false;

export async function ensureTables() {
  if (migrated) return;
  migrated = true;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS donations (
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
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254),
      full_name VARCHAR(100),
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      password_hash VARCHAR(255) NOT NULL,
      must_change_password TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      \`value\` TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reset_tokens (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id VARCHAR(36) PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      items JSON NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      stripe_session_id VARCHAR(255),
      stripe_payment_intent_id VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
