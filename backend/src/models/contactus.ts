import mongoose, { Document, Schema } from "mongoose";

export interface ContactInter extends Document {
  name: string;
  email: string;
  phone?: string;
  details: string;
}

const ContactSchema = new Schema<ContactInter>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: String},
    details: { type: String },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model<ContactInter>("ContactUs", ContactSchema);

export default ContactUs;
