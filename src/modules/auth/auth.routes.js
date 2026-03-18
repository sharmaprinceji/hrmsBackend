import { Router } from "express";
import AuthController from "./auth.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";


const router = Router();

router.post("/login",AuthController.login);

router.post("/register",authMiddleware,AuthController.register);

router.post("/refresh", AuthController.refreshToken);

export default router;