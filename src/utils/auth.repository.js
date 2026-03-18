import pool from "../config/db.config.js";

class AuthRepository {

  static async findUserByEmail(email) {

    const query = `
      SELECT id,name,email,password,role_id,token_version
      FROM users
      WHERE email=? AND deleted_at IS NULL
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [email]);

    return rows[0];

  }

  static async createUser(data) {

    const query = `
      INSERT INTO users
      (name,email,password,role_id)
      VALUES (?,?,?,?)
    `;

    const [result] = await pool.execute(query, [
      data.name,
      data.email,
      data.password,
      data.roleId
    ]);

    return result.insertId;

  }

  static async saveRefreshToken(userId, token) {

    const query = `
      INSERT INTO refresh_tokens (user_id,token,expires_at)
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;

    await pool.execute(query, [userId, token]);

  }

}

export default AuthRepository;