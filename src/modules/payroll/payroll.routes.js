import { Router } from "express";
import PayrollController from "./payroll.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const payrollRouter = Router();

payrollRouter.post(
  "/generate",
  authMiddleware,
  permissionMiddleware("payroll","generate"),
  PayrollController.generatePayroll
);

payrollRouter.get(
  "/view",
  authMiddleware,
  permissionMiddleware("payroll","view"),
  PayrollController.getPayrolls
);

payrollRouter.get(
  "/employee/:employeeId",
  authMiddleware,
  permissionMiddleware("payroll","generate"),
  PayrollController.getEmployeePayroll
);

payrollRouter.get(
  "/payslip/:id",
  authMiddleware,
  permissionMiddleware("payroll","view"),
  PayrollController.downloadPayslip
);
// payrollRouter.get("/payslip/:id", authMiddleware,PayrollController.downloadPayslip);
export default payrollRouter;