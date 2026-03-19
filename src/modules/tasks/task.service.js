import TaskRepository from "./task.repository.js";

class TaskService {

  static async createTask(userId,data){

    if(!data.title || !data.assignedTo){
      throw new Error("Title and assignedTo are required");
    }

    const taskId = await TaskRepository.createTask({
      title:data.title,
      description:data.description,
      assignedBy:userId,
      assignedTo:data.assignedTo,
      priority:data.priority || "medium",
      dueDate:data.dueDate
    });

    return {taskId};

  }

  static async getTasks(user){

    return TaskRepository.getTasks(user.userId,user.roleId);

  }

 static async updateTask(id,data){

  const task = await TaskRepository.getTaskById(id);

  if(!task){
     throw new Error("Task not found");
  }

  const currentStatus = task.status;
  const newStatus = data.status;

  const validTransitions = {
    todo: ["in_progress"],
    in_progress: ["completed"],
    completed: []
  };

  if(newStatus && !validTransitions[currentStatus].includes(newStatus)){
     throw new Error(`Invalid status change from ${currentStatus} to ${newStatus}`);
  }

  await TaskRepository.updateTask(id,data);

  return {updated:true};

}

  static async deleteTask(id){

    await TaskRepository.deleteTask(id);

    return {deleted:true};

  }

}

export default TaskService;