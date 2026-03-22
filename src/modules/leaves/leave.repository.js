import pool from "../../config/db.config.js";

class LeaveRepository {

  static async getEmployeeByUserId(userId){

    const query = `
      SELECT id
      FROM employees
      WHERE user_id=? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute(query,[userId]);

    return rows[0];

  }

static async getLeaveBalance(userId, conn = pool) {

  const query = `
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
  `;

  const [rows] = await conn.execute(query, [userId]);

  return rows;
}

  static async getLeaveBalancesAll() {
  const query = `
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
  `;

  const [rows] = await pool.execute(query);

  return rows;
}

  static async createLeaveRequest(data){

    const query = `
      INSERT INTO leave_requests
      (employee_id,leave_type_id,start_date,end_date,days,reason)
      VALUES (?,?,?,?,?,?)
    `;

    const [result] = await pool.execute(query,[
      data.employeeId,
      data.leaveTypeId,
      data.startDate,
      data.endDate,
      data.days,
      data.reason
    ]);

    return {leaveId:result.insertId};

  }

  static async getLeaveRequests(){

    const query = `
      SELECT
        lr.id,
        u.name,
        lt.name AS leave_type,
        lr.start_date,
        lr.end_date,
        lr.days,
        lr.status
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id=e.id
      JOIN users u ON e.user_id=u.id
      JOIN leave_types lt ON lr.leave_type_id=lt.id
      ORDER BY lr.created_at DESC
    `;

    const [rows] = await pool.execute(query);

    return rows;

  }

  static async getLeaveById(id,conn=pool){

    const query = `
      SELECT *
      FROM leave_requests
      WHERE id=?
    `;

    const [rows] = await conn.execute(query,[id]);

    return rows[0];

  }

  static async updateLeaveStatus(id,status,approverId,conn=pool){

    const query = `
      UPDATE leave_requests
      SET status=?,approved_by=?
      WHERE id=?
    `;

    await conn.execute(query,[status,approverId,id]);

  }

  static async updateLeaveBalance(employeeId,leaveTypeId,days,conn=pool){

    const query = `
      UPDATE leave_balances
      SET
        used_leaves = used_leaves + ?,
        remaining_leaves = remaining_leaves - ?
      WHERE employee_id=? AND leave_type_id=?
    `;

    await conn.execute(query,[
      days,
      days,
      employeeId,
      leaveTypeId
    ]);

  }

  static async checkOverlap(employeeId, startDate, endDate){

  const query = `
    SELECT id
    FROM leave_requests
    WHERE employee_id = ?
    AND status IN ('pending','approved')
    AND (
      start_date <= ? AND end_date >= ?
    )
  `;

  const [rows] = await pool.execute(query, [
    employeeId,
    endDate,
    startDate
  ]);

  return rows.length > 0;
}

}

export default LeaveRepository;