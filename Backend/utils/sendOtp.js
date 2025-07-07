import { sendEmail } from './emailService.js';  // Import from emailService.js instead
import dotenv from "dotenv";
dotenv.config();

const templateVerificationCode = (verificationCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email</h2>
        <p style="color: #666; margin-bottom: 30px;">Please use the verification code below to complete your registration:</p>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 20px;">
          <code style="font-size: 24px; color: #007bff; letter-spacing: 3px;">${verificationCode}</code>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
      </div>
    </div>
  `;
};

// Create a proper sendVerificationEmail function
export const sendVerificationEmail = async (verificationCode, email, name) => {
  if (verificationCode && email && name) {
    try {
      await sendEmail({
        email: email,
        subject: "Verify Your Email - Blogging Platform",
        htmlContent: templateVerificationCode(verificationCode),
      });
      console.log("Verification email sent successfully to:", name + " (" + email + ")");
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }
};

export const sendSuccessResetPassword = async (email) => {
  if (email) {
    try {
      await sendEmail({
        email: email,
        subject: "Password Reset Successful - Blogging Platform",
        htmlContent: `
          <div style="text-align: center; padding: 20px;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#007bff"/>
              <path d="M7 12l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2 style="color: #007bff; margin-top: 10px;">Password Reset Successful</h2>
          </div>
          <p>Hi,</p>
          <p>Your password has been successfully reset for your <strong>Blogging Platform</strong> account.</p>
          <p>If you made this change, no further action is needed.</p>
          <p>If you did <strong>not</strong> request a password reset, please contact our support team immediately.</p>
          <p>Best regards,<br><strong>The Blogging Platform Team</strong></p>
        `
      });
      console.log("Password reset success email sent to:", email);
      return true;
    } catch (error) {
      console.error("Error sending password reset success email:", error);
      return false;
    }
  }
};
