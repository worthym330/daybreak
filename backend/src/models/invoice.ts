import mongoose from "mongoose";

const ServiceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    bookingId: { type: String },
    paymentId: { type: String, required: true },
    invoiceId: { type: String },
    servicesUsed: [{ type: String }],
    orderId: { type: String },
    paymentStatus: { type: String },
    createdAt: { type: Date, default: Date.now },
    amount: { type: Number },
    // bank_transaction_id:{type:String},
    updatedAt: { type: Date },
    invoiceUrl: { type: String },
    slot: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

ServiceRecordSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const ServiceRecord = mongoose.model("ServiceRecord", ServiceRecordSchema);

export default ServiceRecord;
