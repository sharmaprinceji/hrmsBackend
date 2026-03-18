import LeaveRepository from "./leave.repository.js";
import pool from "../../config/db.config.js";

class LeaveService {

  static async applyLeave(userId,data){
    console.log("Applying leave for userId:", userId, "with data:", data);
    const employee = await LeaveRepository.getEmployeeByUserId(userId);

    if(!employee){
      throw new Error("Employee not found");
    }

    const days =
      (new Date(data.endDate) - new Date(data.startDate)) /
      (1000*60*60*24) + 1;

    const balance = await LeaveRepository.getLeaveBalance(
      employee.id,
      data.leaveTypeId
    );

    if(!balance){
      throw new Error("Leave balance not found");
    }

    if(balance.remaining_leaves < days){
      throw new Error("Not enough leave balance");
    }

    return LeaveRepository.createLeaveRequest({
      employeeId:employee.id,
      leaveTypeId:data.leaveTypeId,
      startDate:data.startDate,
      endDate:data.endDate,
      days,
      reason:data.reason
    });

  }

  static async getLeaveRequests(){

    return LeaveRepository.getLeaveRequests();

  }

  static async approveLeave(leaveId,approverId){

    const conn = await pool.getConnection();

    try{

      await conn.beginTransaction();

      const leave = await LeaveRepository.getLeaveById(leaveId,conn);

      if(!leave){
        throw new Error("Leave request not found");
      }

      if(leave.status !== "pending"){
        throw new Error("Leave already processed");
      }

      const balance = await LeaveRepository.getLeaveBalance(
        leave.employee_id,
        leave.leave_type_id,
        conn
      );

      if(balance.remaining_leaves < leave.days){
        throw new Error("Insufficient leave balance");
      }

      await LeaveRepository.updateLeaveStatus(
        leaveId,
        "approved",
        approverId,
        conn
      );

      await LeaveRepository.updateLeaveBalance(
        leave.employee_id,
        leave.leave_type_id,
        leave.days,
        conn
      );

      await conn.commit();

      return {approved:true};

    }catch(err){

      await conn.rollback();
      throw err;

    }finally{

      conn.release();

    }

  }

  static async rejectLeave(leaveId,approverId){

    return LeaveRepository.updateLeaveStatus(
      leaveId,
      "rejected",
      approverId
    );

  }

}

export default LeaveService;