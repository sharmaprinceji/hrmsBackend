import { Router } from "express";
import DepartmentController from "./department.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";
import { limiter } from "../../utils/rateLimiter.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department Management APIs
 */

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Engineering
 *               description:
 *                 type: string
 *                 example: Tech team
 *     responses:
 *       200:
 *         description: Department created
 */
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("department", "create"),
  DepartmentController.createDepartment
);

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get(
  "/",
  limiter,
  authMiddleware,
  permissionMiddleware("department", "view"),
  DepartmentController.getDepartments
);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
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
 *         description: Department details
 */
router.get(
  "/:id",
  limiter,
  authMiddleware,
  permissionMiddleware("department", "view"),
  DepartmentController.getDepartmentById
);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Department]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated
 */
router.put(
  "/:id",
  limiter,
  authMiddleware,
  permissionMiddleware("department", "update"),
  DepartmentController.updateDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Department]
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
 *         description: Department deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("department", "delete"),
  DepartmentController.deleteDepartment
);



export default router;