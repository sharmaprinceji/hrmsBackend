import redisClient from "../config/redis.config.js";
import pool from "../config/db.config.js";

const permissionMiddleware = (module, action) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.roleId;
      const cacheKey = `role_permissions:${roleId}`;

      let permissions = null;

      // ✅ 1. Try cache
      if (redisClient) {
        permissions = await redisClient.get(cacheKey);
        // console.log("Permissions from cache:", permissions);
      }

      // ✅ 2. If not in cache → fetch from DB
      if (!permissions) {
        const query = `
          SELECT p.module, p.action
          FROM permissions p
          JOIN role_permissions rp
          ON rp.permission_id = p.id
          WHERE rp.role_id = ?
        `;

        const [rows] = await pool.execute(query, [roleId]);

        permissions = rows;

        // ✅ 3. Store directly (NO stringify)
        if (redisClient) {
          await redisClient.set(cacheKey, permissions, {
            ex: 300, // 5 min cache
          });
        }
      }

      // ✅ 4. Check permission
      const allowed = permissions.find(
        (p) => p.module === module && p.action === action
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: `You are not allowed to ${action} ${module}`,
        });
      }

      // console.log("permissions done=====>");

      next();

    } catch (error) {
      console.error("Permission middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

export default permissionMiddleware;