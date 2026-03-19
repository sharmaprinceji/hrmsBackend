import pool from "../../config/db.config.js";

class EmployeeRepository {

  static async findByUserId(userId, connection) {
    const query = `
      SELECT id
      FROM employees
      WHERE user_id=? AND deleted_at IS NULL
      LIMIT 1
    `;
    const [rows] = await connection.execute(query, [userId]);
    return rows[0];
  }

  static async checkDepartmentExists(departmentId, connection) {
  const [rows] = await connection.execute(
    `SELECT id FROM departments WHERE id = ?`,
    [departmentId]
  );
  return rows[0];
}

  static async createEmployee(data, connection) {
    const query = `
      INSERT INTO employees
      (user_id, employee_code, department_id, designation, salary)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.userId,
      data.employeeCode,
      data.departmentId ?? null,
      data.designation ?? null,
      data.salary ?? null
    ];

    const [result] = await connection.execute(query, values);
    return result.insertId;
  }

  static async getEmployees() {
    const query = `
      SELECT
        e.id,
        e.employee_code,
        u.name,
        u.email,
        u.role_id,
        d.name AS department,
        e.designation,
        e.phone,
        e.salary
      FROM employees e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.deleted_at IS NULL
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async getEmployeeById(id) {
    const query = `
      SELECT
        e.*,
        e.user_id,
        u.name,
        u.email,
        u.role_id,
        d.name AS department
      FROM employees e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id=? AND e.deleted_at IS NULL
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async updateEmployee(id, data) {

    const fields = [];
    const values = [];

    const safePush = (field, value) => {
      if (value !== undefined) {
        fields.push(`${field}=?`);
        values.push(value ?? null);
      }
    };

    safePush("department_id", data.departmentId);
    safePush("designation", data.designation);
    safePush("phone", data.phone);
    safePush("address", data.address);
    safePush("salary", data.salary);

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE employees
      SET ${fields.join(", ")}
      WHERE id=? AND deleted_at IS NULL
    `;

    values.push(id);

    await pool.execute(query, values);
  }

  static async deleteEmployee(id) {
    const query = `
      UPDATE employees
      SET deleted_at=NOW()
      WHERE id=?
    `;
    await pool.execute(query, [id]);
  }

  static async initializeLeaveBalances(employeeId, connection) {
    const query = `
      INSERT INTO leave_balances
      (employee_id,leave_type_id,total_leaves,used_leaves,remaining_leaves)
      SELECT ?, id, max_days, 0, max_days
      FROM leave_types
    `;
    await connection.execute(query, [employeeId]);
  }
}

export default EmployeeRepository;