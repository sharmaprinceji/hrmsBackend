import pool from "../../config/db.config.js";

class AttendanceRepository {

  static async getEmployeeByUserId(userId){

    const query = `
      SELECT id
      FROM employees
      WHERE user_id=? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute(query,[userId]);

    return rows[0];

  }

  static async getAttendance(employeeId,date){

    const query = `
      SELECT *
      FROM attendance
      WHERE employee_id=? AND attendance_date=?
    `;

    const [rows] = await pool.execute(query,[employeeId,date]);

    return rows[0];

  }

  static async createCheckIn(employeeId,date){

    const query = `
      INSERT INTO attendance
      (employee_id,attendance_date,status,check_in)
      VALUES (?, ?, 'present', NOW())
    `;

    const [result] = await pool.execute(query,[employeeId,date]);

    return {attendanceId:result.insertId};

  }

  static async updateCheckOut(attendanceId){

    const query = `
      UPDATE attendance
      SET check_out = NOW()
      WHERE id=?
    `;

    await pool.execute(query,[attendanceId]);

    return {checkedOut:true};

  }

  static async monthlyReport(month,year){
    const query = `
      SELECT
        u.name,
        e.employee_code,
        COUNT(CASE WHEN a.status='present' THEN 1 END) AS present_days,
        COUNT(CASE WHEN a.status='absent' THEN 1 END) AS absent_days
      FROM attendance a
      JOIN employees e ON a.employee_id=e.id
      JOIN users u ON e.user_id=u.id
      WHERE MONTH(a.attendance_date)=?
      AND YEAR(a.attendance_date)=?
      GROUP BY e.id
    `;

    const [rows] = await pool.execute(query,[month,year]);

    return rows;

  }

  static async createAttendance(data){

  const query = `
    INSERT INTO attendance
    (employee_id,attendance_date,status)
    VALUES (?,CURDATE(),?)
  `;

  const [result] = await pool.execute(query,[
    data.employeeId,
    data.status
  ]);

  return {attendanceId:result.insertId};

}

}

export default AttendanceRepository;