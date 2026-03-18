import AttendanceRepository from "./attendance.repository.js";

class AttendanceService {

    static async checkIn(userId) {

        const employee = await AttendanceRepository.getEmployeeByUserId(userId);

        if (!employee) {
            throw new Error("Employee not found");
        }

        const today = new Date().toISOString().split("T")[0];

        const existing = await AttendanceRepository.getAttendance(employee.id, today);

        if (existing) {
            throw new Error("Already checked in today");
        }

        return AttendanceRepository.createCheckIn(employee.id, today);

    }

    static async checkOut(userId) {

        const employee = await AttendanceRepository.getEmployeeByUserId(userId);

        const today = new Date().toISOString().split("T")[0];

        const attendance = await AttendanceRepository.getAttendance(
            employee.id,
            today
        );

        if (!attendance) {
            throw new Error("Check-in not found");
        }

        if (attendance.check_out) {
            throw new Error("Already checked out");
        }

        return AttendanceRepository.updateCheckOut(attendance.id);

    }

    static async monthlyReport(month, year) {
        return AttendanceRepository.monthlyReport(month, year);
    }

    static async markAttendance(data) {

        const today = new Date().toISOString().split("T")[0];

        const existing = await AttendanceRepository.getAttendance(
            data.employeeId,
            today
        );

        if (existing) {
            throw new Error("Attendance already marked");
        }

        return AttendanceRepository.createAttendance({
            employeeId: data.employeeId,
            status: data.status
        });

    }

}

export default AttendanceService;