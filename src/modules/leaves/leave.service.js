import LeaveRepository from "./leave.repository.js";
import pool from "../../config/db.config.js";

class LeaveService {

  // =========================
  // APPLY LEAVE
  // =========================
  static async applyLeave(userId, data) {

    const employee = await LeaveRepository.getEmployeeByUserId(userId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // 🔍 Check overlap
    const overlap = await LeaveRepository.checkOverlap(
      employee.id,
      data.startDate,
      data.endDate
    );

    if (overlap) {
      throw new Error("Leave dates overlap with existing leave");
    }

    // 🔍 Date validation
    if (new Date(data.endDate) < new Date(data.startDate)) {
      throw new Error("End date cannot be before start date");
    }

    // 📅 Calculate days
    const days = Math.ceil(
      (new Date(data.endDate) - new Date(data.startDate)) /
      (1000 * 60 * 60 * 24)
    ) + 1;

    // 🔍 Check leave balance
    const balance = await LeaveRepository.getLeaveBalanceByType(
      employee.id,
      data.leaveTypeId
    );

    if (!balance) {
      throw new Error("Leave balance not found");
    }

    if (balance.remaining_leaves < days) {
      throw new Error("Not enough leave balance");
    }

    // ✅ Create request
    return LeaveRepository.createLeaveRequest({
      employeeId: employee.id,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason
    });
  }

  // =========================
  // GET ALL LEAVES (HR/Admin)
  // =========================
  static async getAllLeaves() {
    return LeaveRepository.getLeaveBalancesAll();
  }

  // =========================
  // GET MY LEAVES
  // =========================
  static async getLeaveBalance(userId) {
    return LeaveRepository.getLeaveBalancesByUser(userId);
  }

  // =========================
  // GET LEAVE REQUESTS (LIST)
  // =========================
  static async getLeaveRequests(currentUser) {

    // 👤 Employee → only own
    if (currentUser.roleId === 5) {
      return LeaveRepository.getMyLeaveRequests(currentUser.userId);
    }

    // 👨‍💼 HR / Manager / Admin → all
    return LeaveRepository.getLeaveRequests();
  }

  // =========================
  // APPROVE LEAVE
  // =========================
  static async approveLeave(leaveId, approverId) {

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const leave = await LeaveRepository.getLeaveById(leaveId, conn);

      if (!leave) {
        throw new Error("Leave request not found");
      }

      if (leave.status !== "pending") {
        throw new Error("Leave already processed");
      }

      // 🔍 Check balance
      const balance = await LeaveRepository.getLeaveBalanceByType(
        leave.employee_id,
        leave.leave_type_id,
        conn
      );

      if (balance.remaining_leaves < leave.days) {
        throw new Error("Insufficient leave balance");
      }

      // ✅ Update status
      await LeaveRepository.updateLeaveStatus(
        leaveId,
        "approved",
        approverId,
        conn
      );

      // ✅ Deduct leave
      await LeaveRepository.updateLeaveBalance(
        leave.employee_id,
        leave.leave_type_id,
        leave.days,
        conn
      );

      await conn.commit();

      return { approved: true };

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // =========================
  // REJECT LEAVE
  // =========================
  static async rejectLeave(leaveId, approverId) {

    const leave = await LeaveRepository.getLeaveById(leaveId);

    if (!leave) {
      throw new Error("Leave request not found");
    }

    if (leave.status !== "pending") {
      throw new Error("Already processed");
    }

    return LeaveRepository.updateLeaveStatus(
      leaveId,
      "rejected",
      approverId
    );
  }

}

export default LeaveService;