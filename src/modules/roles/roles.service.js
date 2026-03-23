import pool from "../../config/db.config.js";

class RoleService {
    static async createRole({ name, description, permissions }) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // 1. Create role
            const [roleResult] = await conn.query(
                "INSERT INTO roles (name, description) VALUES (?, ?)",
                [name, description]
            );

            const roleId = roleResult.insertId;

            // 2. Assign permissions
            for (const permissionId of permissions) {
                await conn.query(
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
                    [roleId, permissionId]
                );
            }

            await conn.commit();

            return { id: roleId, name };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async getAllRoles() {
        const [roles] = await pool.query(`
      SELECT r.id, r.name, r.description
      FROM roles r
      WHERE r.deleted_at IS NULL
    `);

        return roles;
    }

    static async updateRole(roleId, { name, description, permissions }) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // update role
            await conn.query(
                "UPDATE roles SET name=?, description=? WHERE id=?",
                [name, description, roleId]
            );

            // delete old permissions
            await conn.query(
                "DELETE FROM role_permissions WHERE role_id=?",
                [roleId]
            );

            // insert new permissions
            for (const permissionId of permissions) {
                await conn.query(
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
                    [roleId, permissionId]
                );
            }

            await conn.commit();

            return { id: roleId, name };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    static async deleteRole(roleId) {
        await pool.query(
            "UPDATE roles SET deleted_at=NOW() WHERE id=?",
            [roleId]
        );
    }
}


export default RoleService;