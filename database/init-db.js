import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const DB_NAME = process.env.DB_NAME;

async function initDatabase() {
    try {

        // const connection = await mysql.createConnection({
        //     host: process.env.DB_HOST,
        //     user: process.env.DB_USER,
        //     password: process.env.DB_PASSWORD,
        //     multipleStatements: true
        // });

        const connection = mysql.createPool({
            uri: process.env.DB_URL,
            multipleStatements: true
        });


        console.log("Connected to MySQL");

        // create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        console.log("Database ensured");

        await connection.query(`USE ${DB_NAME}`);

        // run schema
        const schema = fs.readFileSync(
            path.join("./database/schema.sql"),
            "utf8"
        );

        await connection.query(schema);

        console.log("Schema created");

        // seed files
        const seedFiles = [
            "seed_roles.sql",
            "seed_permissions.sql",
            "seed_leave_types.sql",
            "seed_role_permissions.sql",
            "seed_role_manage_rules.sql"
        ];

        for (const file of seedFiles) {

            const seed = fs.readFileSync(
                path.join(`./database/seeds/${file}`),
                "utf8"
            );

            await connection.query(seed);

            console.log(`${file} executed`);
        }

        console.log("Database initialized successfully");

        // =========================
        // CREATE DEFAULT ADMIN USER
        // =========================

        const adminEmail = "admin@hrms.com";
        const adminPassword = "Admin@123";

        // check if admin exists
        const [existingAdmin] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [adminEmail]
        );

        if (existingAdmin.length === 0) {
            // get admin role id
            const [roles] = await connection.query(
                "SELECT id FROM roles WHERE name = 'admin' LIMIT 1"
            );

            if (roles.length === 0) {
                throw new Error("Admin role not found. Seed roles first.");
            }

            const roleId = roles[0].id;

            // hash password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // insert admin user
            await connection.query(
                `
    INSERT INTO users (name, email, password, role_id, status)
    VALUES (?, ?, ?, ?, 'active')
    `,
                ["Super Admin", adminEmail, hashedPassword, roleId]
            );

            console.log("Default admin user created");
        } else {
            console.log("Admin already exists");
        }

        await connection.end();

    } catch (error) {

        console.error("Database init error:", error);

    }
}

await initDatabase();