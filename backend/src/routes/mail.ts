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
            <p>Congratulations! Your sign-up with DayBreakPass is complete, and we're excited to begin your onboarding
                process.
            </p>
            <p>Welcome aboard! We're delighted to have you join us. Expect a call soon from one of our representatives.
            </p>
            <p>For any questions or assistance, please feel free to reach out to us at <a href="tel:+918369029862" >8369029862</a> or email us at
               <a href="mailto:team@daybreakpass.com"> team@daybreakpass.com</a>.
            </p>
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
    console.error("Error sending lead notification email:", error);
  }
};

export const sendCredential = async (body: any) => {
  try {
    const { email, firstName, password } = body;
    const mailOptions = {
      to: email,
      subject: `Welcome to the DayBreakPass, get your credentials`,
      html: ` 
     <h1>Welcome to DayBreakPass, ${firstName}!</h1>
        <p>We are excited to have you on board. Here are your account details:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please change your password after logging in for the first time for security purposes.</p>
        <p>Best regards,</p>
        <p>DayBreakPass</p>
`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending lead notification email:", error);
  }
};

// export const sendReferral = async(body:any) =>{
//   try {
//     const { email, name, referralCode, waitlistNumber } = body;
//     const mailOptions = {
//       to: email,
//       subject: `Welcome to DayBreakPass!`,
//       html: ` 
//     <h3>Hi ${name},</h3>
//     <p>Thank you for joining our waitlist. We are excited to have you on board!.</p>
//     <p>Your referral code is: <strong>${referralCode}</strong></p>
//     <p>Your waiting list number is: <strong>${waitlistNumber}</strong></p>
//     <p>Share this code with your friends and help them join our service too. 
//     <a href="${process.env.FRONTEND_URL}/waitlist?uid=${referralCode}">${process.env.FRONTEND_URL}/waitlist?uid=${referralCode}</a></p>
//     <p>Best regards,<br>DayBreakPass</p>
// `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending lead notification email:", error);
//   }
// }
