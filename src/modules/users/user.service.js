import UserRepository from "./user.repository.js";

import pool from "../../config/db.config.js";
import { logAudit } from "../../utils/auditLogger.js";

class UserService {

  static async updateUser(currentUser, targetUserId, data) {
    const targetUser = await UserRepository.findById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    // ✅ permission check
    const query = `
    SELECT id
    FROM role_manage_rules
    WHERE manager_role_id=? AND target_role_id=?
    LIMIT 1
  `;

    const [rows] = await pool.execute(query, [
      currentUser.roleId,
      targetUser.role_id
    ]);

    if (rows.length === 0 && currentUser.userId != targetUserId) {
      throw new Error("You are not allowed to update this user");
    }

    // ✅ clean data (IMPORTANT)
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v ?? null])
    );

    const oldData = targetUser;

    // ✅ update
    await UserRepository.updateUser(targetUserId, cleanData);

    // ✅ safe audit (never break main flow)
    try {
      await logAudit({
        userId: currentUser.userId ?? null,
        action: "update",
        entityType: "user",
        entityId: targetUserId,
        oldData,
        newData: cleanData
      });
    } catch (err) {
      console.error("Audit failed:", err.message);
    }

    return { userId: targetUserId };
  }

  static async deleteUser(currentUser, targetUserId) {

    const targetUser = await UserRepository.findById(targetUserId);

    if (!targetUser) {
      throw new Error("User not found");
    }

    const query = `
    SELECT id
    FROM role_manage_rules
    WHERE manager_role_id=? AND target_role_id=?
    LIMIT 1
  `;

    const [rows] = await pool.execute(query, [
      currentUser.roleId,
      targetUser.role_id
    ]);

    if (rows.length === 0) {
      throw new Error("You are not allowed to delete this user");
    }

    await UserRepository.softDelete(targetUserId);

    await logAudit({
      userId: currentUser.userId,
      action: "delete",
      entityType: "user",
      entityId: targetUserId,
      oldData: targetUser
    });

    return { userId: targetUserId };
  }

  // static async getUsers(currentUser) {
  //     console.log("currentUser",currentUser);
  //   // ✅ Employee → only self
  //   if (currentUser.role === "employee") {
  //     return [await UserRepository.findById(currentUser.userId)];
  //   }

  //   // ✅ Admin / HR / Manager → role-based access
  //   const users = await UserRepository.getUsersByRole(currentUser);

  //   return users;
  // }

  static async getUsers(currentUser, filters) {
    const { search, role, page, limit } = filters;

    // Employee → only self
    if (currentUser.role === "employee") {
      const user = await UserRepository.findById(currentUser.userId);
      return {
        data: [user],
        total: 1,
        page: 1,
        totalPages: 1
      };
    }

    const data = await UserRepository.getUsersByRole(currentUser, filters);

    return {
      data: data,
      total: data.length, // ✅ total based on array length
      page: page,
      totalPages: Math.ceil(data.length / limit)
    };
  }

  static async getProfile(userId) {
    const user = await UserRepository.getProfile(userId);

    if (!user) throw new Error("User not found");

    return user;
  }

}

export default UserService;