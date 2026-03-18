import AuthRepository from "./auth.repository.js";
import { hashPassword, comparePassword } from "../../utils/password.utils.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils.js";
import redisClient from "../../config/redis.config.js";
import pool from "../../config/db.config.js";

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

    const permissions = await AuthRepository.getRolePermissions(user.role_id);

    await redisClient.set(
      `role_permissions:${user.role_id}`,
      JSON.stringify(permissions)
    );

    return {
      accessToken,
      refreshToken
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

    await redisClient.del(`role_permissions:${userId}`);

  }

}

export default AuthService;