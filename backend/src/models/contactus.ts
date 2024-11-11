import mongoose, { Document, Schema } from "mongoose";

export interface ContactInter extends Document {
  name: string;
  email?: string;
  phone?: string;
  details?: string;
  hotelName?: string;
  bookingDate?: string;
}

const ContactSchema = new Schema<ContactInter>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    details: { type: String },
    hotelName: { type: String },
    bookingDate: { type: Date },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model<ContactInter>("ContactUs", ContactSchema);

export default ContactUs;
