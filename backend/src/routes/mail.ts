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


export const sendCredentials = async (data:any) => {
  try {
    const { email, password } = data;
    const mailOptions = {
      to: email,
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
          background-color: #f7f7f7;
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
          <p>Hello,</p>
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
}
