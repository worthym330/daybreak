import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingUser",
      required: true,
    },
    items: [
      {
        // productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        hotelName: { type: String },
        hotelId: { type: String },
        date: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const LandingCart = mongoose.model("LandingCart", CartSchema);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingUser",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingCart",
      required: true,
      unique: true,
    },
    razorpayOrderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid"], default: "created" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LandingOrder = mongoose.model("LandingOrder", OrderSchema);

const InvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingUser",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingOrder",
      required: true,
      unique: true,
    },
    invoiceNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    zohoInvoiceId: { type: String },
    zohoInvoiceLink: { type: String },
  },
  { timestamps: true }
);

export const LandingInvoice = mongoose.model("LandingInvoice", InvoiceSchema);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    zohoCustomerId: { type: String },
  },
  { timestamps: true }
);

export const LandingUser = mongoose.model("LandingUser", UserSchema);

const LandingBookingNonPartnerSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    name: { type: String },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        hotelName: { type: String },
        hotelId: { type: String },
        date: { type: String },
        hotelAddress: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const LandingBookingNonPartner = mongoose.model(
  "LandingNonPartner",
  LandingBookingNonPartnerSchema
);
