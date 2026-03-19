import { Router } from "express";
import TaskController from "./task.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const taskRoutes = Router();

taskRoutes.post(
  "/",
  authMiddleware,
  permissionMiddleware("task","create"),
  TaskController.createTask
);

taskRoutes.get(
  "/",
  authMiddleware,
  permissionMiddleware("task","view"),
  TaskController.getTasks
);

taskRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("task","update"),
  TaskController.updateTask
);

taskRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("task","delete"),
  TaskController.deleteTask
);

export default taskRoutes;