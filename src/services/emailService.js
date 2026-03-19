import nodemailer from "nodemailer";
import { otpTemplate } from "../utils/emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "princesh1411@gmail.com",
    pass: "gvgvlfovpjihzwbl"
  }
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"HRMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: otpTemplate(otp)
  });
};