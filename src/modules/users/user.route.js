import { Router } from "express";
import UserController from "./user.controller.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management APIs
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 2
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               roleId:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: User updated successfully
 */
userRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee", "update"),
  UserController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 2
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
userRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee", "delete"),
  UserController.deleteUser
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
userRouter.get(
  "/",
  authMiddleware,
  permissionMiddleware("employee", "view"),
  UserController.getUsers
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 */
userRouter.get(
  "/profile",
  authMiddleware,
  UserController.getProfile
);

export default userRouter;