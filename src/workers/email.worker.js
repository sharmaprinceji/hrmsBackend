import { Worker } from "bullmq";
import redisClient from "../config/redis.config.js";
import { sendOTP } from "../services/emailService.js";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("JOB RECEIVED:", job.name);

    const { email, otp } = job.data;

    console.log(`Sending OTP to ${email}`);

    await sendOTP(email, otp);

    console.log("Email sent");
  },
  {
    connection: redisClient
  }
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Job failed:", job.id, err.message);
});