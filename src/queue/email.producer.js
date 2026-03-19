import emailQueue from "./email.queue.js";

export const sendOtpEmailJob = async (email, otp) => {
    console.log("inside the queue !",email,otp);
    await emailQueue.add(
        "send-otp",
        { email, otp },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        }
    );
};