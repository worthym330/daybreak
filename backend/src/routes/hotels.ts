import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
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
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
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
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    try {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      const totalCost = hotel.pricePerNight * numberOfNights * 100; // Razorpay expects the amount in paise
      const receipt = `rcpt_${hotelId}_${req.userId}`.slice(0, 40);
      const options = {
        amount: totalCost, // amount in the smallest currency unit
        currency: "INR",
        receipt: receipt,
        payment_capture: 1, // 1 for automatic capture, 0 for manual
        notes: {
          hotelId,
          userId: req.userId,
        },
      };

      const order = await razorpay.orders.create(options);

      if (!order) {
        return res.status(500).json({ message: "Error creating order" });
      }

      const response = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
      console.log('responce value',response);

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// router.post(
//   "/:hotelId/bookings",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     try {
//       const paymentIntentId = req.body.paymentIntentId;

//       const paymentIntent = await stripe.paymentIntents.retrieve(
//         paymentIntentId as string
//       );

//       if (!paymentIntent) {
//         return res.status(400).json({ message: "payment intent not found" });
//       }

//       if (
//         paymentIntent.metadata.hotelId !== req.params.hotelId ||
//         paymentIntent.metadata.userId !== req.userId
//       ) {
//         return res.status(400).json({ message: "payment intent mismatch" });
//       }

//       if (paymentIntent.status !== "succeeded") {
//         return res.status(400).json({
//           message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
//         });
//       }

//       const newBooking: BookingType = {
//         ...req.body,
//         userId: req.userId,
//       };

//       const hotel = await Hotel.findOneAndUpdate(
//         { _id: req.params.hotelId },
//         {
//           $push: { bookings: newBooking },
//         }
//       );

//       if (!hotel) {
//         return res.status(400).json({ message: "hotel not found" });
//       }

//       await hotel.save();
//       res.status(200).send();
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "something went wrong" });
//     }
//   }
// );

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};


router.post('/:hotelId/favourite', async (req, res) => {
  const { hotelId } = req.params;
  const { userId, firstName, lastName, email } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const favouriteIndex = hotel.favourites.findIndex(fav => fav.userId === userId);

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
    res.status(500).json({ message: 'An error occurred', error });
  }
});

export default router;

