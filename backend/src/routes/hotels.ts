import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken, {
  createAndVerifyToken,
  verifyAdminToken,
} from "../middleware/auth";
import Razorpay from "razorpay";
import ServiceRecord from "../models/invoice";
import axios from "axios";
import { HotelDetails, Slot } from "../models/productdetail";
import { sendPaymentConfirmationSms } from "./twillio";
import User from "../models/user";
import {
  BookingConfirmation,
  PaymentFailed,
  PaymentSuccess,
  sendCredentials,
  sendInvoiceToCustomer,
} from "./mail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const pdf = require("pdf-creator-node") as any;
import fs from "fs";
import path from "path";
const moment = require("moment");

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

    const pageSize = 10;
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
      const hotel = await Hotel.findById(id).populate({
        path: "titlesId",
        populate: { path: "slots", populate:"hotelProductId" },
      });
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
      const hotel = await Hotel.findOne({ name: name }).populate({
        path: "titlesId",
        populate: { path: "slots" },
      });
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  // createAndVerifyToken,
  async (req: Request, res: Response) => {
    const { cartItems, discount, gst } = req.body;
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
          // userId: req.userId,
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
  createAndVerifyToken,
  async (req: Request, res: Response) => {
    try {
      const {
        paymentIntentId,
        orderId,
        cart,
        phone,
        email,
        firstName,
        lastName,
      } = req.body;
      console.log(email, req.userId);
      let user, mailPayload, token, password;
      // Verify the payment signature
      const payment = await razorpayInstance.payments.fetch(paymentIntentId);
      const hotel = await Hotel.findById(req.params.hotelId);
      if (req.userId !== "") {
        user = await User.findById(req.userId);

        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        mailPayload = {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          hotelName: hotel?.name,
          date: cart[0].date,
          amount: payment.amount,
        };
      } else {
        console.log("called");

        // Check if user already exists with the given email
        user = await User.findOne({ email });

        if (user) {
          console.log("User already exists with this email");
          mailPayload = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            hotelName: hotel?.name,
            date: cart[0].date,
            amount: payment.amount,
          };
        } else {
          // Check email domain
          if (email.endsWith("@gmail.com")) {
            password = null;
          } else {
            password = firstName; // Set password as firstName for non-gmail users
          }

          // Hash the password only if it's not null
          let hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : null;

          // Create a new user
          const body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            role: "customer",
            password: hashedPassword, // Save hashed password if it's not null
          };
          user = new User(body);
          await user.save();

          token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET_KEY as string,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
          });

          // Prepare mail payload
          mailPayload = {
            email: email,
            name: `${user.firstName} ${user.lastName}`,
            hotelName: hotel?.name,
            date: cart[0].date,
            amount: payment.amount,
            password: password ? password : "N/A", // Include password if exists, otherwise show "N/A"
          };
          const mailCredentialData = {
            name: `${user.firstName} ${user.lastName}`,
            email: email,
            password,
          };
          sendCredentials(mailCredentialData);
        }
      }

      if (!payment) {
        return res.status(400).json({ message: "Payment not found" });
      }

      if (
        payment.order_id !== orderId ||
        payment.notes.hotelId !== req.params.hotelId
      ) {
        return res.status(400).json({ message: "Payment details mismatch" });
      }

      if (payment.status !== "captured") {
        PaymentFailed(mailPayload);
        return res.status(400).json({
          message: `Payment not captured. Status: ${payment.status}`,
        });
      }

      let totalCost: number = (payment.amount as number) / 100;

      const newBooking: BookingType = {
        ...req.body,
        userId: user ? user._id : undefined,
        totalCost: totalCost,
        cart: cart,
      };

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      // Initialize the bookings array if it's null or undefined
      if (!hotel.bookings) {
        hotel.bookings = [];
      }

      // Push the new booking to the bookings array
      hotel.bookings.push(newBooking);

      // Save the hotel document after updating
      await hotel.save();

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();
      const newInvoiceId = await generateInvoiceId();

      const serviceRecord = new ServiceRecord({
        userId: user ? user._id : undefined,
        hotelId: req.params.hotelId,
        bookingId: hotel.bookings[hotel.bookings.length - 1]._id,
        paymentId: paymentIntentId,
        orderId: orderId,
        invoiceId: newInvoiceId,
        amount: totalCost,
        servicesUsed:
          cart.map((l: { product: { title: any } }) => l.product.title) || [],
        paymentStatus: payment.status,
        slot: cart[0].slot,
        date: cart[0].date,
      });
      const data = await serviceRecord.save();

      const totalPrice = cart.reduce(
        (total: number, item: any) => total + item.price,
        0
      );

      // Calculate taxes based on the total price
      const igstAmount = (totalPrice * 0.18).toFixed(2);
      const serviceTaxAmount = (totalPrice * 0.05).toFixed(2);

      const invoiceData = {
        bookingId: serviceRecord.bookingId,
        invoiceNo: newInvoiceId,
        date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        // companyLegalName: "Your Company Name",
        customerName: `${user.firstName} ${user.lastName}`,
        // customerGSTIN:
        // customerAddress: "Customer Address Here",
        hotelName: hotel?.name,
        hotelCity: hotel?.city,
        passDate: cart[0].date,
        slotTime: cart[0].slot,
        customerEmail: user.email,
        lineItems: [
          ...cart.map((item: any) => ({
            description: item.product.title,
            amount: item.price,
          })),
          {
            description: "IGST @18%",
            amount: igstAmount,
          },
          {
            description: "Service Tax @5%",
            amount: serviceTaxAmount,
          },
        ],
      };
      data.lineItems = invoiceData.lineItems;
      await data.save();
      createInvoiceandSendCustomer(invoiceData);

      sendPaymentConfirmationSms(
        phone,
        hotel?.name || "",
        serviceRecord.servicesUsed,
        cart[0].date,
        cart[0].slot
      );

      // mailPayload.bookingId = serviceRecord.bookingId
      PaymentSuccess(mailPayload, serviceRecord.bookingId);
      // BookingConfirmation(mailPayload,serviceRecord.bookingId);
      res.status(200).json({
        data: {
          id: user?._id || "",
          name: `${user.firstName} ${user.lastName}`,
          email: user?.email || "",
          token: token,
          role: user?.role || "customer",
        },
      });
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

  if (queryParams.passes) {
    constructedQuery["productTitle.title"] = {
      $in: Array.isArray(queryParams.passes)
        ? queryParams.passes
        : [queryParams.passes],
    };
  }

  if (queryParams.cities) {
    const cities = [queryParams.cities];
    constructedQuery["city"] = {
      $in: cities.flat().map((city: string) => new RegExp(city, "i")),
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

router.get("/getdata/hotel/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the hotel and populate the titlesId with HotelDetails
    const hotel = await Hotel.findById(id).populate({
      path: "titlesId",
      populate: { path: "slots" },
    });

    // Respond with the hotel data including populated HotelDetails
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error });
  }
});

// Update HotelDetails by ID
router.put("/hotel-details/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    // Find the HotelDetails by ID and update it with the provided data
    const updatedHotelDetails = await HotelDetails.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedHotelDetails) {
      return res.status(404).json({ message: "HotelDetails not found" });
    }

    // Respond with the updated HotelDetails data
    res.status(200).json(updatedHotelDetails);
  } catch (error) {
    console.error("Error updating HotelDetails:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/hotel-details/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const hotelDetails = await HotelDetails.findById(id);

    if (!hotelDetails) {
      return res.status(404).json({ message: "HotelDetails not found" });
    }

    const hotel = await Hotel.findById(hotelDetails.hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Associated hotel not found" });
    }

    const titlesId = hotel.titlesId || [];

    hotel.titlesId = titlesId.filter(
      (titleId: string) => titleId !== hotelDetails._id.toString()
    );

    await hotel.save();

    await HotelDetails.findByIdAndDelete(id);

    res.status(200).json({
      message: "HotelDetails deleted and titlesId removed from hotel",
      updatedHotel: hotel,
    });
  } catch (error) {
    console.error("Error deleting HotelDetails:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update HotelDetails by ID
router.post("/hotel-details", async (req: Request, res: Response) => {
  const { state, hotelId } = req.body;
  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    hotel.titlesId = hotel.titlesId || [];

    const payload = {
      _id: new mongoose.Types.ObjectId(),
      title: state.title,
      date: state.startTime.split("T")[0],
      slotTime: `${state.startTime} - ${state.endTime}`,
      startTime: state.startTime,
      endTime: state.endTime,
      hotelId,
    };
    const hotelPass = await HotelDetails(payload);
    hotelPass.save();
    hotel.titlesId.push(hotelPass._id);
    hotel.save();
    res.status(200).json(hotelPass);
  } catch (error) {
    console.error("Error updating HotelDetails:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return dateArray;
};

router.post("/hotel-details/bulk-creations", async (req, res) => {
  try {
    const {
      hotelId,
      startDate,
      endDate,
      title,
      pricingFields,
      startTime,
      endTime,
    } = req.body;
    const start = new Date(startTime).toISOString().split("T")[1].split(".")[0];
    const end = new Date(endTime).toISOString().split("T")[1].split(".")[0];
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    hotel.titlesId = hotel.titlesId || [];
    const dateRange = getDatesInRange(startDate, endDate);
    for (const currentDate of dateRange) {
      for (const selectedTitle of title) {
        const productTitle = hotel.productTitle.find(
          (pt) => pt.title === selectedTitle
        );
        if (!productTitle) {
          continue;
        }
        const slots = createSlots(start, end, productTitle.slotTime);

        console.log(
          "productTitle.startTime,productTitle.endTime,",
          start,
          end,
          productTitle.startTime,
          productTitle.endTime
        );
        const peoplePerSlot = Math.round(
          productTitle.maxGuestsperDay / slots.length
        );
        const startDateTime = moment(
          `${currentDate.toISOString().split("T")[0]} ${start}`,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate();
        const endDateTime = moment(
          `${currentDate.toISOString().split("T")[0]} ${end}`,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate();
        const {
          adultWeekdayPrice,
          adultWeekendPrice,
          childWeekdayPrice,
          childWeekendPrice,
        } = pricingFields[selectedTitle] || {};
        const hotelDetailDoc = new HotelDetails({
          title: selectedTitle,
          date: currentDate,
          slotTime: `${startDateTime} - ${endDateTime}`,
          startTime: startDateTime,
          endTime: endDateTime,
          hotelId,
          adultWeekdayPrice,
          adultWeekendPrice: pricingFields[selectedTitle]?.includeWeekendPrice
            ? adultWeekendPrice
            : undefined,
          childWeekdayPrice: pricingFields[selectedTitle]?.includeChildPrice
            ? childWeekdayPrice
            : undefined,
          childWeekendPrice:
            pricingFields[selectedTitle]?.includeChildPrice &&
            pricingFields[selectedTitle]?.includeWeekendPrice
              ? childWeekendPrice
              : undefined,
        });
        const savedHotelDetail = await hotelDetailDoc.save();
        for (const slot of slots) {
          const [slotStartTime, slotEndTime] = slot.split(" - ");
          const startSlotDateTime = moment(
            `${currentDate.toISOString().split("T")[0]} ${slotStartTime}`,
            "YYYY-MM-DD hh:mm a"
          ).toDate();
          const endSlotDateTime = moment(
            `${currentDate.toISOString().split("T")[0]} ${slotEndTime}`,
            "YYYY-MM-DD hh:mm a"
          ).toDate();
          const slotDoc = new Slot({
            hotelId,
            hotelProductId: savedHotelDetail._id,
            slotTime: `${slotStartTime} - ${slotEndTime}`,
            startTime: startSlotDateTime,
            endTime: endSlotDateTime,
            peoplePerSlot,
          });
          const savedSlot = await slotDoc.save();
          hotelDetailDoc.slots.push(savedSlot._id);
        }
        await hotelDetailDoc.save();
        hotel.titlesId.push(savedHotelDetail._id);
      }
    }

    await hotel.save();

    res.status(201).json({
      message: "Passes, hotel details, and slots added successfully",
      hotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

const createSlots = (startTime: any, endTime: any, slotTime: string) => {
  const slots = [];
  let start = new Date(`1970-01-01T${startTime}`);
  let end = new Date(`1970-01-01T${endTime}`);
  let slotDuration = parseInt(slotTime, 10) * 60 * 60 * 1000;
  const breakTime = 0;
  console.log("slots", startTime, endTime, start, end);
  while (start < end) {
    let slotEnd = new Date(start.getTime() + slotDuration);
    if (slotEnd > end) break;
    const formattedStart = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedEnd = slotEnd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(`${formattedStart} - ${formattedEnd}`);
    slots.push(`${formattedStart} - ${formattedEnd}`);
    start = new Date(slotEnd.getTime() + breakTime);
  }
  return slots;
};

router.put("/hotel-details/slots/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedSlot = await Slot.findByIdAndUpdate(
      id,
      { status: status === "Active" ? true : false },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.status(200).json({
      message: "Slot updated successfully",
      updatedSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

const createInvoice = async (invoiceData: any) => {
  // Path to the template
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "../invoicetemplates/customerInvoice.html"),
    "utf8"
  );

  // PDF options
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };

  // Data to pass to the template
  const document = {
    html: htmlTemplate,
    data: {
      bookingId: invoiceData.bookingId,
      invoiceNo: invoiceData.invoiceNo,
      date: invoiceData.date,
      placeOfSupply: invoiceData.placeOfSupply,
      companyLegalName: invoiceData.companyLegalName,
      customerName: invoiceData.customerName,
      customerGSTIN: invoiceData.customerGSTIN,
      customerAddress: invoiceData.customerAddress,
      lineItems: invoiceData.lineItems,
      grandTotal: invoiceData.lineItems
        .reduce(
          (total: number, item: any) => total + parseFloat(item.amount),
          0
        )
        .toFixed(2),
    },
    path: `./uploads/invoices/${invoiceData.invoiceNo}-${invoiceData.customerName}.pdf`,
    type: "",
  };

  // Create PDF
  try {
    const res = await pdf.create(document, options);
    console.log(`Invoice created at: ${res.filename}`);
    return res;
  } catch (error) {
    console.error("Error creating PDF:", error);
  }
};

router.get("/invoice/create-inv", async (req, res) => {
  // Example data
  const invoiceData = {
    bookingId: "NH78061353474870",
    invoiceNo: "M06HL25I06066024",
    date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    placeOfSupply: "Maharashtra",
    companyLegalName: "WAMAN VITTHAL KUSHE",
    customerName: "Vitthal Kushe",
    // customerGSTIN: "27BKMPK7607J1ZP",
    customerEmail: "mbasant829@gmail.co,",
    customerAddress: "18,1801 / 3E WING, 412 PAHADI, New Link Road, Mumbai...",
    lineItems: [
      { description: "Accommodation Charges", amount: "782.88" },
      { description: "Service Fees", amount: "71.08" },
      { description: "IGST @18%", amount: "12.8" },
    ],
  };

  await createInvoiceandSendCustomer(invoiceData);
  // 9335555768
  res.json({ message: "Created inv" });
});

const createInvoiceandSendCustomer = async (invoiceData: any) => {
  const invoice = await createInvoice(invoiceData);
  console.log(invoice);
  const mailPayload = {
    fullName: invoiceData.customerName,
    email: invoiceData.customerEmail,
    invoicePath: invoice.filename,
  };
  await sendInvoiceToCustomer(mailPayload);
};

const generateInvoiceId = async () => {
  const latestRecord = await ServiceRecord.findOne({}, { invoiceId: 1 })
    .sort({ createdAt: -1 })
    .lean();

  // Check if there's a previous invoiceId and extract the number part
  let newInvoiceNumber = 1;
  if (latestRecord && latestRecord.invoiceId) {
    const invoiceNumber = parseInt(
      latestRecord.invoiceId.replace("DBP", ""),
      10
    );
    newInvoiceNumber = invoiceNumber + 1;
  }

  // Format the invoice number to always be 6 digits (DBP000001, DBP000002, etc.)
  const formattedInvoiceId = `DBP${newInvoiceNumber
    .toString()
    .padStart(6, "0")}`;
  return formattedInvoiceId;
};
export default router;
