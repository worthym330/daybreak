import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLeadNotification = async (leadData: any) => {
  const mailOptions = {
    to: process.env.MAILTO,
    subject: `New Lead Generated ${leadData.hotelName}`,
    html: ` 
    <p>Hello,</p>
    <p>A new lead has been generated with the following details:</p>
    <ul>
      <li>Email: ${leadData.email}</li>
      <li>Full Name: ${leadData.fullName}</li>
      <li>Hotel Name: ${leadData.hotelName}</li>
      <li>Designation: ${leadData.designation || "Not provided"}</li>
      <li>Contact number: ${leadData.contactNo}</li>
      <li>Status: ${leadData.status}</li>
    </ul>
    <p>Thank you.</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Lead notification email sent");
  } catch (error) {
    console.error("Error sending lead notification email:", error);
  }
};

export const sendToCustomer = async (leadData: any) => {
  try {
    const { email, fullName } = leadData;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Sign Up Confirmation and Onboarding Process`,
      html: ` 
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #B5813F;
            color: #fff;
            padding: 5px 0 5px 0;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to DayBreakPass!</h1>
        </div>
        <div class="content">
            <p>Hello ${fullName},</p>
            <p>Congratulations! Your sign-up with daybreakpass is complete, and we're excited to begin your onboarding
                process.
            </p>
            <p>Welcome aboard! We're delighted to have you join us. Expect a call soon from one of our representatives.
            </p>
            <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862" >8369029862</a> or email us at
               <a href="mailto:team@daybreakpass.com"> team@daybreakpass.com</a>.
            </p>
            <p>Best regards,<br>The Team daybreakpass</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 daybreakpass. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending lead notification email:", error);
  }
};

export const askForPermissionToAddHotel = async (data: any) => {
  try {
    const { name, email, ownerName } = data;
    const mailOptions = {
      to: process.env.MAILTO,
      subject: `Request for Permission to Add New Hotel: ${name}`,
      html: `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #B5813F;
            color: #fff;
            padding: 5px 0 5px 0;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Permission Request: Add New Hotel</h1>
        </div>
        <div class="content">
            <p>Hello Admin,</p>
            <p>Mr. ${ownerName} has requested to add a new hotel to our platform:</p>
            <p><strong>Hotel Name:</strong> ${name}</p>
            <p><strong>Hotel User Email:</strong> ${email}</p>
            <p>Please review the request and provide your approval or any additional instructions.</p>
            <p>Best regards,<br>The Team DayBreakPass</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending permission request email:", error);
  }
};

export const notifyHotelUserRequestReceived = async (data: any) => {
  try {
    const { name, email, ownerName } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your Request to Add ${name} is Being Reviewed`,
      html: `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #B5813F;
            color: #fff;
            padding: 5px 0 5px 0;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Request is Being Reviewed</h1>
        </div>
        <div class="content">
            <p>Hello ${ownerName},</p>
            <p>Thank you for your request to add ${name} to DayBreakPass. Your request is currently being reviewed by our team.</p>
            <p>We will notify you once the review is complete and the hotel is added to our platform.</p>
            <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862" >8369029862</a> or email us at <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.</p>
            <p>Best regards,<br>The Team DayBreakPass</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const sendCredentials = async (data: any) => {
  try {
    const { email, password, name } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your DayBreakPass Account Credentials`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for registering with us. Here are your credentials:</p>
          <p><strong>Email Id:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>Please keep this information safe and do not share it with anyone.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

// User Mails

export const resetPass = async (data: any) => {
  try {
    const { email, name, token } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Reset Your Password`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email or contact support.</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
              <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
          </p>
          <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const incompeleteBooking = async (data: any) => {
  try {
    const { email, name } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Complete Your Booking at DayBreakPass`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
        <p>Dear ${name},</p>
        <p>We noticed that you left your booking incomplete. Please return to complete your booking:</p>
        <p><a href="${process.env.FRONTEND_URL}/checkout">Complete Booking</a></p>
        <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const PaymentSuccess = async (
  data: any,
  bookingId?: string | null | undefined
) => {
  try {
    const { email, name, date } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Payment Successful for Your Booking`,
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Invoice for Hotel Booking</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            /* background-color: #fe6a06; */
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header img {
            max-width: 150px; /* Adjust logo size */
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #fe6a06;
            font-size: 18px;
        }
        .button {
            text-align: center;
            margin: 20px 0;
        }
        .button a {
            background-color: #fe6a06;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #555555;
        }
        .footer a {
            color: #00c0cb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Logo added here -->
            <img src="https://example.com/path/to/logo.png" alt="DayBreakPass Logo">
            <h1>DayBreakPass</h1>
        </div>
        <div class="content">
            <h2>Important Update</h2>
            <p>Dear ${name},</p>
            <p>Please find attached the Invoice for your Hotel booking (${bookingId}) with DayBreakPass on ${date}. <strong>(Your Invoice is not a valid travel document).</strong></p>
            <p>For all further details, please visit <a href="https://www.daybreakpass.com/my-bookings">My Bookings</a>.</p>
            <p>Regards,<br>Team DayBreakPass</p>
        </div>
        <div class="button">
            <a href="https://www.daybreakpass.com/my-bookings">View My Invoice</a>
        </div>
        <div class="footer">
            <p>P.S.: This is a system-generated email. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const PaymentFailed = async (data: any) => {
  try {
    const { email, name, hotelName, date, amount } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Payment Failed for Your Booking`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We're happy to inform you that your payment for the booking at ${hotelName} was not successful.</p>
          <p>Your booking details:
            Check-in: ${date} <br />
            Total Amount: ${amount} <br />
          </p>
          <p>We look forward to hosting you!</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const BookingConfirmation = async (data: any) => {
  try {
    const { email, name, hotelName, date, amount } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Our Booking Confirmation at ${hotelName}`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Your booking at ${hotelName} is confirmed!</p>
          <p>Your booking details:
            Check-in: ${date} <br />
            Total Amount: ${amount} <br />
          </p>
          <p>We look forward to hosting you!</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const BookingCancellation = async (data: any) => {
  try {
    const { email, name, hotelName, date, amount } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your Booking at ${hotelName} Has Been Cancelled`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <<div class="content">
          <p>Hello ${name},</p>
          <p>Your booking at ${hotelName} is confirmed!</p>
          <p>Your booking details:
            Check-in: ${date} <br />
            Total Amount: ${amount} <br />
          </p>
          <p>If you have any questions or need further assistance, please contact our support team.</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const FeedBack = async (data: any) => {
  try {
    const { email, hotelName, hotelId, name } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your feedback`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We hope you enjoyed your recent stay at ${hotelName}. We'd love to hear your thoughts!</p>
          <p>Please take a moment to leave a review <a href="${process.env.FRONTEND_URL}/review/${hotelId}" target="_blank">${process.env.FRONTEND_URL}/review/${hotelId}</a>.</p>
          <p>Your feedback helps us improve our services.</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const Support = async (data: any) => {
  try {
    const { email, name, subject, description } = data;
    const mailOptions = {
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your DayBreakPass Account Credentials`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We've received your support request. Our team is currently reviewing your ticket and will get back to you shortly.</p>
          <p>Ticket Details:
            Subject: ${subject} <br />
            Description: ${description} <br />
          </p>
          <p>Your feedback helps us improve our services.</p>
          <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862">8369029862</a> or email us at
            <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.
        </p>
        <p>Best regards,<br>The Team at DayBreakPass</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

// User Mails end

//Hotels Mail

// export const PaymentMail = async (data: any) => {
//   try {
//     const { email, password } = data;
//     const mailOptions = {
//       to: email,
// cc:process.env.SMTP_USER,
//       subject: `Your DayBreakPass Account Credentials`,
//       html: `
//        <!DOCTYPE html>
//   <html>
//     <head>
//       <style>
//         .container {
//           font-family: Arial, sans-serif;
//           margin: 20px;
//           padding: 20px;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//         }
//         .header {
//           background-color: #B5813F;
//           padding: 10px;
//           text-align: center;
//           border-bottom: 1px solid #ccc;
//         }
//         .content {
//           margin-top: 20px;
//         }
//         .footer {
//           margin-top: 20px;
//           text-align: center;
//           color: #888;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to DayBreakPass</h1>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>Thank you for registering with us. Here are your credentials:</p>
//           <p><strong>Email Id:</strong> ${email}</p>
//           <p><strong>Password:</strong> ${password}</p>
//           <p>Please keep this information safe and do not share it with anyone.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending request received email:", error);
//   }
// };

// export const ReviewMail = async (data: any) => {
//   try {
//     const { email, password } = data;
//     const mailOptions = {
//       to: email,
// cc:process.env.SMTP_USER,
//       subject: `Your DayBreakPass Account Credentials`,
//       html: `
//        <!DOCTYPE html>
//   <html>
//     <head>
//       <style>
//         .container {
//           font-family: Arial, sans-serif;
//           margin: 20px;
//           padding: 20px;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//         }
//         .header {
//           background-color: #B5813F;
//           padding: 10px;
//           text-align: center;
//           border-bottom: 1px solid #ccc;
//         }
//         .content {
//           margin-top: 20px;
//         }
//         .footer {
//           margin-top: 20px;
//           text-align: center;
//           color: #888;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to DayBreakPass</h1>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>Thank you for registering with us. Here are your credentials:</p>
//           <p><strong>Email Id:</strong> ${email}</p>
//           <p><strong>Password:</strong> ${password}</p>
//           <p>Please keep this information safe and do not share it with anyone.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending request received email:", error);
//   }
// };

// export const SupportMail = async (data: any) => {
//   try {
//     const { email, password } = data;
//     const mailOptions = {
//       to: email,
// cc:process.env.SMTP_USER,
//       subject: `Your DayBreakPass Account Credentials`,
//       html: `
//        <!DOCTYPE html>
//   <html>
//     <head>
//       <style>
//         .container {
//           font-family: Arial, sans-serif;
//           margin: 20px;
//           padding: 20px;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//         }
//         .header {
//           background-color: #B5813F;
//           padding: 10px;
//           text-align: center;
//           border-bottom: 1px solid #ccc;
//         }
//         .content {
//           margin-top: 20px;
//         }
//         .footer {
//           margin-top: 20px;
//           text-align: center;
//           color: #888;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to DayBreakPass</h1>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>Thank you for registering with us. Here are your credentials:</p>
//           <p><strong>Email Id:</strong> ${email}</p>
//           <p><strong>Password:</strong> ${password}</p>
//           <p>Please keep this information safe and do not share it with anyone.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending request received email:", error);
//   }
// };

// export const ReminderToUpdateInventory = async (data: any) => {
//   try {
//     const { email, password } = data;
//     const mailOptions = {
//       to: email,
// cc:process.env.SMTP_USER,
//       subject: `Your DayBreakPass Account Credentials`,
//       html: `
//        <!DOCTYPE html>
//   <html>
//     <head>
//       <style>
//         .container {
//           font-family: Arial, sans-serif;
//           margin: 20px;
//           padding: 20px;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//         }
//         .header {
//           background-color: #B5813F;
//           padding: 10px;
//           text-align: center;
//           border-bottom: 1px solid #ccc;
//         }
//         .content {
//           margin-top: 20px;
//         }
//         .footer {
//           margin-top: 20px;
//           text-align: center;
//           color: #888;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to DayBreakPass</h1>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>Thank you for registering with us. Here are your credentials:</p>
//           <p><strong>Email Id:</strong> ${email}</p>
//           <p><strong>Password:</strong> ${password}</p>
//           <p>Please keep this information safe and do not share it with anyone.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending request received email:", error);
//   }
// };

// //Hotels Mail End

// export const CaReport = async (data: any) => {
//   try {
//     const { email, password } = data;
//     const mailOptions = {
//       to: email,
// cc:process.env.SMTP_USER,
//       subject: `Your DayBreakPass Account Credentials`,
//       html: `
//        <!DOCTYPE html>
//   <html>
//     <head>
//       <style>
//         .container {
//           font-family: Arial, sans-serif;
//           margin: 20px;
//           padding: 20px;
//           border: 1px solid #ccc;
//           border-radius: 10px;
//         }
//         .header {
//           background-color: #B5813F;
//           padding: 10px;
//           text-align: center;
//           border-bottom: 1px solid #ccc;
//         }
//         .content {
//           margin-top: 20px;
//         }
//         .footer {
//           margin-top: 20px;
//           text-align: center;
//           color: #888;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to DayBreakPass</h1>
//         </div>
//         <div class="content">
//           <p>Hello,</p>
//           <p>Thank you for registering with us. Here are your credentials:</p>
//           <p><strong>Email Id:</strong> ${email}</p>
//           <p><strong>Password:</strong> ${password}</p>
//           <p>Please keep this information safe and do not share it with anyone.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending request received email:", error);
//   }
// };

export const sendContactNotification = async (data: any) => {
  try {
    const { name, email, phone, detail } = data;
    const mailOptions = {
      to: process.env.MAILTO,
      subject: `New Contact Us Submission`,
      html: `
       <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
        .header {
          background-color: #B5813F;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .content {
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DayBreakPass</h1>
        </div>
        <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Message:</strong> ${detail}</li>
      </ul>
        <div class="footer">
          <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending request received email:", error);
  }
};

export const sendInvoiceToCustomer = async (leadData: any) => {
  try {
    const { email, fullName, invoicePath } = leadData;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      cc: process.env.SMTP_USER,
      subject: `Your Invoice from DayBreakPass`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  background-color: #B5813F;
                  color: #fff;
                  padding: 10px;
              }
              .header img {
                  max-width: 100px;
                  height: auto;
              }
              .content {
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  color: #888;
                  font-size: 12px;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://yourlogo.com/logo.png" alt="DayBreakPass Logo">
                  <h1>Your Invoice from DayBreakPass</h1>
              </div>
              <div class="content">
                  <p>Hello ${fullName},</p>
                  <p>We hope you're enjoying your time with DayBreakPass! Attached, you'll find your invoice for the recent booking. Please review it at your convenience.</p>
                  <p>If you have any questions or need further assistance, feel free to contact us at <a href="tel:+918369029862">8369029862</a> or email us at <a href="mailto:team@daybreakpass.com">team@daybreakpass.com</a>.</p>
                  <p>Thank you for choosing DayBreakPass, and we look forward to serving you again!</p>
                  <p>Best regards,<br>The DayBreakPass Team</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 DayBreakPass. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
      attachments: [
        {
          filename: `${fullName}_Invoice.pdf`,
          path: invoicePath, // Attach the invoice PDF
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} with invoice attachment`);
  } catch (error) {
    console.error(`Error sending invoice email to ${leadData.email}:`, error);
  }
};
