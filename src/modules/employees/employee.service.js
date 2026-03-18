import EmployeeRepository from "./employee.repository.js";

class EmployeeService {

  static async createEmployee(data){

    const existing = await EmployeeRepository.findByUserId(data.userId);

    if(existing){
      throw new Error("Employee already exists");
    }

    const employeeId = await EmployeeRepository.createEmployee(data);
    await EmployeeRepository.initializeLeaveBalances(employeeId);

    return {employeeId};

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