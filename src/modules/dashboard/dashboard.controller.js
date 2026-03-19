import pool from "../../config/db.config.js";

class DashboardController {
  static async getSummary(req, res) {
    try {

      // ✅ Total Employees
      const [[emp]] = await pool.execute(`
        SELECT COUNT(*) as total FROM employees WHERE deleted_at IS NULL
      `);

      // ✅ Pending Leaves
      const [[leaves]] = await pool.execute(`
        SELECT COUNT(*) as total FROM leave_requests WHERE status='pending'
      `);

      // ✅ Active Tasks
      const [[tasks]] = await pool.execute(`
        SELECT COUNT(*) as total FROM tasks WHERE status != 'completed'
      `);

      // ✅ Attendance Today %
      const [[attendance]] = await pool.execute(`
        SELECT 
          COUNT(CASE WHEN status='present' THEN 1 END) * 100 / COUNT(*) as percent
        FROM attendance
        WHERE attendance_date = CURDATE()
      `);

      // ✅ Payroll (this month total)
      const [[payroll]] = await pool.execute(`
        SELECT SUM(net_salary) as total
        FROM payroll
        WHERE payroll_month = MONTH(CURDATE())
        AND payroll_year = YEAR(CURDATE())
      `);

      // ✅ Departments
      const [[dept]] = await pool.execute(`
        SELECT COUNT(*) as total FROM departments WHERE deleted_at IS NULL
      `);

      res.json({
        success: true,
        data: {
          totalEmployees: emp.total || 0,
          pendingLeaves: leaves.total || 0,
          activeTasks: tasks.total || 0,
          attendanceToday: Math.round(attendance.percent || 0),
          payrollProcessed: payroll.total || 0,
          departments: dept.total || 0
        }
      });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default DashboardController;