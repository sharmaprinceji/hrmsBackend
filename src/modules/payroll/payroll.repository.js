import pool from "../../config/db.config.js";

class PayrollRepository {

  static async getPayrolls(filters = {}){

    let query = `
      SELECT
        p.id,
        p.employee_id,
        u.name,
        e.employee_code,
        p.payroll_month,
        p.payroll_year,
        p.basic_salary,
        p.hra,
        p.allowances,
        p.pf,
        p.esi,
        p.tds,
        p.gross_salary,
        p.deductions,
        p.net_salary,
        p.generated_at
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if(filters?.employeeId){
      query += " AND p.employee_id = ?";
      params.push(filters.employeeId);
    }

    if(filters?.month){
      query += " AND p.payroll_month = ?";
      params.push(filters.month);
    }

    if(filters?.year){
      query += " AND p.payroll_year = ?";
      params.push(filters.year);
    }

    query += `
      ORDER BY p.payroll_year DESC,
      p.payroll_month DESC
    `;

    const [rows] = await pool.execute(query,params);

    return rows;

  }

  static async getEmployeePayroll(id){

  const query = `
    SELECT
      p.id,
      p.employee_id,
      u.name,
      e.employee_code,
      p.payroll_month,
      p.payroll_year,
      p.basic_salary,
      p.hra,
      p.allowances,
      p.pf,
      p.esi,
      p.tds,
      p.gross_salary,
      p.deductions,
      p.net_salary
    FROM payroll p
    JOIN employees e ON p.employee_id = e.id
    JOIN users u ON e.user_id = u.id
    WHERE p.id = ?
  `;

  const [rows] = await pool.execute(query,[id]);

  return rows[0];

}

static async checkExistingPayroll(employeeId, month, year){

  const query = `
    SELECT id
    FROM payroll
    WHERE employee_id=? AND payroll_month=? AND payroll_year=?
  `;

  const [rows] = await pool.execute(query,[employeeId, month, year]);

  return rows[0];
}

static async getEmployee(employeeId){

  const query = `
    SELECT
      e.id,
      e.salary,
      e.employee_code,
      u.name,
      u.email
    FROM employees e
    JOIN users u ON e.user_id = u.id
    WHERE e.id = ? AND e.deleted_at IS NULL
  `;

  const [rows] = await pool.execute(query, [employeeId]);

  return rows[0];
}

static async createPayroll(data, conn = pool) {

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

  const values = [
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
  ];

  const [result] = await conn.execute(query, values);

  return result.insertId;
}

}

export default PayrollRepository;