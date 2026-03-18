import redisClient from "../config/redis.config.js";
import pool from "../config/db.config.js";

const permissionMiddleware = (module,action)=>{

  return async (req,res,next)=>{

    const roleId = req.user.roleId;

    const cacheKey = `role_permissions:${roleId}`;

    let permissions = await redisClient.get(cacheKey);

    if(!permissions){

      const query = `
        SELECT p.module,p.action
        FROM permissions p
        JOIN role_permissions rp
        ON rp.permission_id=p.id
        WHERE rp.role_id=?
      `;

      const [rows] = await pool.execute(query,[roleId]);

      permissions = rows;

      await redisClient.set(cacheKey,JSON.stringify(rows));

    }else{

      permissions = JSON.parse(permissions);

    }

    const allowed = permissions.find(
      p => p.module === module && p.action === action
    );

    if(!allowed){
      return res.status(403).json({
        success:false,
        message:`You are not allowed to ${action} ${module}`
      });
    }

    next();

  };

};

export default permissionMiddleware;