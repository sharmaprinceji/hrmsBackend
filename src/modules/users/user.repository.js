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

  static async updateUser(id, data) {

  let query = "UPDATE users SET ";
  const values = [];

  if (data.name !== undefined) {
    query += "name = ?, ";
    values.push(data.name);
  }

  if (data.email !== undefined) {
    query += "email = ?, ";
    values.push(data.email);
  }

  if (data.roleId !== undefined) {
    query += "role_id = ?, ";
    values.push(data.roleId);
  }

  // ❗ remove last comma
  query = query.slice(0, -2);

  query += " WHERE id = ? AND deleted_at IS NULL";
  values.push(id);

  await pool.execute(query, values);
}

  static async softDelete(id){

    const query = `
      UPDATE users
      SET deleted_at=NOW()
      WHERE id=?
    `;

    await pool.execute(query,[id]);

  }

static async getUsersByRole(currentUser) {

  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.status,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.deleted_at IS NULL
    AND (
      u.role_id = ?  -- self role (optional)
      OR u.role_id IN (
        SELECT target_role_id
        FROM role_manage_rules
        WHERE manager_role_id = ?
      )
    )
    ORDER BY u.created_at DESC
  `;

  const [rows] = await pool.execute(query, [
    currentUser.roleId,
    currentUser.roleId
  ]);

  return rows;
}
}

export default UserRepository;