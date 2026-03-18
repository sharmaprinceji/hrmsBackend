import AttendanceService from "./attendance.service.js";
import { successResponse } from "../../utils/response.utils.js";

class AttendanceController {
 
  static async checkIn(req,res,next){

    try{

      const result = await AttendanceService.checkIn(req.user.userId);

      return successResponse(res,result,"Check-in successful");

    }catch(err){
      next(err);
    }

  }

  static async checkOut(req,res,next){

    try{

      const result = await AttendanceService.checkOut(req.user.userId);

      return successResponse(res,result,"Check-out successful");

    }catch(err){
      next(err);
    }

  }

  static async markAttendance(req,res,next){

  try{

    const result = await AttendanceService.markAttendance(req.body);

    return successResponse(res,result,"Attendance marked");

  }catch(err){
    next(err);
  }

}

  static async monthlyReport(req,res,next){

    try{

      const {month,year} = req.query;

      const report = await AttendanceService.monthlyReport(month,year);

      return successResponse(res,report);

    }catch(err){
      next(err);
    }

  }

}

export default AttendanceController;