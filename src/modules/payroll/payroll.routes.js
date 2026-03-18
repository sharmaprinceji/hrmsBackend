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
  "/employee/:employeeId",
  authMiddleware,
  permissionMiddleware("payroll","generate"),
  PayrollController.getEmployeePayroll
);

export default payrollRouter;