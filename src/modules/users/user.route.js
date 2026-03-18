import { Router } from "express";
import UserController from "./user.controller.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee", "update"),
  UserController.updateUser
);

userRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("employee", "delete"),
  UserController.deleteUser
);

export default userRouter;