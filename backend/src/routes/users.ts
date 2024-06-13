import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import Lead from "../models/leads";
import { sendLeadNotification } from "./mail";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// /api/users/register

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { email, googleToken, firstName, lastName, password, role, loginThrough } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      if (loginThrough === 'google') {
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload?.email !== email) {
          return res.status(400).json({ message: "Invalid Google token" });
        }
        const googleUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
          password:`${firstName}${lastName}`
        };
        user = new User(googleUser);
      } else {
        const body = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
          password:password
        };
        user = new User(body);
      }
      await user.save();
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).send({
        message: "User registered",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: token
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.post(
  '/partner/register',
  [
    check('fullName', 'Full Name is required').isString(),
    check('hotelName', 'Hotel Name is required').isString(),
    check('email', 'Email is required').isEmail(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(416).json({ message: errors.array() });
    }

    const { email, fullName, hotelName, designation, role,contactNo } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const leadData = {
        email,
        fullName,
        hotelName,
        designation,
        status: 'new',
        contactNo
      };

      const lead = new Lead(leadData);
      await lead.save();
      await sendLeadNotification(leadData)
      const body = {
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ')[fullName.split(' ').length - 1],
        email: email,
        role: role,
        password: hotelName,
        status: false,
      };

      user = new User(body);
      await user.save();

      return res.status(200).send({
        message: 'User registered',
        leadId: lead._id,
        userId: user._id, 
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Something went wrong' });
    }
  }
);

export default router;
