import pool from "../../config/db.config.js";

class HolidayRepository {

  static async createHoliday(data){

    const query = `
      INSERT INTO holidays(name,holiday_date,type)
      VALUES (?,?,?)
    `;

    const [result] = await pool.execute(query,[
      data.name,
      data.date,
      data.type
    ]);

    return result.insertId;

  }

  static async getHolidays(){

    const query = `
      SELECT *
      FROM holidays
      WHERE deleted_at IS NULL
      ORDER BY holiday_date
    `;

    const [rows] = await pool.execute(query);

    return rows;

  }

  static async updateHoliday(id,data){

    const query = `
      UPDATE holidays
      SET name=?,holiday_date=?,type=?
      WHERE id=?
    `;

    await pool.execute(query,[
      data.name,
      data.date,
      data.type,
      id
    ]);

  }

  static async deleteHoliday(id){

    const query = `
      UPDATE holidays
      SET deleted_at=NOW()
      WHERE id=?
    `;

    await pool.execute(query,[id]);

  }

}

export default HolidayRepository;