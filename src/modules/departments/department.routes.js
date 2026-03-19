import { Router } from "express";
import DepartmentController from "./department.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";
import { limiter } from "../../utils/rateLimiter.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    permissionMiddleware("department", "create"),
    DepartmentController.createDepartment
);

router.get(
    "/",
    limiter,
    authMiddleware,
    permissionMiddleware("department", "view"),
    DepartmentController.getDepartments
);

router.get(
    "/:id",
    limiter,
    authMiddleware,
    permissionMiddleware("department", "view"),
    DepartmentController.getDepartmentById
);

router.put(
    "/:id",
    limiter,
    authMiddleware,
    permissionMiddleware("department", "update"),
    DepartmentController.updateDepartment
);

router.delete(
    "/:id",
    authMiddleware,
    permissionMiddleware("department", "delete"),
    DepartmentController.deleteDepartment
);

export default router;