import pool from "../../config/db.config.js";

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

  static async findUserById(id) {

    const query = `
      SELECT id,name,email,role_id,token_version
      FROM users
      WHERE id=? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute(query, [id]);

    return rows[0];

  }

  static async createUser(data) {

    const query = `
      INSERT INTO users (name,email,password,role_id)
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

  static async findRefreshToken(token) {

    const query = `
      SELECT id,user_id
      FROM refresh_tokens
      WHERE token=?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [token]);

    return rows[0];

  }

  static async deleteRefreshToken(token) {

    const query = `
      DELETE FROM refresh_tokens
      WHERE token=?
    `;

    await pool.execute(query, [token]);

  }

  static async deleteUserRefreshTokens(userId) {

    const query = `
      DELETE FROM refresh_tokens
      WHERE user_id=?
    `;

    await pool.execute(query, [userId]);

  }

  static async getRolePermissions(roleId) {

    const query = `
      SELECT p.module,p.action
      FROM permissions p
      JOIN role_permissions rp
      ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `;

    const [rows] = await pool.execute(query, [roleId]);

    return rows;

  }

  static async findUserIncludingDeleted(email) {

    const query = `
      SELECT id,name,email,password,role_id,deleted_at
      FROM users
      WHERE email=?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [email]);

    return rows[0];

  }

  static async restoreUser(userId, data) {

    const query = `
      UPDATE users
      SET
        name=?,
        password=?,
        role_id=?,
        deleted_at=NULL
      WHERE id=?
    `;

    await pool.execute(query, [
      data.name,
      data.password,
      data.roleId,
      userId
    ]);

  }

}

export default AuthRepository;