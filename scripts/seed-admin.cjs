const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

async function main() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_siblings",
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

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

  await pool.execute(
    "INSERT INTO profiles (id, email, full_name, role, password_hash, must_change_password) VALUES (?, ?, ?, 'admin', ?, 1) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name)",
    [id, email, name, hash]
  );

  console.log("Admin user created/updated:");
  console.log("  Email:", email);
  console.log("  Password: <hidden> (change immediately after first login)");

  await pool.end();
}

main().catch(console.error);
