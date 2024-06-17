import mongoose from "mongoose";
import { BookingType, HotelType, FavouriteList } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number },
  childCount: { type: Number },
  checkIn: { type: Date },
  checkOut: { type: Date },
  userId: { type: String, required: true },
  totalCost: { type: Number, required: true },
  cart: { type: Array },
});

const favouriteListSchema = new mongoose.Schema<FavouriteList>({
  userId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
});

const hotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  bookings: [bookingSchema],
  favourites: [favouriteListSchema],
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
