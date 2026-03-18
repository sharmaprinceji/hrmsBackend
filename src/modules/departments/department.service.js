import DepartmentRepository from "./department.repository.js";

class DepartmentService {

    static async createDepartment(data) {

        const existing = await DepartmentRepository.findByName(data.name);

        if (existing) {
            throw new Error("Department already exists");
        }

        const departmentId = await DepartmentRepository.createDepartment(data);

        return { departmentId };

    }

    static async getDepartments() {

        return DepartmentRepository.getDepartments();

    }

    static async getDepartmentById(id) {

        const department = await DepartmentRepository.getDepartmentById(id);

        if (!department) {
            throw new Error("Department not found");
        }

        return department;

    }

    static async updateDepartment(id, data) {

        return DepartmentRepository.updateDepartment(id, data);

    }

    static async deleteDepartment(id) {

        return DepartmentRepository.deleteDepartment(id);

    }

}

export default DepartmentService;