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

/**
 * @swagger
 * /leaves/all:
 *   get:
 *     summary: Get all employee leave requests (HR/Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       employee_name:
 *                         type: string
 *                         example: Rohit
 *                       leave_type:
 *                         type: string
 *                         example: Sick Leave
 *                       start_date:
 *                         type: string
 *                         example: 2026-03-20
 *                       end_date:
 *                         type: string
 *                         example: 2026-03-22
 *                       days:
 *                         type: number
 *                         example: 3
 *                       status:
 *                         type: string
 *                         example: pending
 */
leaveRoute.get(
  "/all",
  authMiddleware,
  permissionMiddleware("leave","view"),
  LeaveController.getAllLeaves
);


/**
 * @swagger
 * /leaves/my:
 *   get:
 *     summary: Get logged-in user's leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       leave_type:
 *                         type: string
 *                         example: Casual Leave
 *                       start_date:
 *                         type: string
 *                         example: 2026-03-20
 *                       end_date:
 *                         type: string
 *                         example: 2026-03-21
 *                       days:
 *                         type: number
 *                         example: 2
 *                       status:
 *                         type: string
 *                         example: approved
 */
leaveRoute.get(
  "/my",
  authMiddleware,
  LeaveController.getMyLeaves
);

export default leaveRoute;