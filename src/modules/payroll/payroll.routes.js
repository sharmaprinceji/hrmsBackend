import { Router } from "express";
import PayrollController from "./payroll.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const payrollRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Payroll
 *   description: Payroll Management APIs
 */

/**
 * @swagger
 * /payroll/generate:
 *   post:
 *     summary: Generate payroll for employee
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, month, year]
 *             properties:
 *               employeeId:
 *                 type: number
 *                 example: 1
 *               month:
 *                 type: number
 *                 example: 3
 *               year:
 *                 type: number
 *                 example: 2026
 *               tds:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       200:
 *         description: Payroll generated successfully
 */
payrollRouter.post(
  "/generate",
  authMiddleware,
  permissionMiddleware("payroll","generate"),
  PayrollController.generatePayroll
);

/**
 * @swagger
 * /payroll/view:
 *   get:
 *     summary: Get all payroll records
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payroll records
 */
payrollRouter.get(
  "/view",
  authMiddleware,
  permissionMiddleware("payroll","view"),
  PayrollController.getPayrolls
);

/**
 * @swagger
 * /payroll/employee/{employeeId}:
 *   get:
 *     summary: Get payroll of a specific employee
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     responses:
 *       200:
 *         description: Employee payroll data
 */
payrollRouter.get(
  "/employee/:employeeId",
  authMiddleware,
  permissionMiddleware("payroll","view"), // ✅ FIXED (was generate ❌)
  PayrollController.getEmployeePayroll
);

/**
 * @swagger
 * /payroll/payslip/{id}:
 *   get:
 *     summary: Download payroll payslip PDF
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     responses:
 *       200:
 *         description: PDF payslip
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
payrollRouter.get(
  "/payslip/:id",
  authMiddleware,
  permissionMiddleware("payroll","view"),
  PayrollController.downloadPayslip
);

export default payrollRouter;