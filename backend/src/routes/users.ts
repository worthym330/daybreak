import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken, { verifyAdminToken } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import Lead from "../models/leads";
import { sendCredentials, sendLeadNotification, sendToCustomer } from "./mail";
import bcrypt from "bcryptjs";
import { sendWelcomeSms } from "./twillio";

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
    const {
      email,
      googleToken,
      firstName,
      lastName,
      password,
      role,
      loginThrough,
    } = req.body;

    try {
      let user;

      if (loginThrough === "google") {
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload?.email !== email) {
          return res.status(400).json({ message: "Invalid Google token" });
        }
        user = await User.findOne({ email: payload?.email });
        if (user) {
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
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              token: token,
              role: user.role,
            },
          });
        } else {
          const googleUser = {
            firstName,
            lastName,
            email,
            role,
            password: null,
          };
          user = new User(googleUser);
        }
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = {
          firstName,
          lastName,
          email,
          role,
          password: hash,
        };
        user = new User(newUser);
      }

      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      const emailData = {
        email,
        fullName: `${firstName} ${lastName}`,
      };

      await sendToCustomer(emailData);
      // sendWelcomeSms(contactNo,fullName)

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).send({
        message: "User registered",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: token,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/partner/register",
  [
    check("fullName", "Full Name is required").isString(),
    check("hotelName", "Hotel Name is required").isString(),
    check("email", "Email is required").isEmail(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(416).json({ message: errors.array() });
    }

    const { email, fullName, hotelName, designation, role, contactNo } =
      req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const leadData = {
        email,
        fullName,
        hotelName,
        designation,
        status: "new",
        contactNo,
      };

      const lead = new Lead(leadData);
      await lead.save();
      await sendLeadNotification(leadData);
      await sendToCustomer(leadData);
      // sendWelcomeSms(contactNo,fullName)
      const body = {
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ")[fullName.split(" ").length - 1],
        email: email,
        role: role,
        password: hotelName,
        status: false,
        phone: contactNo,
      };

      user = new User(body);
      await user.save();

      return res.status(200).send({
        message: "User registered",
        leadId: lead._id,
        userId: user._id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const data = await User.find();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.delete("/:id", verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);
    if (userData) {
      await User.deleteOne({ _id: id });
      return res.status(200).send({ message: "Successfully deleted" });
    } else {
      return res.status(404).send({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post(
  "/create-account",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, role, status } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        let user, password;
        password = generateRandomPassword(10);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const body = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
          password: hash,
          status: status,
        };
        user = new User(body);
        await user.save();
        const data = {
          name: `${firstName} ${lastName}`,
          email,
          password,
        };
        await sendCredentials(data);
        return res.status(200).send(user);
      } else {
        return res.status(424).send("Duplicate Entry");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export function generateRandomPassword(length: number = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";

  password +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  password +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  for (let i = 4; i < length; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

router.put(
  "/update/user/:id",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await User.findById(id);
      if (user) {
        user.status = status;
      }
      await user?.save();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.put(
  "/create-account/:id",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, role, status } = req.body;

      const existingUser = await User.findById(id);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const emailInUse = await User.findOne({ email, _id: { $ne: id } });
      if (emailInUse) {
        return res.status(409).json({ message: "Email is already in use" });
      }

      // Update the user information
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.email = email;
      existingUser.role = role;
      existingUser.status = status;

      await existingUser.save();

      return res.status(200).send(existingUser);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
export default router;
