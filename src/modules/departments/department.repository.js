import pool from "../../config/db.config.js";

class DepartmentRepository {

    static async findByName(name) {

        const query = `
      SELECT id
      FROM departments
      WHERE name=? AND deleted_at IS NULL
      LIMIT 1
    `;

        const [rows] = await pool.execute(query, [name]);

        return rows[0];

    }

    static async createDepartment(data) {

        const query = `
      INSERT INTO departments (name,description,manager_id)
      VALUES (?,?,?)
    `;

        const [result] = await pool.execute(query, [
            data.name,
            data.description,
            data.managerId || null
        ]);

        return result.insertId;

    }

    static async getDepartments() {

        const query = `
      SELECT
        d.id,
        d.name,
        d.description,
        u.name AS manager,
        COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN users u ON d.manager_id=u.id
      LEFT JOIN employees e ON e.department_id=d.id AND e.deleted_at IS NULL
      WHERE d.deleted_at IS NULL
      GROUP BY d.id
    `;

        const [rows] = await pool.execute(query);

        return rows;

    }

    static async getDepartmentById(id) {

        const query = `
      SELECT
        d.id,
        d.name,
        d.description,
        u.name AS manager
      FROM departments d
      LEFT JOIN users u ON d.manager_id=u.id
      WHERE d.id=? AND d.deleted_at IS NULL
    `;

        const [rows] = await pool.execute(query, [id]);

        return rows[0];

    }

    static async updateDepartment(id, data) {

        const query = `
      UPDATE departments
      SET
        name=?,
        description=?,
        manager_id=?
      WHERE id=? AND deleted_at IS NULL
    `;

        await pool.execute(query, [
            data.name,
            data.description,
            data.managerId || null,
            id
        ]);

    }

    static async deleteDepartment(id) {

        const query = `
      UPDATE departments
      SET deleted_at=NOW()
      WHERE id=?
    `;

        await pool.execute(query, [id]);

    }

}

export default DepartmentRepository;