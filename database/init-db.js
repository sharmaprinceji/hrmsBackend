import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME;

async function initDatabase() {
    try {

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
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

        await connection.end();

    } catch (error) {

        console.error("Database init error:", error);

    }
}

await initDatabase();