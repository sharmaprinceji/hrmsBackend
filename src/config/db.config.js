import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
});


// ✅ Check connection
async function checkDB() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ MySQL connected (XAMPP):", rows);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

checkDB();

export default pool;