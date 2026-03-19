import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "./logger.config.js";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkDB() {
    try {
        const connection = await pool.getConnection();
        logger.info("MySQL connected successfully");
        connection.release();
    } catch (error) {
        logger.error("MySQL connection failed", error);
    }
}

await checkDB();

export default pool;