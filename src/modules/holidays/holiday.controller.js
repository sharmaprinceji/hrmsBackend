import HolidayService from "./holiday.service.js";
import { successResponse } from "../../utils/response.utils.js";

class HolidayController {

  static async createHoliday(req,res,next){

    try{

      const result = await HolidayService.createHoliday(req.body);

      return successResponse(res,result,"Holiday created successfully");

    }catch(err){
      next(err);
    }

  }

  static async getHolidays(req,res,next){

    try{

      const holidays = await HolidayService.getHolidays();

      return successResponse(res,holidays);

    }catch(err){
      next(err);
    }

  }

  static async updateHoliday(req,res,next){

    try{

      const result = await HolidayService.updateHoliday(
        req.params.id,
        req.body
      );

      return successResponse(res,result,"Holiday updated");

    }catch(err){
      next(err);
    }

  }

  static async deleteHoliday(req,res,next){

    try{

      await HolidayService.deleteHoliday(req.params.id);

      return successResponse(res,null,"Holiday deleted");

    }catch(err){
      next(err);
    }

  }

}

export default HolidayController;