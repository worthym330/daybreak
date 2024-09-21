const mongoose = require("mongoose");

const hotelDetailsSchema = new mongoose.Schema(
  {
    title: String,
    date: Date,
    slotTime: String,
    startTime: String,
    endTime: String,
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    // New fields for pricing
    adultWeekdayPrice: {
      type: Number,
      required: true,
    },
    adultWeekendPrice: Number,
    childWeekdayPrice: Number,
    childWeekendPrice: Number,
    slots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" }],
  },
  { timestamps: true }
);

const HotelDetails = mongoose.model("HotelDetails", hotelDetailsSchema);

const slotSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    hotelProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelDetails",
      required: true,
    },
    slotTime: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    peoplePerSlot: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", slotSchema);

export { HotelDetails, Slot };
