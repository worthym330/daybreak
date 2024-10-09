import mongoose from "mongoose";

const addOnSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AddOn = mongoose.model("AddOn", addOnSchema);
export default AddOn;
