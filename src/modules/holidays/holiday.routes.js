import { Router } from "express";
import HolidayController from "./holiday.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

const holidayRoutes = Router();

holidayRoutes.post(
  "/",
  authMiddleware,
  permissionMiddleware("holiday","create"),
  HolidayController.createHoliday
);

holidayRoutes.get(
  "/",
  authMiddleware,
  HolidayController.getHolidays
);

holidayRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("holiday","update"),
  HolidayController.updateHoliday
);

holidayRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("holiday","delete"),
  HolidayController.deleteHoliday
);

export default holidayRoutes;