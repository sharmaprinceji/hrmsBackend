import AuthService from "./auth.service.js";
import { successResponse } from "../../utils/response.utils.js";

class AuthController {

  static async register(req, res, next) {
    try {

      const currentUser = req.user || null;

      const result = await AuthService.register(req.body, currentUser);

      return successResponse(res, result, "User registered successfully");

    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {

      const result = await AuthService.login(req.body);

      return successResponse(res, result, "Login successful");

    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {

      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      return successResponse(res, result, "Token refreshed successfully");

    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {

      const userId = req.user.userId;

      await AuthService.logout(userId);

      return successResponse(res, null, "Logout successful");

    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
  try {
    // console.log("body data",req.body);
    const result = await AuthService.forgotPassword(req.body.email);
    return successResponse(res, result, "OTP sent successfully");
  } catch (err) {
    next(err);
  }
}

static async resetPassword(req, res, next) {
  try {
    const result = await AuthService.resetPassword(req.body);
    return successResponse(res, result, "Password reset successful");
  } catch (err) {
    next(err);
  }
}

}

export default AuthController;