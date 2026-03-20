import { Router } from "express";
import AttendanceController from "./attendance.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const attendanceRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance Management APIs
 */

/**
 * @swagger
 * /attendance/checkin:
 *   post:
 *     summary: Employee check-in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Check-in successful
 */
attendanceRouter.post(
  "/checkin",
  authMiddleware,
  AttendanceController.checkIn
);

/**
 * @swagger
 * /attendance/checkout:
 *   put:
 *     summary: Employee check-out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Check-out successful
 */
attendanceRouter.put(
  "/checkout",
  authMiddleware,
  AttendanceController.checkOut
);

/**
 * @swagger
 * /attendance/mark:
 *   post:
 *     summary: Mark attendance manually
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, status]
 *             properties:
 *               employeeId:
 *                 type: number
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [present, absent, half_day, wfh]
 *                 example: present
 *     responses:
 *       200:
 *         description: Attendance marked
 */
attendanceRouter.post(
  "/mark",
  authMiddleware,
  permissionMiddleware("attendance","mark"),
  AttendanceController.markAttendance
);

/**
 * @swagger
 * /attendance/report:
 *   get:
 *     summary: Get monthly attendance report
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         example: 2026
 *     responses:
 *       200:
 *         description: Monthly attendance report
 */
attendanceRouter.get(
  "/",
  authMiddleware,
  permissionMiddleware("attendance","view"),
  AttendanceController.monthlyReport
);

export default attendanceRouter;