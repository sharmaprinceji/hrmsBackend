import PayrollService from "./payroll.service.js";
import { successResponse } from "../../utils/response.utils.js";

class PayrollController {

  static async generatePayroll(req,res,next){

    try{

      const result = await PayrollService.generatePayroll(req.body);

      return successResponse(res,result,"Payroll generated");

    }catch(err){
      next(err);
    }

  }

  static async getEmployeePayroll(req,res,next){

    try{

      const payroll = await PayrollService.getEmployeePayroll(req.params.employeeId);

      return successResponse(res,payroll);

    }catch(err){
      next(err);
    }

  }

}

export default PayrollController;