import { Schema, model, Document } from "mongoose";

// Define an interface representing a document in MongoDB.
interface ILead extends Document {
  email: string;
  fullName: string;
  hotelName: string;
  designation?: string;
  contactNo: string;
  status: "new" | "in contact" | "partner";
}

// Define the schema for the Lead model.
const leadSchema = new Schema<ILead>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    hotelName: { type: String, required: true },
    designation: { type: String },
    contactNo: { type: String },
    status: {
      type: String,
      enum: ["new", "in contact", "partner"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Create the model from the schema and export it.
const Lead = model<ILead>("Lead", leadSchema);

export default Lead;
