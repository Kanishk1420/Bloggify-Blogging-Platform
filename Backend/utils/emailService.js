import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

// Set your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,
      from: 'Kanishkgupta2003@outlook.com',
      subject: options.subject,
      html: options.htmlContent,
    };
    
    console.log(`Sending email to: ${options.email}`);
    const result = await sgMail.send(msg);
    console.log('Email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error response:', error.response.body);
    }
    throw error;
  }
};

export default { sendEmail };