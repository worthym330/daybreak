import mongoose from 'mongoose';

const ServiceRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  paymentId: { type: String, required: true },
  invoiceId: { type: String },
  servicesUsed: [{ type: String, required: true }],
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ServiceRecord = mongoose.model('ServiceRecord', ServiceRecordSchema);

export default ServiceRecord;
