import mongoose from 'mongoose';

const ServiceRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  paymentId: { type: String, required: true },
  invoiceId: { type: String },
  servicesUsed: [{ type: String }],
  paymentStatus: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt:{type:Date}
}, { timestamps: true });

ServiceRecordSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const ServiceRecord = mongoose.model('ServiceRecord', ServiceRecordSchema);

export default ServiceRecord;
