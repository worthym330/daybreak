const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
