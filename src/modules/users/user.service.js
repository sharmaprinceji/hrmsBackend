import UserRepository from "./user.repository.js";

import pool from "../../config/db.config.js";
import { logAudit } from "../../utils/auditLogger.js";

class UserService {

 static async updateUser(currentUser, targetUserId, data) {

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

  if (rows.length === 0 && currentUser.userId !== targetUserId) {
    throw new Error("You are not allowed to update this user");
  }

  const oldData = targetUser;

  await UserRepository.updateUser(targetUserId, data);

  await logAudit({
    userId: currentUser.userId,
    action: "update",
    entityType: "user",
    entityId: targetUserId,
    oldData,
    newData: data
  });

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

}

export default UserService;