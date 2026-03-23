// import pool from "../config/db.config.js";

// export async function logAudit({
//  userId,
//  action,
//  entityType,
//  entityId,
//  oldData,
//  newData,
//  ip
// }){

//  const query = `
//   INSERT INTO audit_logs
//   (user_id,action,entity_type,entity_id,old_data,new_data,ip_address)
//   VALUES (?,?,?,?,?,?,?)
//  `;

//  await pool.execute(query,[
//   userId,
//   action,
//   entityType,
//   entityId,
//   JSON.stringify(oldData),
//   JSON.stringify(newData),
//   ip
//  ]);

// }

import pool from "../config/db.config.js";

// ✅ helper to clean undefined → null
const cleanJSON = (obj) => {
  if (!obj) return null;

  const cleaned = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  );

  return JSON.stringify(cleaned);
};

export const logAudit= async ({
  userId,
  action,
  entityType,
  entityId,
  oldData,
  newData,
  ip,
}) =>{
  try {
    const query = `
      INSERT INTO audit_logs
      (user_id, action, entity_type, entity_id, old_data, new_data, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      userId ?? null,
      action ?? null,
      entityType ?? null,
      entityId ?? null,
      cleanJSON(oldData),
      cleanJSON(newData),
      ip ?? null,
    ]);
  } catch (err) {
    // 🔥 IMPORTANT: never break main flow
    console.error("Audit Log Failed:", err.message);
  }
}