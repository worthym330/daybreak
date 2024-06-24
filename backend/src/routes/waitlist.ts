import express, { Request, Response } from "express";
import Waitlist, { IWaitlist } from "../models/waitlist";
import mongoose from 'mongoose';

const router = express.Router();

// /api/waitlist
router.post('/', async (req: Request, res: Response) => {
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
            referredNumber:allData.length,
            referralCode:savedEntry.referralCode
        }

        res.status(201).json(returnData);
    } catch (error) {
        console.error('Error details:', error);
        if ((error as any).code === 11000) {
            // Check which field caused the unique constraint violation
            if ((error as any).keyPattern?.email) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(400).json({ error: 'Email or referral code already exists' });
        }
        res.status(500).json({ error: 'Could not save entry' });
    }
});

export default router;
