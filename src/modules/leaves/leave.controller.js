import LeaveService from "./leave.service.js";
import { successResponse } from "../../utils/response.utils.js";

class LeaveController {

  static async applyLeave(req,res,next){

    try{

      const result = await LeaveService.applyLeave(req.user.userId,req.body);

      return successResponse(res,result,"Leave request submitted");

    }catch(err){
      next(err);
    }

  }

  static async getLeaveRequests(req,res,next){

    try{

      const leaves = await LeaveService.getLeaveRequests();

      return successResponse(res,leaves);

    }catch(err){
      next(err);
    }

  }

  static async getAllLeaves(req,res,next){

    try{

      const leaves = await LeaveService. getAllLeaves();

      return successResponse(res,leaves);

    }catch(err){
      next(err);
    }
  }

 static async getMyLeaves(req, res, next) {
  try {
    const employeeId = req.user.userId; 
   
    const leaves = await LeaveService.getLeaveBalance(employeeId);

    return successResponse(res, leaves);

  } catch (err) {
    next(err);
  }
}
  

  static async approveLeave(req,res,next){

    try{

      const result = await LeaveService.approveLeave(req.params.id,req.user.userId);

      return successResponse(res,result,"Leave approved");

    }catch(err){
      next(err);
    }

  }

  static async rejectLeave(req,res,next){

    try{

      const result = await LeaveService.rejectLeave(req.params.id,req.user.userId);

      return successResponse(res,result,"Leave rejected");

    }catch(err){
      next(err);
    }

  }

}

export default LeaveController;