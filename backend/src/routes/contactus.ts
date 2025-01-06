import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import ContactUs from "../models/contactus";
import { HotelBooking, sendContactNotification } from "./mail";

const router = express.Router();

// /api/my-bookings
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, details,hotelName, bookingDate } = req.body;
    const contact = new ContactUs({
      name,
      email,
      phone,
      details,
      hotelName,
      bookingDate
    });

    const data = await contact.save();
    // if(email){
    //   sendContactNotification(contact)
    // }else{
    //   HotelBooking(contact)
    // }
    sendContactNotification(contact)
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to save contact details" });
  }
});

export default router;
