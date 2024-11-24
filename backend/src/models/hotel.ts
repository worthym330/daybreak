import mongoose from "mongoose";
import {
  BookingType,
  HotelType,
  FavouriteList,
  ProductType,
} from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>(
  {
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
  },
  { _id: true }
);

const favouriteListSchema = new mongoose.Schema<FavouriteList>(
  {
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema<ProductType>(
  {
    title: { type: String },
    description: [{ type: String }],
    adultPrice: { type: Number },
    childPrice: { type: Number },
    otherpoints: { type: String },
    notes: { type: String },
    maxPeople: { type: String },
    selectedDates: [{ type: Date }],
    slotTime: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    isChildPrice: { type: Boolean },
    maxGuestsperDay: { type: Number },
    breakTime: { type: String },
    addOns: [{ type: mongoose.Schema.Types.ObjectId, ref: "AddOn" }],
    remainingGuests: { type: Number },
  },
  { _id: true }
);

const hotelSchema = new mongoose.Schema<HotelType>(
  {
    userId: { type: String },
    name: { type: String },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    description: { type: String },
    cancellationPolicy: { type: String },
    facilities: [{ type: String }],
    hotelType: [{ type: String }],
    imageUrls: [{ type: String }],
    productTitle: [productSchema],
    star: { type: Number, min: 1, max: 5 },
    lastUpdated: { type: Date },
    mapurl: { type: String },
    pincode: { type: String },
    bookings: [bookingSchema],
    favourites: [favouriteListSchema],
    titlesId: [{ type: String, ref: "HotelDetails" }],
    addOns: [{ type: String, ref: "AddOn" }],
    status: { type: Boolean },
  },
  { timestamps: true }
);

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
