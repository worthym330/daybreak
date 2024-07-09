import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import ContactUs from "../models/contactus";

const router = express.Router();

// /api/my-bookings
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, details } = req.body;
    
    const contact = new ContactUs({
      name,
      email,
      phone,
      details
    });

    const data = await contact.save();

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to save contact details" });
  }
});

export default router;
