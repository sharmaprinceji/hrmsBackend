import pool from "../../config/db.config.js";

class PayrollRepository {

  static async getEmployee(employeeId){

    const query = `
      SELECT id,salary
      FROM employees
      WHERE id=? AND deleted_at IS NULL
    `;

    const [rows] = await pool.execute(query,[employeeId]);

    return rows[0];

  }

  static async createPayroll(data){

    const query = `
      INSERT INTO payroll
      (
        employee_id,
        payroll_month,
        payroll_year,
        basic_salary,
        hra,
        allowances,
        pf,
        esi,
        tds,
        gross_salary,
        deductions,
        net_salary
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const [result] = await pool.execute(query,[
      data.employeeId,
      data.month,
      data.year,
      data.basic,
      data.hra,
      data.allowances,
      data.pf,
      data.esi,
      data.tds,
      data.gross,
      data.deductions,
      data.netSalary
    ]);

    return result.insertId;

  }

  static async getEmployeePayroll(employeeId){

    const query = `
      SELECT *
      FROM payroll
      WHERE employee_id=?
      ORDER BY payroll_year DESC,payroll_month DESC
    `;

    const [rows] = await pool.execute(query,[employeeId]);

    return rows;

  }

}

export default PayrollRepository;