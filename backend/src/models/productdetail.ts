const mongoose = require("mongoose");
const hotelDetailsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
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
  },
  { timestamps: true }
);

const HotelDetails = mongoose.model("HotelDetails", hotelDetailsSchema);

export default HotelDetails
