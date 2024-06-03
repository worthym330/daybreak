import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { env } from "process";
import axios from "axios";
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // Save or process the user profile information
      return done(null, profile);
    }
  )
);

router.post(
  "/login",
  [check("email", "Email is required").isEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password, loginThrough, googleToken } = req.body;

    try {
      let user;

      if (loginThrough === "google" && googleToken) {
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const googleEmail = payload?.email;

        if (!googleEmail) {
          return res.status(400).json({ message: "Invalid Google token" });
        }

        user = await User.findOne({ email: googleEmail });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
      } else if (email && password) {
        user = await User.findOne({ email });
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

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      const payload = {
        token: token,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user.id,
        role: user.role,
      };

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ user: payload });
    } catch (error) {
      console.log(error);
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
export default router;
