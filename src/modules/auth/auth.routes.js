import { Router } from "express";
import AuthController from "./auth.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import { limiter } from "../../utils/rateLimiter.js";


const router = Router();

router.post("/login",limiter,AuthController.login);

router.post("/register",authMiddleware,AuthController.register);

router.post("/refresh", AuthController.refreshToken);

router.post("/logout", authMiddleware, AuthController.logout);

router.post("/forgot-password",limiter, AuthController.forgotPassword);

router.post("/reset-password",limiter, AuthController.resetPassword);

export default router;