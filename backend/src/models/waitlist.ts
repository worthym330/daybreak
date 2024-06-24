import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlist extends Document {
  name: string;
  email: string;
  referralCode?: string;
  referredNumber: number;
  ip: string;
  city: string;
  referredBy?: mongoose.Types.ObjectId;
  referredUsers: mongoose.Types.ObjectId[];
}

const waitlistSchema = new Schema<IWaitlist>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  referralCode: { type: String, unique: true },
  referredNumber: { type: Number, default: 0 },
  ip: { type: String, required: true },
  city: { type: String, required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'Waitlist' },
  referredUsers: [{ type: Schema.Types.ObjectId, ref: 'Waitlist' }],
});

waitlistSchema.pre<IWaitlist>('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

function generateReferralCode() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

const Waitlist = mongoose.model<IWaitlist>('Waitlist', waitlistSchema);

export default Waitlist;
