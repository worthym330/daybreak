import express, { Request, Response } from "express";
import Waitlist, { IWaitlist } from "../models/waitlist";
import mongoose from "mongoose";
import User from "../models/user";
import { sendCredential, sendReferral } from "./mail";

const router = express.Router();

const generatePassword = (firstName: string, lastName: string) => {
  const specialChars = "!@#$%^&*()";
  const digits = "0123456789";
  const part1 = firstName.slice(0, 3);
  const part2 = lastName.slice(-3);
  const randomSpecialChars =
    specialChars[Math.floor(Math.random() * specialChars.length)] +
    specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomDigits =
    digits[Math.floor(Math.random() * digits.length)] +
    digits[Math.floor(Math.random() * digits.length)];
  const password = `${part1}${randomSpecialChars}${part2}${randomDigits}`;
  return password;
};

// /api/waitlist
router.post("/", async (req: Request, res: Response) => {
  const { name, email, referralCode, city } = req.body as {
    name: string;
    email: string;
    referralCode?: string;
    ip: string;
    city: string;
  };
  const ip = req.ip;

  if (!name || !email || !city) {
        return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    let referredByUser: IWaitlist | null = null;

    if (referralCode) {
            referredByUser = await Waitlist.findOne({ referralCode: referralCode.toUpperCase() });
      if (!referredByUser) {
                return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    const newEntry = new Waitlist({
      name,
      email,
      ip,
      city,
      referredBy: referredByUser ? referredByUser._id : null,
    });

    const savedEntry = await newEntry.save();

    if (referredByUser) {
            referredByUser.referredUsers.push(savedEntry._id as mongoose.Types.ObjectId);
      referredByUser.referredNumber += 1;
      await referredByUser.save();
    }
    const allData = await Waitlist.find({});

    let returnData = {
      referredNumber: allData.length,
      referralCode: savedEntry.referralCode,
    };

    let body ={
      name: name,
      email,
      referralCode:savedEntry.referralCode,
      waitlistNumber: 1038 + allData.length
    }
    await sendReferral(body)
    res.status(201).json(returnData);
  } catch (error) {
    console.error("Error details:", error);
    if ((error as any).code === 11000) {
      // Check which field caused the unique constraint violation
      if ((error as any).keyPattern?.email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res
        .status(400)
        .json({ error: "Email or referral code already exists" });
    }
    res.status(500).json({ error: "Could not save entry" });
  }
});

router.get("/create-user", async (req: Request, res: Response) => {
  try {
    const allData = await Waitlist.find({});
    const allUserData = await User.find({});
    const existingEmails = new Set(allUserData.map((user) => user.email));

    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];
      const { name, email } = data;
      const role = "customer";
      const firstName = name.split(" ")[0];
      const lastName = name.split(" ")[name.split(" ").length - 1];
      const password = generatePassword(firstName, lastName);

      if (existingEmails.has(email)) {
        console.log(`Email ${email} already exists. Skipping...`);
        continue;
      } else {
        const body = {
          firstName,
          lastName,
          email,
          role,
          password,
        };

        const user = new User(body);
        await user.save();
        existingEmails.add(email);
        await sendCredential(body);
      }
    }

    res.status(201).send("Users created successfully");
  } catch (error) {
    res.status(500).send("An error occurred while creating users");
  }
});

export default router;
