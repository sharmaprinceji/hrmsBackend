import pool from "../../config/db.config.js";
import redisClient from "../../config/redis.config.js";
import { payslipTemplate } from "../../utils/paySlipTemplates.js";
import PayrollRepository from "./payroll.repository.js";
// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core";



class PayrollService {

  static async generatePayroll(data) {

    const conn = await pool.getConnection();

    try {

      await conn.beginTransaction();

      const employee = await PayrollRepository.getEmployee(data.employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }

      const existing = await PayrollRepository.checkExistingPayroll(
        data.employeeId,
        data.month,
        data.year
      );

      if (existing) {
        throw new Error("Payroll already generated");
      }

      const round = (num) => Math.round(num);

      const basic = round(employee.salary * 0.5);
      const hra = round(basic * 0.4);
      const allowances = round(employee.salary * 0.1);

      const gross = basic + hra + allowances;

      const pf = round(basic * 0.12);

      let esi = 0;
      if (employee.salary <= 21000) {
        esi = round(gross * 0.0075);
      }

      const tds = data.tds || 0;

      const deductions = pf + esi + tds;
      const netSalary = gross - deductions;

      const payrollId = await PayrollRepository.createPayroll({
        employeeId: data.employeeId,
        month: data.month,
        year: data.year,
        basic,
        hra,
        allowances,
        pf,
        esi,
        tds,
        gross,
        deductions,
        netSalary
      }, conn);

      await conn.commit();

      return { payrollId };

    } catch (err) {

      await conn.rollback();
      throw err;

    } finally {
      conn.release();
    }
  }

  static async getEmployeePayroll(employeeId) {

    return PayrollRepository.getEmployeePayroll(employeeId);

  }

  static async getPayrolls(filters = {}) {

    return PayrollRepository.getPayrolls(filters);

  }

  static async downloadPayslip(payrollId) {
    // const cacheKey = `payslip:${payrollId}`;
    // const cached = await redisClient.get(cacheKey);

    // if (cached) {
    //   return Buffer.from(cached, "base64");
    // }

    const payroll = await PayrollRepository.getPayrollById(payrollId);

    if (!payroll) {
      throw new Error("Payroll not found");
    }

    // const browser = await puppeteer.launch({
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
    // });

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const html = payslipTemplate(payroll);

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    //set response inside the redis.
    // await redisClient.setEx(
    //   cacheKey,
    //   3600,
    //   pdf.toString("base64")
    // );

    await browser.close();

    return pdf;

  }

}

export default PayrollService;