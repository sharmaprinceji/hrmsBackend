import { verifyRefreshToken } from "../utils/jwt.utils.js";
import pool from "../config/db.config.js";

const authMiddleware = async (req, res, next) => {

  try {

    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
      });
    }

    const token = header.split(" ")[1];

    // const isBlacklisted = await redisClient.get(`blacklist:${token}`);

    // if (isBlacklisted) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Token expired or logged out"
    //   });
    // }

    // console.log("Received token:", token); // Debug log
    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    const query = `
      SELECT id, token_version, status
      FROM users
      WHERE id=? AND deleted_at IS NULL
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [decoded.userId]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = rows[0];

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    // Token version check (logout from all devices)
    if (user.token_version !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

};

export default authMiddleware;