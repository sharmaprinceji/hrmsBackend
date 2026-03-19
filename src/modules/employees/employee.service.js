import EmployeeRepository from "./employee.repository.js";
import pool from "../../config/db.config.js";

class EmployeeService {
  static async createEmployee(data){

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    const existing = await EmployeeRepository.findByUserId(data.userId, connection);

    if(existing){
      throw new Error("Employee already exists");
    }

    const employeeId = await EmployeeRepository.createEmployee(data, connection);

    await EmployeeRepository.initializeLeaveBalances(employeeId, connection);

    await connection.commit();

    return { employeeId };

  } catch (err) {

    await connection.rollback();
    throw err;

  } finally {
    connection.release();
  }
}

  static async getEmployees(){

    return EmployeeRepository.getEmployees();

  }

  static async getEmployeeById(id){

    const employee = await EmployeeRepository.getEmployeeById(id);

    if(!employee){
      throw new Error("Employee not found");
    }

    return employee;

  }

  static async updateEmployee(id,data){

    return EmployeeRepository.updateEmployee(id,data);

  }

  static async deleteEmployee(id){

    return EmployeeRepository.deleteEmployee(id);

  }

}

export default EmployeeService;