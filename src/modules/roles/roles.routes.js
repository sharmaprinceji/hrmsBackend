import express from "express";
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
} from "./roles.controller.js";

const roleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role Management APIs
 */

/**
 * @swagger
 * /roles/create:
 *   post:
 *     summary: Create role
 *     tags: [Roles]
 */
roleRouter.post("/create", createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 */
roleRouter.get("/", getAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 */
roleRouter.put("/:id", updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete role (soft delete)
 *     tags: [Roles]
 */
roleRouter.delete("/:id", deleteRole);

export default roleRouter;