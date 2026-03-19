export const payslipTemplate=(payroll)=>{
    return `
    <h1>Salary Slip</h1>
      <hr/>

      <p><b>Employee:</b> ${payroll.name}</p>
      <p><b>Employee Code:</b> ${payroll.employee_code}</p>
      <p><b>Month:</b> ${payroll.payroll_month}-${payroll.payroll_year}</p>

      <h3>Earnings</h3>
      <p>Basic Salary: ${payroll.basic_salary}</p>
      <p>HRA: ${payroll.hra}</p>
      <p>Allowances: ${payroll.allowances}</p>

      <h3>Deductions</h3>
      <p>PF: ${payroll.pf}</p>
      <p>ESI: ${payroll.esi}</p>
      <p>TDS: ${payroll.tds}</p>

      <hr/>

      <h2>Net Salary: ${payroll.net_salary}</h2>
    `
}