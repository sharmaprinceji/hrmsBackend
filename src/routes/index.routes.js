import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRouter from "../modules/users/user.route.js";
import employeeRoutes from "../modules/employees/employee.routes.js";
import departmentRoutes from "../modules/departments/department.routes.js";
import leaveRoute from "../modules/leaves/leave.routes.js";
import attendanceRoute from "../modules/attendance/attendance.routes.js";
import payrollRouter from "../modules/payroll/payroll.routes.js";
import holidayRoutes from "../modules/holidays/holiday.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

const router = Router();

router.get("/health",(req,res)=>{
  res.json({
    success:true,
    message:"HRMS API running"
  });
});

router.use("/auth",authRoutes);
router.use("/users",userRouter);
router.use("/employees",employeeRoutes);
router.use("/departments",departmentRoutes);
router.use("/leaves",leaveRoute);
router.use("/attendance",attendanceRoute);
router.use("/payroll",payrollRouter);
router.use("/holidays",holidayRoutes);
router.use("/tasks",taskRoutes);
router.use("/dashboard",dashboardRoutes);

export default router;