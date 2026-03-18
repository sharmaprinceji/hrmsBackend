import pool from "../config/db.config.js";

const roleHierarchy = (targetRoleField = "roleId") => {
  return async (req, res, next) => {

    const managerRoleId = req.user.roleId;
    const targetRoleId = req.body[targetRoleField] || req.params.roleId;

    const query = `
      SELECT id
      FROM role_manage_rules
      WHERE manager_role_id=? AND target_role_id=?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query,[managerRoleId,targetRoleId]);

    if(rows.length === 0){
      return res.status(403).json({message:"You cannot manage this role"});
    }

    next();

  };
};

export default roleHierarchy;