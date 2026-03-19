import EmployeeRepository from "./employee.repository.js";
import pool from "../../config/db.config.js";

class EmployeeService {

  static async createEmployee(data) {

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (!data.userId || !data.employeeCode) {
        throw new Error("userId and employeeCode are required");
      }

      const existing = await EmployeeRepository.findByUserId(data.userId, connection);

      if (existing) {
        throw new Error("Employee already exists");
      }

      const employeeId = await EmployeeRepository.createEmployee(data, connection);

      await EmployeeRepository.initializeLeaveBalances(employeeId, connection);

      await connection.commit();

      return { employeeId };

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getEmployees() {
    return EmployeeRepository.getEmployees();
  }

  static async getEmployeeById(id) {
    const employee = await EmployeeRepository.getEmployeeById(id);
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  static async updateEmployee(id, data, currentUser) {

    const employee = await EmployeeRepository.getEmployeeById(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // ✅ SELF UPDATE
    if (currentUser.userId === employee.user_id) {
      await EmployeeRepository.updateEmployee(id, data);
      return { updated: true };
    }

    // ✅ ROLE CHECK
    const query = `
      SELECT id
      FROM role_manage_rules
      WHERE manager_role_id=? AND target_role_id=?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [
      currentUser.roleId,
      employee.role_id
    ]);

    if (rows.length === 0) {
      throw new Error("You are not allowed to update this employee");
    }

    await EmployeeRepository.updateEmployee(id, data);

    return { updated: true };
  }

  static async deleteEmployee(id) {
    await EmployeeRepository.deleteEmployee(id);
  }
}

export default EmployeeService;