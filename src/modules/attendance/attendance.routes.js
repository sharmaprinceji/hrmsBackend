import { Router } from "express";
import AttendanceController from "./attendance.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const attendanceRouter = Router();

attendanceRouter.post(
  "/checkin",
  authMiddleware,
  AttendanceController.checkIn
);

attendanceRouter.put(
  "/checkout",
  authMiddleware,
  AttendanceController.checkOut
);

attendanceRouter.post(
  "/mark",
  authMiddleware,
  permissionMiddleware("attendance","mark"),
  AttendanceController.markAttendance
);

attendanceRouter.get(
  "/report",
  authMiddleware,
  permissionMiddleware("attendance","view"),
  AttendanceController.monthlyReport
);

export default attendanceRouter;