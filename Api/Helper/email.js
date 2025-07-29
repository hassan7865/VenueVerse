const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @returns {Promise<boolean>}
 */
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const info = await transporter.sendMail({
      from: `"VenueVenture 👻" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments, // ⬅️ Added attachments here
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return false;
  }
};


module.exports = sendEmail;
