
import { successResponse } from "../../utils/response.utils.js";
import UserService from "./user.service.js";

class UserController {

  static async updateUser(req,res,next){

    try{

      const userId = req.params.id;

      const result = await UserService.updateUser(
        req.user,
        userId,
        req.body
      );

      return successResponse(res,result,"User updated successfully");

    }catch(err){

      next(err);

    }

  }

  static async deleteUser(req,res,next){

    try{

      const userId = req.params.id;

      const result = await UserService.deleteUser(req.user,userId);

      return successResponse(res,result,"User deleted successfully");

    }catch(err){

      next(err);

    }

  }

  static async getUsers(req, res, next) {
  try {

    const users = await UserService.getUsers(req.user);

    return successResponse(res, users, "Users fetched successfully");

  } catch (err) {
    next(err);
  }
}

}

export default UserController;