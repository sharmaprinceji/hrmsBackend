import pool from "../../config/db.config.js";

class UserRepository {

  static async findById(id){

    const query = `
      SELECT id,name,email,role_id
      FROM users
      WHERE id=? AND deleted_at IS NULL
      LIMIT 1
    `;

    const [rows] = await pool.execute(query,[id]);

    return rows[0];

  }

  static async updateUser(id,data){

    const query = `
      UPDATE users
      SET name=?, email=?, role_id=?
      WHERE id=? AND deleted_at IS NULL
    `;

    await pool.execute(query,[
      data.name,
      data.email,
      data.roleId,
      id
    ]);

  }

  static async softDelete(id){

    const query = `
      UPDATE users
      SET deleted_at=NOW()
      WHERE id=?
    `;

    await pool.execute(query,[id]);

  }

}

export default UserRepository;