// 1. Email Verification Template
const emailVerificationTemplate = (otp) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Verse</h2>
      <p>Hi,</p>
      <p>Thank you for registering at <strong>Venue Verse</strong>. Use the following OTP to verify your email. This code is valid for 10 minutes:</p>
      <h2 style="background:#00466a; color:white; width:max-content; padding:10px; border-radius:5px;">${otp}</h2>
      <p>Regards,<br/>Venue Verse Team</p>
    </div>
  </div>
`;

// 2. Booking Successful Template
const bookingSuccessTemplate = (username, bookingId, isUpdate = false) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Verse</h2>
      <p>Hi ${username},</p>
      <p>
        ${
          isUpdate
            ? "Your booking has been successfully <strong>updated</strong>!"
            : "Your booking was successful! 🎉"
        }
      </p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p>The invoice is attached with this email for your reference.</p>
      <p>Thank you for choosing Venue Verse!</p>
      <p>Regards,<br/>Venue Verse Team</p>
    </div>
  </div>
`;

// 3. Order Successful Template
const orderSuccessTemplate = (username, orderId, totalAmount) => `
  <div style="font-family: Helvetica,Arial,sans-serif; line-height: 2">
    <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
      <h2 style="color:#00466a;">Venue Verse</h2>
      <p>Hi ${username},</p>
      <p>Your order has been placed successfully! 🛒</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> Rs: ${totalAmount}</p>
      <p>We'll notify you once your items are shipped.</p>
      <p>Thank you for shopping with Venue Verse!</p>
      <p>Regards,<br/>Venue Verse Team</p>
    </div>
  </div>
`;


const venueBookedByUserTemplate = (
  username,
  sellerName,
  bookingId,
  venueName,
  startTime,
  endTime,
  notes = ""
) => `
  <div style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background-color: #00466a; padding: 20px;">
        <h2 style="color: #ffffff; margin: 0;">New Booking Notification</h2>
      </div>
      <div style="padding: 20px;">
        <p>Hi <strong>${sellerName}</strong>,</p>
        <p><strong>${username}</strong> has just booked your venue/service <strong>"${venueName}"</strong>.</p>

        <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #555;"><strong>Booking ID:</strong></td>
            <td style="padding: 8px 0;">${bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #555;"><strong>Date & Time:</strong></td>
            <td style="padding: 8px 0;">${startTime} - ${endTime}</td>
          </tr>
          ${
            notes
              ? `<tr>
                  <td style="padding: 8px 0; color: #555;"><strong>Notes:</strong></td>
                  <td style="padding: 8px 0;">${notes}</td>
                </tr>`
              : ""
          }
        </table>

        <p style="margin-top: 20px;">Please log in to your dashboard to view and manage the booking.</p>
        
        <p>Best regards,<br><strong>Venue Verse Team</strong></p>
      </div>
    </div>
  </div>
`;


module.exports = {
  emailVerificationTemplate,
  bookingSuccessTemplate,
  orderSuccessTemplate,
  venueBookedByUserTemplate
};
