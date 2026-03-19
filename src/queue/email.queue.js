import { Queue } from "bullmq";
import redisClient from "../config/redis.config.js";

const emailQueue = new Queue("emailQueue", {
  connection: redisClient
});

export default emailQueue;