import { Router } from "express";
import HolidayController from "./holiday.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const holidayRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Holiday
 *   description: Holiday Management APIs
 */

/**
 * @swagger
 * /holidays:
 *   post:
 *     summary: Create holiday
 *     tags: [Holiday]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, date]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Diwali
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-11-08
 *               type:
 *                 type: string
 *                 enum: [national, regional, company]
 *                 example: national
 *     responses:
 *       200:
 *         description: Holiday created
 */
holidayRoutes.post(
  "/",
  authMiddleware,
  permissionMiddleware("holiday","create"),
  HolidayController.createHoliday
);

/**
 * @swagger
 * /holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holiday]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holidays
 */
holidayRoutes.get(
  "/",
  authMiddleware,
  HolidayController.getHolidays
);

/**
 * @swagger
 * /holidays/{id}:
 *   put:
 *     summary: Update holiday
 *     tags: [Holiday]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [national, regional, company]
 *     responses:
 *       200:
 *         description: Holiday updated
 */
holidayRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("holiday","update"),
  HolidayController.updateHoliday
);

/**
 * @swagger
 * /holidays/{id}:
 *   delete:
 *     summary: Delete holiday
 *     tags: [Holiday]
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
 *         description: Holiday deleted
 */
holidayRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("holiday","delete"),
  HolidayController.deleteHoliday
);

export default holidayRoutes;