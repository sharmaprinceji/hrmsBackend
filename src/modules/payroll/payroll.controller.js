import PayrollService from "./payroll.service.js";
import { successResponse } from "../../utils/response.utils.js";

class PayrollController {

  static async generatePayroll(req, res, next) {

    try {

      const result = await PayrollService.generatePayroll(req.body);

      return successResponse(res, result, "Payroll generated");

    } catch (err) {
      next(err);
    }

  }

  static async getEmployeePayroll(req, res, next) {

    try {

      const payroll = await PayrollService.getEmployeePayroll(req.params.employeeId);

      return successResponse(res, payroll);

    } catch (err) {
      next(err);
    }

  }

  static async getPayrolls(req, res, next) {

    try {

      const payrolls = await PayrollService.getPayrolls();

      return successResponse(res, payrolls);

    } catch (err) {
      next(err);
    }

  }

  static async downloadPayslip(req, res, next) {

    try {

      const payrollId = req.params.id;

      const pdfBuffer = await PayrollService.downloadPayslip(payrollId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=payslip-${payrollId}.pdf`);
      res.setHeader("Content-Length", pdfBuffer.length);

      res.end(pdfBuffer);

    } catch (err) {
      next(err);
    }

  }



}

export default PayrollController;