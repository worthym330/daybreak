const mongoose = require("mongoose");

// Define the Discount schema
const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0, // Minimum discount percentage
      max: 100, // Maximum discount percentage
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    amount: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
