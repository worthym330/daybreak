import mongoose, { Document, Schema } from "mongoose";

export interface ContactInter extends Document {
  name: string;
  email: string;
  phone?: string;
  detail: string;
}

const ContactSchema = new Schema<ContactInter>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: String},
    detail: { type: String },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model<ContactInter>("ContactUs", ContactSchema);

export default ContactUs;
