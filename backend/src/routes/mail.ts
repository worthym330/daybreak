import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS,
  },
});

export const sendLeadNotification = async (leadData:any) => {
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
      <li>Designation: ${leadData.designation || 'Not provided'}</li>
      <li>Contact number: ${leadData.contactNo}</li>
      <li>Status: ${leadData.status}</li>
    </ul>
    <p>Thank you.</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Lead notification email sent');
  } catch (error) {
    console.error('Error sending lead notification email:', error);
  }
};
