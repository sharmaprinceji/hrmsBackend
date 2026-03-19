import { Router } from "express";
import TaskController from "./task.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const taskRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task Management APIs
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, assignedTo]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fix login bug
 *               description:
 *                 type: string
 *                 example: Resolve authentication issue
 *               assignedTo:
 *                 type: number
 *                 example: 3
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-25
 *     responses:
 *       200:
 *         description: Task created successfully
 */
taskRoutes.post(
  "/",
  authMiddleware,
  permissionMiddleware("task","create"),
  TaskController.createTask
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks (role-based)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
taskRoutes.get(
  "/",
  authMiddleware,
  permissionMiddleware("task","view"),
  TaskController.getTasks
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task (status or details)
 *     tags: [Task]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, completed]
 *     responses:
 *       200:
 *         description: Task updated
 */
taskRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("task","update"),
  TaskController.updateTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Task]
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
 *         description: Task deleted
 */
taskRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("task","delete"),
  TaskController.deleteTask
);

export default taskRoutes;