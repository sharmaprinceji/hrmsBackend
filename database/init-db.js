import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL");

    // =========================
    // LOAD SCHEMA
    // =========================
    const schema = fs.readFileSync(
      path.join("./database/schema.sql"),
      "utf8"
    );

    // 🔥 SPLIT QUERIES
    const queries = schema
      .split(";")
      .map(q => q.trim())
      .filter(q => q.length);

    for (const query of queries) {
      await connection.query(query);
    }

    console.log("✅ Schema created");

    // =========================
    // RUN SEEDS
    // =========================
    const seedFiles = [
      "seed_roles.sql",
      "seed_permissions.sql",
      "seed_leave_types.sql",
      "seed_role_permissions.sql",
      "seed_role_manage_rules.sql",
    ];

    for (const file of seedFiles) {
      const seed = fs.readFileSync(
        path.join(`./database/seeds/${file}`),
        "utf8"
      );

      const seedQueries = seed
        .split(";")
        .map(q => q.trim())
        .filter(q => q.length);

      for (const query of seedQueries) {
        await connection.query(query);
      }

      console.log(`✅ ${file} executed`);
    }

    console.log("✅ Database initialized");

    // =========================
    // ADMIN USER
    // =========================
    const adminEmail = "admin@hrms.com";
    const adminPassword = "Admin@123";

    const [existingAdmin] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      const [roles] = await connection.query(
        "SELECT id FROM roles WHERE name = 'admin' LIMIT 1"
      );

      if (roles.length === 0) {
        throw new Error("Admin role not found");
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await connection.query(
        `INSERT INTO users (name, email, password, role_id, status)
         VALUES (?, ?, ?, ?, 'active')`,
        ["Super Admin", adminEmail, hashedPassword, roles[0].id]
      );

      console.log("✅ Admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    await connection.end();
    console.log("🎉 DB setup complete");
  } catch (error) {
    console.error("❌ Database init error:", error.message);
  }
}

await initDatabase();