import { Router } from "express";
import EmployeeController from "./employee.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("employee","create"),
  EmployeeController.createEmployee
);

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("employee","view"),
  EmployeeController.getEmployees
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","view"),
  EmployeeController.getEmployeeById
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","update"),
  EmployeeController.updateEmployee
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee","delete"),
  EmployeeController.deleteEmployee
);

export default router;