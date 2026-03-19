import { Router } from "express";
import EmployeeController from "./employee.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee Management APIs
 */



/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, employeeCode, departmentId, designation, salary]
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 3
 *               employeeCode:
 *                 type: string
 *                 example: EMP001
 *               departmentId:
 *                 type: number
 *                 example: 1
 *               designation:
 *                 type: string
 *                 example: Backend Developer
 *               salary:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       200:
 *         description: Employee created
 */
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("employee","create"),
  EmployeeController.createEmployee
);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get(
  "/",
  authMiddleware,
  permissionMiddleware("employee","view"),
  EmployeeController.getEmployees
);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employee]
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
 *         description: Employee details
 */
router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","view"),
  EmployeeController.getEmployeeById
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentId:
 *                 type: number
 *               designation:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Employee updated
 */
router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","update"),
  EmployeeController.updateEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Employee deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","delete"),
  EmployeeController.deleteEmployee
);

export default router;