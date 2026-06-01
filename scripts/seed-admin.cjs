const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function main() {
  const connectionString = process.env.PG_CONNECTION_STRING;

  const pool = connectionString
    ? new Pool({ connectionString })
    : new Pool({
        host: process.env.PG_HOST || "localhost",
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE || "my_siblings",
        max: 1,
      });

  if (!connectionString && (!process.env.PG_USER || !process.env.PG_PASSWORD)) {
    console.error("ERROR: Set PG_CONNECTION_STRING or PG_USER + PG_PASSWORD environment variables.");
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL || "admin@mysiblings.org";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("ERROR: ADMIN_PASSWORD environment variable is required.");
    console.error("Usage: ADMIN_PASSWORD='your-secure-password' node scripts/seed-admin.cjs");
    process.exit(1);
  }
  const name = process.env.ADMIN_NAME || "Admin";

  const hash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await pool.query(
    "INSERT INTO profiles (id, email, full_name, role, password_hash, must_change_password) VALUES ($1, $2, $3, 'admin', $4, 1) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name",
    [id, email, name, hash]
  );

  console.log("Admin user created/updated:");
  console.log("  Email:", email);
  console.log("  Password: <hidden> (change immediately after first login)");

  await pool.end();
}

main().catch(console.error);
