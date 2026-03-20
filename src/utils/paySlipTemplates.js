// export const payslipTemplate=(payroll)=>{
//     return `
//     <h1>Salary Slip</h1>
//       <hr/>

//       <p><b>Employee:</b> ${payroll.name}</p>
//       <p><b>Employee Code:</b> ${payroll.employee_code}</p>
//       <p><b>Month:</b> ${payroll.payroll_month}-${payroll.payroll_year}</p>

//       <h3>Earnings</h3>
//       <p>Basic Salary: ${payroll.basic_salary}</p>
//       <p>HRA: ${payroll.hra}</p>
//       <p>Allowances: ${payroll.allowances}</p>

//       <h3>Deductions</h3>
//       <p>PF: ${payroll.pf}</p>
//       <p>ESI: ${payroll.esi}</p>
//       <p>TDS: ${payroll.tds}</p>

//       <hr/>

//       <h2>Net Salary: ${payroll.net_salary}</h2>
//     `
// }

export const payslipTemplate = (payroll) => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }

        .container {
          max-width: 800px;
          margin: auto;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 10px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #4a90e2;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .company {
          font-size: 20px;
          font-weight: bold;
          color: #4a90e2;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
        }

        .details {
          margin-bottom: 20px;
        }

        .details p {
          margin: 4px 0;
          font-size: 14px;
        }

        .section-title {
          margin-top: 20px;
          font-size: 16px;
          font-weight: bold;
          color: #4a90e2;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th {
          background: #4a90e2;
          color: white;
          padding: 10px;
          font-size: 14px;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .right {
          text-align: right;
        }

        .net-salary {
          margin-top: 20px;
          padding: 15px;
          background: #eaf7ef;
          border: 1px solid #2ecc71;
          border-radius: 8px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #27ae60;
        }

        .footer {
          margin-top: 30px;
          font-size: 12px;
          text-align: center;
          color: #777;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <!-- HEADER -->
        <div class="header">
          <div class="company">HRMS Pvt Ltd</div>
          <div class="title">Salary Slip</div>
        </div>

        <!-- EMPLOYEE DETAILS -->
        <div class="details">
          <p><b>Employee:</b> ${payroll.name}</p>
          <p><b>Employee Code:</b> ${payroll.employee_code}</p>
          <p><b>Month:</b> ${payroll.payroll_month}-${payroll.payroll_year}</p>
        </div>

        <!-- EARNINGS -->
        <div class="section-title">Earnings</div>
        <table>
          <tr>
            <th>Description</th>
            <th class="right">Amount (₹)</th>
          </tr>
          <tr>
            <td>Basic Salary</td>
            <td class="right">${payroll.basic_salary}</td>
          </tr>
          <tr>
            <td>HRA</td>
            <td class="right">${payroll.hra}</td>
          </tr>
          <tr>
            <td>Allowances</td>
            <td class="right">${payroll.allowances}</td>
          </tr>
        </table>

        <!-- DEDUCTIONS -->
        <div class="section-title">Deductions</div>
        <table>
          <tr>
            <th>Description</th>
            <th class="right">Amount (₹)</th>
          </tr>
          <tr>
            <td>PF</td>
            <td class="right">${payroll.pf}</td>
          </tr>
          <tr>
            <td>ESI</td>
            <td class="right">${payroll.esi}</td>
          </tr>
          <tr>
            <td>TDS</td>
            <td class="right">${payroll.tds}</td>
          </tr>
        </table>

        <!-- NET SALARY -->
        <div class="net-salary">
          Net Salary: ₹ ${payroll.net_salary}
        </div>

        <!-- FOOTER -->
        <div class="footer">
          This is a system-generated payslip. No signature required.
        </div>

      </div>
    </body>
  </html>
  `;
};