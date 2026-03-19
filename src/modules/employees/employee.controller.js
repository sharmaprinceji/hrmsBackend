import EmployeeService from "./employee.service.js";
import { successResponse } from "../../utils/response.utils.js";

class EmployeeController {

  static async createEmployee(req, res, next) {
    try {
      const result = await EmployeeService.createEmployee(req.body);
      return successResponse(res, result, "Employee created");
    } catch (err) {
      next(err);
    }
  }

  static async getEmployees(req, res, next) {
    try {
      const employees = await EmployeeService.getEmployees();
      return successResponse(res, employees);
    } catch (err) {
      next(err);
    }
  }

  static async getEmployeeById(req, res, next) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id);
      return successResponse(res, employee);
    } catch (err) {
      next(err);
    }
  }

  static async updateEmployee(req, res, next) {
    try {
      const result = await EmployeeService.updateEmployee(
        req.params.id,
        req.body,
        req.user   // ✅ FULL USER OBJECT
      );

      return successResponse(res, result, "Employee updated");
    } catch (err) {
      next(err);
    }
  }

  static async deleteEmployee(req, res, next) {
    try {
      await EmployeeService.deleteEmployee(req.params.id);
      return successResponse(res, null, "Employee deleted");
    } catch (err) {
      next(err);
    }
  }
}

export default EmployeeController;