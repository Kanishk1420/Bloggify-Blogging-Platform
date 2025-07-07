import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();
// Configure API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO || "";

// Create TransactionalEmailsApi instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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

export const sendEmail = async (verificationCode, email, name) => {
  if (verificationCode && email && name) {
    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        name: "Stack Spot",
        email: "bhashivira@gmail.com",
      },
      subject: "Verify Your Email - Stack Spot",
      textContent: `Hi ${name},\n\nWelcome Stack Spot! We're thrilled to have you join our community of forward-thinking innovators.\n\nYour account is now active and ready to use. Here's what you can do next:\n\n1. Explore our AI tools and features\n2. Check out our quickstart guides\n3. Set up your profile preferences\n\nIf you have any questions, our support team is available 24/7 at support@overnightai.com.\n\nBest regards,\nThe Overnight AI Team`,
      htmlContent: templateVerificationCode(verificationCode),
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Email sent successfully to:", name + " " + email);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};

export const sendSuccessResetPassword = async (email) => {
  if (email) {
    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        name: "Overnight AI",
        email: "bhashivira@gmail.com",
      },
      subject: "Password Reset Successful - Overnight AI",
      textContent: `Hi,\n\nYour password has been successfully reset. If you didn't make this change, please contact our support team immediately.\n\nBest regards,\nThe Overnight AI Team`,
      htmlContent: `
        <div style="text-align: center; padding: 20px;">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#007bff"/>
            <path d="M7 12l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 style="color: #007bff; margin-top: 10px;">Password Reset Successful</h2>
        </div>
        <p>Hi,</p>
        <p>Your password has been successfully reset for your <strong>Overnight AI</strong> account.</p>
        <p>If you made this change, no further action is needed.</p>
        <p>If you did <strong>not</strong> request a password reset, please contact our support team immediately.</p>
        <p>For any assistance, reach out to us</p>
        <p>Best regards,<br><strong>The Overnight AI Team</strong></p>
      `,
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Password reset success email sent to:", email);
    } catch (error) {
      console.error("Error sending password reset success email:", error);
    }
  }
};
