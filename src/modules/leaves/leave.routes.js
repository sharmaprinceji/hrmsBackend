import { Router } from "express";
import LeaveController from "./leave.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const leaveRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave Management APIs
 */

/**
 * @swagger
 * /leaves/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [leaveTypeId, startDate, endDate, reason]
 *             properties:
 *               leaveTypeId:
 *                 type: number
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-20
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-22
 *               reason:
 *                 type: string
 *                 example: Vacation
 *     responses:
 *       200:
 *         description: Leave request submitted
 */
leaveRoute.post(
  "/apply",
  authMiddleware,
  LeaveController.applyLeave
);

/**
 * @swagger
 * /leaves:
 *   get:
 *     summary: Get all leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests
 */
leaveRoute.get(
  "/",
  authMiddleware,
  permissionMiddleware("leave","view"),
  LeaveController.getLeaveRequests
);

/**
 * @swagger
 * /leaves/{id}/approve:
 *   put:
 *     summary: Approve leave request
 *     tags: [Leave]
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
 *         description: Leave approved
 */
leaveRoute.put(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware("leave","approve"),
  LeaveController.approveLeave
);

/**
 * @swagger
 * /leaves/{id}/reject:
 *   put:
 *     summary: Reject leave request
 *     tags: [Leave]
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
 *         description: Leave rejected
 */
leaveRoute.put(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware("leave","approve"),
  LeaveController.rejectLeave
);

leaveRoute.get(
  "/all",
  authMiddleware,
  permissionMiddleware("leave","view"),
  LeaveController.getAllLeaves
);

leaveRoute.get(
  "/my",
  authMiddleware,
  LeaveController.getMyLeaves
);

export default leaveRoute;