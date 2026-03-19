import { Router } from "express";
import DashboardController from "./dashboard.controller.js";

const dashboardRoutes = Router();

dashboardRoutes.get("/summary", DashboardController.getSummary);

export default dashboardRoutes;