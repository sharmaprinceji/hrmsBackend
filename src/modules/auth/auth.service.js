import AuthRepository from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/password.utils.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils.js";
import redisClient from "../../config/redis.config.js";
import pool from "../../config/db.config.js";
// import { sendOtpEmailJob } from "../../queue/email.producer.js";
import { sendOTP } from "../../services/emailService.js";

class AuthService {

  static async register(data, currentUser) {

    const existing = await AuthRepository.findUserIncludingDeleted(data.email);

    const managerRoleId = currentUser?.roleId;
    const targetRoleId = data.roleId;

    if (currentUser) {

      const query = `
        SELECT id
        FROM role_manage_rules
        WHERE manager_role_id=? AND target_role_id=?
        LIMIT 1
      `;

      const [rows] = await pool.execute(query, [managerRoleId, targetRoleId]);

      if (rows.length === 0) {
        throw new Error("You cannot create this role");
      }
    }

    const hashedPassword = await hashPassword(data.password);

    if (existing && !existing.deleted_at) {
      throw new Error("Email already registered");
    }

    if (existing && existing.deleted_at) {

      await AuthRepository.restoreUser(existing.id, {
        name: data.name,
        password: hashedPassword,
        roleId: data.roleId
      });

      return {
        userId: existing.id,
        restored: true
      };
    }

    const userId = await AuthRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: data.roleId
    });

    return {
      userId,
      restored: false
    };

  }

  static async login(data) {

    const user = await AuthRepository.findUserByEmail(data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      userId: user.id,
      roleId: user.role_id,
      tokenVersion: user.token_version
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await AuthRepository.saveRefreshToken(user.id, refreshToken);

    // ✅ Fetch permissions
    const permissions = await AuthRepository.getRolePermissions(user.role_id);

    // ✅ Cache in Redis
    await redisClient.set(
      `role_permissions:${user.role_id}`,
      JSON.stringify(permissions)
    );

    // ✅ FINAL RESPONSE (IMPORTANT 🔥)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.role_id,
        permissions // 🔥 THIS FIXES YOUR FRONTEND
      }
    };
  }

  static async refreshToken(refreshToken) {

    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await AuthRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    const user = await AuthRepository.findUserById(payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newPayload = {
      userId: user.id,
      roleId: user.role_id,
      tokenVersion: user.token_version
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await AuthRepository.deleteRefreshToken(refreshToken);

    await AuthRepository.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };

  }

  static async logout(userId) {

    await AuthRepository.deleteUserRefreshTokens(userId);

    // await redisClient.setEx(
    //   `blacklist:${token}`,
    //   3600, 
    //   "true"
    // );

    // optional: increment token version (invalidate all tokens)
    await pool.execute(
      `UPDATE users SET token_version = token_version + 1 WHERE id=?`,
      [userId]
    );

  }

  static async forgotPassword(email) {

    const user = await AuthRepository.findUserByEmail(email);
    // console.log('user--->',user);

    if (!user) {
      throw new Error("User not found");
    }

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store in Redis (expire in 60 sec)
    // await redisClient.set(
    //   `otp:${email}`,
    //   otp,
    //   "EX",
    //   60
    // );
    await redisClient.set(`otp:${email}`, otp, {
      ex: 60,
    });


    // TODO: send email...
    //  await sendOtpEmailJob(email, otp);
    await sendOTP(email, otp);


    // console.log("OTP:", otp);

    return { email };

  }

  static async resetPassword(data) {

    const { email, otp, newPassword } = data;

    const storedOtp = await redisClient.get(`otp:${email}`);
    
    if (!storedOtp) {
      throw new Error("OTP expired or not found");
    }
    // console.log("data---->",storedOtp,otp);
    
    if (storedOtp == otp) {
      const user = await AuthRepository.findUserByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = await hashPassword(newPassword);

      await AuthRepository.updatePassword(user.id, hashedPassword);

      await redisClient.del(`otp:${email}`);

      return { message: "Password updated" };

    }
    else {
      throw new Error("Invalid OTP");
    }
  }

}

export default AuthService;