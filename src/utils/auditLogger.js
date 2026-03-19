import pool from "../config/db.config.js";

export async function logAudit({
 userId,
 action,
 entityType,
 entityId,
 oldData,
 newData,
 ip
}){

 const query = `
  INSERT INTO audit_logs
  (user_id,action,entity_type,entity_id,old_data,new_data,ip_address)
  VALUES (?,?,?,?,?,?,?)
 `;

 await pool.execute(query,[
  userId,
  action,
  entityType,
  entityId,
  JSON.stringify(oldData),
  JSON.stringify(newData),
  ip
 ]);

}