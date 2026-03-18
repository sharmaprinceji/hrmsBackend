import DepartmentService from "./department.service.js";
import { successResponse } from "../../utils/response.utils.js";

class DepartmentController {

    static async createDepartment(req, res, next) {

        try {

            const result = await DepartmentService.createDepartment(req.body);

            return successResponse(res, result, "Department created");

        } catch (err) {
            next(err);
        }

    }

    static async getDepartments(req, res, next) {

        try {

            const departments = await DepartmentService.getDepartments();

            return successResponse(res, departments);

        } catch (err) {
            next(err);
        }

    }

    static async getDepartmentById(req, res, next) {

        try {

            const department = await DepartmentService.getDepartmentById(req.params.id);

            return successResponse(res, department);

        } catch (err) {
            next(err);
        }

    }

    static async updateDepartment(req, res, next) {

        try {

            const result = await DepartmentService.updateDepartment(req.params.id, req.body);

            return successResponse(res, result, "Department updated");

        } catch (err) {
            next(err);
        }

    }

    static async deleteDepartment(req, res, next) {

        try {

            await DepartmentService.deleteDepartment(req.params.id);

            return successResponse(res, null, "Department deleted");

        } catch (err) {
            next(err);
        }

    }

}

export default DepartmentController;