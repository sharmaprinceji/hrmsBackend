import TaskService from "./task.service.js";
import { successResponse } from "../../utils/response.utils.js";

class TaskController {

  static async createTask(req,res,next){

    try{

      const result = await TaskService.createTask(req.user.userId,req.body);

      return successResponse(res,result,"Task created successfully");

    }catch(err){
      next(err);
    }

  }

  static async getTasks(req,res,next){

    try{

      const tasks = await TaskService.getTasks(req.user);

      return successResponse(res,tasks);

    }catch(err){
      next(err);
    }

  }

  static async updateTask(req,res,next){

    try{

      const result = await TaskService.updateTask(req.params.id,req.body);

      return successResponse(res,result,"Task updated");

    }catch(err){
      next(err);
    }

  }

  static async deleteTask(req,res,next){

    try{

      await TaskService.deleteTask(req.params.id);

      return successResponse(res,null,"Task deleted");

    }catch(err){
      next(err);
    }

  }

}

export default TaskController;