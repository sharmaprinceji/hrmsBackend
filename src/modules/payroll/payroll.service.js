import PayrollRepository from "./payroll.repository.js";

class PayrollService {

  static async generatePayroll(data){

    const employee = await PayrollRepository.getEmployee(data.employeeId);

    if(!employee){
      throw new Error("Employee not found");
    }

    const basic = employee.salary;

    const hra = basic * 0.4;

    const allowances = basic * 0.1;

    const gross = basic + hra + allowances;

    const pf = basic * 0.12;

    const esi = gross * 0.0075;

    const tds = data.tds || 0;

    const deductions = pf + esi + tds;

    const netSalary = gross - deductions;

    const payrollId = await PayrollRepository.createPayroll({
      employeeId:data.employeeId,
      month:data.month,
      year:data.year,
      basic,
      hra,
      allowances,
      pf,
      esi,
      tds,
      gross,
      deductions,
      netSalary
    });

    return {payrollId};

  }

  static async getEmployeePayroll(employeeId){

    return PayrollRepository.getEmployeePayroll(employeeId);

  }

}

export default PayrollService;