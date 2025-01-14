import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import axios from "axios";
const passport = require("passport");
import { OAuth2Client } from "google-auth-library";
import { resetPass } from "./mail";
import Hotel from "../models/hotel";
const crypto = require("crypto");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post(
  "/login",
  [check("email", "Email is required").isEmail().optional({ nullable: true })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password, loginThrough, googleToken, userType } = req.body;

    try {
      let user;

      // If login through Google
      if (googleToken) {
        // Verify Google token
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const googleEmail = payload?.email;
        const firstName = payload?.given_name;
        const lastName = payload?.family_name;

        if (!googleEmail) {
          return res.status(400).json({ message: "Invalid Google token" });
        }

        // Find user by email and role
        user = await User.findOne({ email: googleEmail, role: userType });

        // If user does not exist, create a new user
        if (!user) {
          user = new User({
            email: googleEmail,
            firstName: firstName || "GoogleUser",
            lastName: lastName || "",
            role: userType,
            status: true, // Assuming new users are active by default
            password: null, // No password since it's a Google login
          });

          await user.save();
        }
      } else if (email && password) {
        // Email/password based login
        user = await User.findOne({ email, role: userType });

        if (!user) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }
      } else {
        return res.status(400).json({ message: "Invalid login request" });
      }

      // Check if the user's status is active
      if (!user.status) {
        return res.status(403).json({
          message: "Please contact the admin to activate your account",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      const userPayload = {
        token: token,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user.id,
        role: user.role,
      };

      // Set cookie with the token
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 1 day
      });

      res.status(200).json({ user: userPayload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/auth/google", async (req: any, res: any) => {
  const { token } = req.body;

  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const user = response.data;
    console.log("User info:", user);
    res.status(200).json({ message: "Authentication successful", user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .send({ error: "No user found for this email address." });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString("hex");

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    existingUser.save();
    console.log(existingUser)
    const mailData = {
      email:existingUser.email,
      name:`${existingUser.firstName}`,
      token:resetToken
    }
    await resetPass(mailData)

    res.status(200).json({
      success: true,
      message: "Please check your email for the link to reset your password.",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post("/reset/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!resetUser) {
      return res.status(400).json({
        error:
          "Your token has expired. Please attempt to reset your password again.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    resetUser.password = hash;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save();

    // await mailgun.sendEmail(resetUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post("/reset", verifyToken, async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).send("Unauthenticated");
    }

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Please enter your correct old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;
    existingUser.save();

    // await mailgun.sendEmail(existingUser.email, 'reset-confirmation');

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post(
  "/admin/login",
  [check("email", "Email is required").isEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user;
      user = await User.findOne({ email , role: { $ne: 'customer' } });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Check if the user's status is true
      if (!user.status) {
        return res
          .status(403)
          .json({
            message: "Please contact the admin to activate your account",
          });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      const hotel = await Hotel.findOne({userId:user._id})

      const userPayload = {
        token: token,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user._id,
        role: user.role,
        hotelId:user.role !== "admin" ? hotel?._id : null
      };

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ user: userPayload });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
