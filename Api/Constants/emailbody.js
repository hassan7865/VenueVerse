// 1. Email Verification Template
const emailVerificationTemplate = (otp) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Venture</h2>
      <p>Hi,</p>
      <p>Thank you for registering at <strong>Venue Venture</strong>. Use the following OTP to verify your email. This code is valid for 10 minutes:</p>
      <h2 style="background:#00466a; color:white; width:max-content; padding:10px; border-radius:5px;">${otp}</h2>
      <p>Regards,<br/>Venue Venture Team</p>
    </div>
  </div>
`;

// 2. Booking Successful Template
const bookingSuccessTemplate = (username, bookingId) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Venture</h2>
      <p>Hi ${username},</p>
      <p>Your booking was successful! 🎉</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p>The invoice is attached with this email for your reference.</p>
      <p>Thank you for choosing Venue Venture!</p>
      <p>Regards,<br/>Venue Venture Team</p>
    </div>
  </div>
`;

// 3. Order Successful Template
const orderSuccessTemplate = (username, orderId, totalAmount) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Venture</h2>
      <p>Hi ${username},</p>
      <p>Your order has been placed successfully! 🛒</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> $${totalAmount}</p>
      <p>We'll notify you once your items are shipped.</p>
      <p>Thank you for shopping with Venue Venture!</p>
      <p>Regards,<br/>Venue Venture Team</p>
    </div>
  </div>
`;

module.exports = {
  emailVerificationTemplate,
  bookingSuccessTemplate,
  orderSuccessTemplate,
};
