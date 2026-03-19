import pool from "../../config/db.config.js";

class TaskRepository {

  static async createTask(data){

    const query = `
      INSERT INTO tasks
      (title,description,assigned_by,assigned_to,priority,due_date)
      VALUES (?,?,?,?,?,?)
    `;

    const [result] = await pool.execute(query,[
      data.title,
      data.description,
      data.assignedBy,
      data.assignedTo,
      data.priority,
      data.dueDate
    ]);

    return result.insertId;

  }

  static async getTasks(userId,roleId){

    let query = `
      SELECT
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        u1.name AS assigned_by,
        u2.name AS assigned_to
      FROM tasks t
      JOIN users u1 ON t.assigned_by = u1.id
      JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.deleted_at IS NULL
    `;

    const params = [];

    if(roleId === 5){ // employee
      query += " AND t.assigned_to=?";
      params.push(userId);
    }

    query += " ORDER BY t.created_at DESC";

    const [rows] = await pool.execute(query,params);

    return rows;

  }

  static async updateTask(id,data){

    const query = `
      UPDATE tasks
      SET
        title=?,
        description=?,
        priority=?,
        status=?,
        due_date=?
      WHERE id=? AND deleted_at IS NULL
    `;

    await pool.execute(query,[
      data.title,
      data.description,
      data.priority,
      data.status,
      data.dueDate,
      id
    ]);

  }

  static async deleteTask(id){

    const query = `
      UPDATE tasks
      SET deleted_at = NOW()
      WHERE id=?
    `;

    await pool.execute(query,[id]);

  }
    static async getTaskById(id){

  const query = `
     SELECT *
     FROM tasks
     WHERE id=? AND deleted_at IS NULL
  `;

  const [rows] = await pool.execute(query,[id]);

  return rows[0];

}

}

export default TaskRepository;