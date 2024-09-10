const twilio = require("twilio");

// Twilio credentials
const accountSid = process.env.TWILLIO_ID;
const authToken = process.env.TWILLIO_TOKEN;
const client = new twilio(accountSid, authToken);

export async function sendWelcomeSms(number: string, name: string) {
  try {
    const message = `
    Hello ${name},
    
    Congratulations! Your sign-up with Daybreakpass is complete, and we're excited to begin your onboarding process.
    
    Welcome aboard! We're delighted to have you join us. Expect a call soon from one of our representatives.
    
    For any questions or assistance, please feel free to reach out to us at 8369029862 or email us at team@daybreakpass.com.
    
    Best regards,
    The Daybreakpass Team
    `;
    await client.messages.create({
      body: message,
      from: process.env.TWILLIO_NUMBER,
      to: number,
    });
  } catch (error) {
    console.error(error);
  }
}

export const sendInvoiceSms = async (
  customerNumber: string,
  partnerNumber: string,
  invoiceLink: string
) => {
  const invoiceMessage = `Your invoice is ready. You can view and download it here: ${invoiceLink}.
  
  Best regards,
  The Daybreakpass Team`;

  try {
    // Send SMS to the customer
    await client.messages.create({
      body: invoiceMessage,
      from: process.env.TWILLIO_NUMBER,
      to: customerNumber,
    });
    console.log(`Invoice SMS sent to customer: ${customerNumber}`);

    // Send SMS to the hotel partner
    await client.messages.create({
      body: invoiceMessage,
      from: process.env.TWILLIO_NUMBER,
      to: partnerNumber,
    });
    console.log(`Invoice SMS sent to hotel partner: ${partnerNumber}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending invoice SMS:", error.message);
    } else {
      console.error("An unknown error occurred while sending invoice SMS.");
    }
  }
};

export const sendPaymentConfirmationSms = async (
  customerNumber: string,
  hotelName: string,
  passes: string[],
  bookingDate: string,
  bookingTime: string
) => {
  const message = `Your payment is confirmed for ${passes} passes at ${hotelName}. 
  The booking is for ${bookingDate} at ${bookingTime}. 
  Thank you for choosing us!
  
  Best regards,
  The Daybreakpass Team`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILLIO_NUMBER,
      to: customerNumber,
    });
    console.log(`Payment confirmation SMS sent to customer: ${customerNumber}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending payment confirmation SMS:", error.message);
    } else {
      console.error(
        "An unknown error occurred while sending the payment confirmation SMS."
      );
    }
  }
};

// Example usage
// const customerNumber = "+1234567890"; // Customer's phone number
// const hotelName = "Grand Hotel"; // Hotel name
// const passes = 3; // Number of passes
// const bookingDate = "2024-09-10"; // Booking date
// const bookingTime = "2:00 PM"; // Booking time

// sendPaymentConfirmationSms(customerNumber, hotelName, passes, bookingDate, bookingTime);
