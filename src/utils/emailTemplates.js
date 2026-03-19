export const otpTemplate = (otp) => {
  return `
  <div style="font-family: Arial; padding:20px;">
    <h2 style="color:#4CAF50;">HRMS Password Reset</h2>
    
    <p>Your OTP for password reset is:</p>
    
    <h1 style="
      background:#f4f4f4;
      padding:10px;
      text-align:center;
      letter-spacing:5px;
    ">
      ${otp}
    </h1>

    <p>This OTP will expire in <b>1 minute</b>.</p>

    <p>If you didn’t request this, please ignore this email.</p>

    <hr/>
    <small>HRMS System</small>
  </div>
  `;
};