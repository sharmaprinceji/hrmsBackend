import pool from "../../config/db.config.js";

class LeaveRepository {

  // =========================
  // GET EMPLOYEE BY USER ID
  // =========================
  static async getEmployeeByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT id FROM employees WHERE user_id=? AND deleted_at IS NULL`,
      [userId]
    );
    return rows[0];
  }

  // =========================
  // GET SINGLE LEAVE BALANCE (for apply/approve)
  // =========================
  static async getLeaveBalanceByType(employeeId, leaveTypeId, conn = pool) {
    const db = conn || pool;

    const [rows] = await db.execute(
      `SELECT * FROM leave_balances 
       WHERE employee_id=? AND leave_type_id=?`,
      [employeeId, leaveTypeId]
    );

    return rows[0];
  }

  // =========================
  // GET MY LEAVE BALANCES
  // =========================
  static async getLeaveBalancesByUser(userId) {
    const [rows] = await pool.execute(
      `
      SELECT 
        lb.id,
        u.name AS employee_name,
        lt.name AS leave_type,
        lb.total_leaves,
        lb.used_leaves,
        lb.remaining_leaves
      FROM leave_balances lb
      JOIN employees e ON lb.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE e.user_id = ?
      `,
      [userId]
    );

    return rows;
  }

  // =========================
  // GET ALL LEAVE BALANCES (HR/Admin)
  // =========================
  static async getLeaveBalancesAll() {
    const [rows] = await pool.execute(`
      SELECT
        lb.id,
        u.name AS employee_name,
        lt.name AS leave_type,
        lb.total_leaves,
        lb.used_leaves,
        lb.remaining_leaves
      FROM leave_balances lb
      JOIN employees e ON lb.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      ORDER BY u.name ASC
    `);

    return rows;
  }

  // =========================
  // CREATE LEAVE REQUEST
  // =========================
  static async createLeaveRequest(data) {
    const [result] = await pool.execute(
      `INSERT INTO leave_requests
       (employee_id,leave_type_id,start_date,end_date,days,reason)
       VALUES (?,?,?,?,?,?)`,
      [
        data.employeeId,
        data.leaveTypeId,
        data.startDate,
        data.endDate,
        data.days,
        data.reason
      ]
    );

    return { leaveId: result.insertId };
  }

  // =========================
  // GET ALL LEAVE REQUESTS
  // =========================
  static async getLeaveRequests() {
    const [rows] = await pool.execute(`
      SELECT
        lr.id,
        u.name,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.days,
        lr.status
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      ORDER BY lr.created_at DESC
    `);

    return rows;
  }

  // =========================
  // GET MY LEAVE REQUESTS
  // =========================
  static async getMyLeaveRequests(userId) {
    const [rows] = await pool.execute(
      `
      SELECT
        lr.id,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.days,
        lr.status
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE e.user_id = ?
      ORDER BY lr.created_at DESC
      `,
      [userId]
    );

    return rows;
  }

  // =========================
  // GET LEAVE BY ID
  // =========================
  static async getLeaveById(id, conn = pool) {
    const db = conn || pool;

    const [rows] = await db.execute(
      `SELECT * FROM leave_requests WHERE id=?`,
      [id]
    );

    return rows[0];
  }

  // =========================
  // UPDATE LEAVE STATUS
  // =========================
  static async updateLeaveStatus(id, status, approverId, conn = pool) {
    const db = conn || pool;

    await db.execute(
      `UPDATE leave_requests
       SET status=?, approved_by=?
       WHERE id=?`,
      [status, approverId, id]
    );
  }

  // =========================
  // UPDATE LEAVE BALANCE
  // =========================
  static async updateLeaveBalance(employeeId, leaveTypeId, days, conn = pool) {
    const db = conn || pool;

    await db.execute(
      `UPDATE leave_balances
       SET used_leaves = used_leaves + ?,
           remaining_leaves = remaining_leaves - ?
       WHERE employee_id=? AND leave_type_id=?`,
      [days, days, employeeId, leaveTypeId]
    );
  }

  // =========================
  // CHECK OVERLAP
  // =========================
  static async checkOverlap(employeeId, startDate, endDate) {
    const [rows] = await pool.execute(
      `
      SELECT id FROM leave_requests
      WHERE employee_id = ?
      AND status IN ('pending','approved')
      AND (start_date <= ? AND end_date >= ?)
      `,
      [employeeId, endDate, startDate]
    );

    return rows.length > 0;
  }

  // =========================
  // GET EMPLOYEE ROLE (FOR APPROVAL LOGIC)
  // =========================
  static async getEmployeeWithRole(employeeId, conn = pool) {
    const db = conn || pool;

    const [rows] = await db.execute(
      `
      SELECT e.id, u.role_id
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
      `,
      [employeeId]
    );

    return rows[0];
  }

}

export default LeaveRepository;