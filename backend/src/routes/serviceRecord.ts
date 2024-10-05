import express, { Request, Response } from "express";
import ServiceRecord from "../models/invoice";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import Razorpay from "razorpay";
import { BookingCancellation } from "./mail";
import User from "../models/user";
import { createInvoice } from "./hotels";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const router = express.Router();

router.get("", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    // Fetch the service records by userId and populate user and hotel info
    const serviceRecords = await ServiceRecord.find({
      userId: userId,
    }).populate({
      path: "hotelId", // Populate hotel info
      populate: {
        path: "bookings", // Populate all related bookings for the hotel
      },
    });

    if (!serviceRecords || serviceRecords.length === 0) {
      return res.status(404).json({ message: "Service records not found" });
    }

    // Convert to JSON string and parse back to an object
    const data = JSON.stringify(serviceRecords);
    const parsedData = JSON.parse(data);

    // Filter the bookings for the user and include relevant service record data
    const filteredServiceRecords = parsedData
      .map((record: any) => {
        const userBookings = record.hotelId.bookings.filter(
          (booking: any) => booking.userId.toString() === userId.toString()
        );

        // If there are bookings for this user, return the service record with the filtered bookings
        if (userBookings.length > 0) {
          return {
            ...record,
            hotelId: {
              ...record.hotelId,
              bookings: userBookings, // Only include bookings for the user
            },
          };
        }

        return null; // Exclude records without relevant bookings
      })
      .filter((record: any) => record !== null);
    res.status(200).json(filteredServiceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const serviceRecordId = req.params.id;
    const userId = req.userId;

    // Fetch the service record by _id and userId
    const serviceRecord = await ServiceRecord.findOne({
      _id: serviceRecordId,
      userId: userId,
    })
      .populate({
        path: "userId",
        select: "-password -otherSensitiveField",
      })
      .populate({
        path: "hotelId",
        select: "-favourites",
      });
    const data = JSON.stringify(serviceRecord);

    const bookingExists = JSON.parse(data).hotelId?.bookings.find(
      (booking: any) => booking.userId === userId
    );

    if (!serviceRecord) {
      return res.status(404).json({
        message: "Booking not found or service record does not exist",
      });
    }

    res.status(200).json(bookingExists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.put(
  "/:id/cancellation",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await ServiceRecord.findOne({
        _id: id,
        paymentStatus: { $ne: "refunded" },
      }).populate({
        path: "hotelId",
        select: "bookings",
      });

      if (!data) {
        return res.status(404).json({ message: "Service record not found" });
      }

      const payment = await razorpayInstance.payments.fetch(data.paymentId);

      if (!payment) {
        return res.status(400).json({ message: "Payment not found" });
      }

      // Ensure that data.amount is not null or undefined
      if (data.amount == null) {
        return res.status(400).json({ message: "Amount is not defined" });
      }

      // Calculate the refund amount (10% deduction)
      const refundAmount = data.amount * 0.9; // Amount should be in paise

      // Initiate the refund process using Razorpay API
      const refund = await razorpayInstance.payments.refund(data.paymentId, {
        amount: Math.round(refundAmount), // Convert refund amount to nearest integer (paise)
      });

      if (!refund || refund.status !== "processed") {
        return res.status(400).json({ message: "Refund failed" });
      }

      // Remove the booking from the hotel's bookings array
      const hotel = await Hotel.findOneAndUpdate(
        { _id: data.hotelId, "bookings._id": data.bookingId },
        {
          $set: { "bookings.$.status": "Cancelled" },
        },
        { new: true }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();
      const user = await User.findById(data.userId);
      const hotelInfo = await Hotel.findOne({
        _id: data.hotelId,
        "bookings._id": data.bookingId,
      });
      const booking = hotel
        ? hotel.bookings.find((b) => b._id.toString() === data.bookingId)
        : null;
      const mailPayload = {
        email: user?.email,
        name: `${user?.firstName}`, // Fixed potential typo (firstName used twice)
        hotelName: hotelInfo?.name,
        date: booking?.cart?.[0]?.date, // Use optional chaining here
        amount: payment.amount,
      };
      // Update the service record with cancellation info
      const serviceRecord = await ServiceRecord.findOneAndUpdate(
        {
          _id: id,
        },
        {
          paymentStatus: "refunded",
        },
        { new: true }
      );

      if (!serviceRecord) {
        return res.status(400).json({ message: "Service record not found" });
      }

      await serviceRecord.save();
      BookingCancellation(mailPayload);

      res.status(200).json({
        message: "Booking cancelled and refunded successfully",
        serviceRecord,
      });
    } catch (error) {
      console.error("Refund error:", error);
      return res
        .status(500)
        .json({ message: "Refund failed due to server error" });
    }
  }
);

router.post(
  "/:id/invoice",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    // const userId = req.userId;
    try {
      // Fetch the service record and populate bookings
      const serviceRecord = await ServiceRecord.findById(id)
        .populate({
          path: "userId",
          select: "-password -otherSensitiveField",
        })
        .populate({
          path: "hotelId",
          select: "name city bookings",
        });

      // console.log(serviceRecord);
      if (!serviceRecord) {
        return res.status(404).json({ message: "Service record not found" });
      }

      const populatedUser = serviceRecord.userId as any; // Explicitly assert that userId is a populated User
      const populatedHotel = serviceRecord.hotelId as any; // Explicitly assert that hotelId is a populated Hotel

      // Prepare the payload
      const payload = {
        bookingId: serviceRecord.bookingId,
        invoiceNo: serviceRecord.invoiceId,
        date: serviceRecord.date,
        hotelName: populatedHotel.name, // Now TypeScript knows it's a Hotel document
        hotelCity: populatedHotel.city,
        passDate: serviceRecord.date,
        slotTime: serviceRecord.slot,
        customerName: `${populatedUser.firstName} ${populatedUser.lastName}`, // Now TypeScript knows it's a User document
        lineItems: serviceRecord.lineItems,
        grandTotal: serviceRecord.lineItems
          .reduce(
            (total: number, item: any) => total + parseFloat(item.amount),
            0
          )
          .toFixed(2),
      };

      const invoice = await createInvoice(payload);
      const path = `${
        process.env.BACKEND_URL
      }/uploads/invoices/${invoice.filename.split("/").pop()}`;
      res
        .status(200)
        .json({ message: "Found Data", path, payload, serviceRecord });
    } catch (error) {
      console.error("Invoice creation or sending error:", error);
      res.status(500).json({ message: "Failed to create or send invoice" });
    }
  }
);

// async function transferAmount(paymentId: any, recipientId: string, amount: number) {
//   try {
//     const transferPayload: any = {
//       transfer: [
//         {
//           account: recipientId,
//           amount: amount * 100, // Convert to paise if the amount is in INR
//           currency: "INR",
//           notes: {
//             reason: "Payment for services rendered",
//           },
//         },
//       ],
//     };

//     const transfer = await razorpayInstance.transfers.create(paymentId, transferPayload);

//     if (!transfer) {
//       throw new Error("Failed to create transfer");
//     }

//     return transfer;
//   } catch (error) {
//     console.error("Transfer error:", error);
//     throw error;
//   }
// }

// async function createRefundNote(paymentId: string, amount: number) {
//   try {
//     const refundPayload: any = {
//       payment_id: paymentId,
//       amount: amount * 100, // Convert to paise if the amount is in INR
//       notes: {
//         reason: "User requested refund",
//       },
//     };

//     const refund = await razorpayInstance.refunds.create(refundPayload);

//     if (!refund) {
//       throw new Error("Failed to create refund");
//     }

//     return refund;
//   } catch (error) {
//     console.error("Refund creation error:", error);
//     throw error;
//   }
// }

export default router;
