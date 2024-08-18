import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import Razorpay from "razorpay";
import ServiceRecord from "../models/invoice";
import axios from "axios";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { "productTitle.adultPrice": 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { "productTitle.adultPrice": -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.get(
  "/name/:name",
  [param("name").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const name = req.params.name.toString();

    try {
      const hotel = await Hotel.findOne({ name: name });
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { cartItems, discount, gst } = req.body;
    console.log(cartItems, discount, gst);
    const hotelId = req.params.hotelId;

    try {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      // Calculate the total amount from cartItems
      const totalAmount = cartItems.reduce((sum: number, item: any) => {
        const itemTotal = item.total * 100;
        return sum + itemTotal;
      }, 0);

      const gstAmount = totalAmount * (1 + gst);
      // Convert to the smallest currency unit (paise)
      const amountPayable = gstAmount - discount * 100;
      const receipt = `rcpt_${hotelId}_${req.userId}`.slice(0, 40);
      const options = {
        amount: Math.round(amountPayable), // amount in the smallest currency unit
        currency: "INR",
        receipt: receipt,
        payment_capture: 1, // 1 for automatic capture, 0 for manual
        notes: {
          hotelId,
          userId: req.userId,
        },
      };

      const order = await razorpayInstance.orders.create(options);

      if (!order) {
        return res.status(500).json({ message: "Error creating order" });
      }

      const response = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
      console.log("response value", response);

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { paymentIntentId, orderId, cart } = req.body;

      // Verify the payment signature
      const payment = await razorpayInstance.payments.fetch(paymentIntentId);

      if (!payment) {
        return res.status(400).json({ message: "Payment not found" });
      }

      if (
        payment.order_id !== orderId ||
        payment.notes.hotelId !== req.params.hotelId ||
        payment.notes.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment details mismatch" });
      }

      if (payment.status !== "captured") {
        return res.status(400).json({
          message: `Payment not captured. Status: ${payment.status}`,
        });
      }
      let totalCost: number = (payment.amount as number) / 100;

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
        totalCost: totalCost,
        cart: cart,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        },
        { new: true }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();

      const serviceRecord = new ServiceRecord({
        userId: req.userId,
        hotelId: req.params.hotelId,
        bookingId: hotel.bookings[hotel.bookings.length - 1]._id, // Ensure newBooking._id is properly set
        paymentId: paymentIntentId,
        orderId: orderId,
        invoiceId: payment.invoice_id || "",
        amount: totalCost,
        servicesUsed:
          cart.map((l: { product: { title: any } }) => l.product.title) || [],
        paymentStatus: payment.status,
      });

      await serviceRecord.save();

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { state: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.hotelType = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    let starRatings: number[] = [];

    if (Array.isArray(queryParams.stars)) {
      starRatings = queryParams.stars.map((star: string) => parseInt(star));
    } else if (queryParams.stars === "Any") {
      starRatings = [1, 2, 3, 4, 5];
    } else {
      const star = parseInt(queryParams.stars);
      starRatings = Array.from({ length: 5 - star + 1 }, (_, i) => star + i);
    }
    constructedQuery.star = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

router.post("/:hotelId/favourite", async (req, res) => {
  const { hotelId } = req.params;
  const { userId, firstName, lastName, email } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const favouriteIndex = hotel.favourites.findIndex(
      (fav) => fav.userId === userId
    );

    if (favouriteIndex === -1) {
      // Add to favorites
      hotel.favourites.push({ userId, firstName, lastName, email });
    } else {
      // Remove from favorites
      hotel.favourites.splice(favouriteIndex, 1);
    }

    await hotel.save();
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/get/favourites/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const favouriteHotels = await Hotel.find({
      favourites: { $elemMatch: { userId: userId } },
    });
    res.status(200).json(favouriteHotels);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.post(
  "/:hotelId/bookings/:bookingId/cancel",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { hotelId, bookingId } = req.params;

      // Fetch the service record to get payment details
      const data = await ServiceRecord.findOne({
        userId: req.userId,
        hotelId: hotelId,
        bookingId: bookingId,
      });

      if (!data) {
        return res.status(404).json({ message: "Service record not found" });
      }

      if (!data.amount) {
        return res
          .status(400)
          .json({ message: "Amount not found in service record" });
      }

      console.log(data);

      // Get payment details from Razorpay
      const payment = await razorpayInstance.payments.fetch(data.paymentId);

      if (!payment) {
        return res.status(400).json({ message: "Payment not found" });
      }

      if (
        payment.order_id !== data.orderId ||
        payment.notes.hotelId !== hotelId ||
        payment.notes.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment details mismatch" });
      }

      if (payment.status !== "captured") {
        return res.status(400).json({
          message: `Payment not captured. Status: ${payment.status}`,
        });
      }

      // Calculate the refund amount (10% deduction)
      const refundAmount = data.amount * 0.9; // Amount should be in paise

      // Initiate the refund process using Razorpay API
      const refundResponse = await axios.post(
        `https://api.razorpay.com/v1/payments/${data.paymentId}/refund`,
        {
          amount: Math.round(refundAmount), // Convert refund amount to nearest integer (paise)
        },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID as string,
            password: process.env.RAZORPAY_KEY_SECRET as string,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const refund = refundResponse.data;

      if (!refund || refund.status !== "processed") {
        return res.status(400).json({ message: "Refund failed" });
      }

      // Remove the booking from the hotel's bookings array
      const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId, "bookings._id": bookingId },
        {
          $set: { "bookings.$.status": "Cancelled" },
        },
        { new: true }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();

      // Update the service record with cancellation info
      const serviceRecord = await ServiceRecord.findOneAndUpdate(
        {
          userId: req.userId,
          hotelId: hotelId,
          bookingId: bookingId,
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

      res.status(200).json({
        message: "Booking cancelled and refunded successfully",
        serviceRecord,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
