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

  // Add must_change_password column if not present
  try {
    await pool.execute(
      "ALTER TABLE profiles ADD COLUMN must_change_password TINYINT(1) NOT NULL DEFAULT 1"
    );
    console.log("  + Added must_change_password column to profiles");
  } catch {
    console.log("  ~ must_change_password column already exists");
  }

  // Add ip_address to password_resets if not present
  try {
    await pool.execute(
      "ALTER TABLE password_resets ADD COLUMN ip_address VARCHAR(45) DEFAULT NULL"
    );
    console.log("  + Added ip_address column to password_resets");
  } catch {
    console.log("  ~ ip_address column already exists");
  }

  console.log("Migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
