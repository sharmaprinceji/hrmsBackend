import { Router } from "express";
import LeaveController from "./leave.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const leaveRoute = Router();

leaveRoute.post(
  "/apply",
  authMiddleware,
  LeaveController.applyLeave
);

leaveRoute.get(
  "/",
  authMiddleware,
  permissionMiddleware("leave","view"),
  LeaveController.getLeaveRequests
);

leaveRoute.put(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware("leave","approve"),
  LeaveController.approveLeave
);

leaveRoute.put(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware("leave","approve"),
  LeaveController.rejectLeave
);

export default leaveRoute;