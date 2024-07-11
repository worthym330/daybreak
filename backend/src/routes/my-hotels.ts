import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken, { verifyAdminToken } from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
// import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import {
  askForPermissionToAddHotel,
  notifyHotelUserRequestReceived,
} from "./mail";
import User from "../models/user";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// export const s3 = new AWS.S3();
router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 10),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const {
        name,
        city,
        state,
        description,
        cancellationPolicy,
        facilities,
        hotelType,
        productTitle,
        star,
        mapurl,
        pincode,
      } = req.body;

      // Upload images and get URLs
      const imageUrls = await uploadImages(imageFiles);
      const facilitiesMap = facilities.split(",");
      const HotelTypes = hotelType.split(",");

      const hotelData = await Hotel.find({
        userId: req.userId,
      });
      // Create a new hotel object
      const newHotel: HotelType = {
        userId: req.userId,
        name,
        city,
        state,
        description,
        cancellationPolicy,
        facilities: facilitiesMap,
        hotelType: HotelTypes,
        imageUrls: imageUrls,
        pincode,
        mapurl,
        productTitle: JSON.parse(productTitle).map((product: any) => ({
          title: product.title,
          description: product.description,
          adultPrice: product.adultPrice,
          childPrice: product.childPrice,
          otherpoints: product.otherpoints,
          notes: product.notes,
          maxPeople: product.maxPeople,
          // selectedDates: product.selectedDates.map(
          //   (date: string) => new Date(date)
          // ),
          slotTime: product.slotTime,
          startTime: product.startTime,
          endTime: product.endTime,
          isChildPrice: product.isChildPrice,
          maxGuestsperDay: product.maxGuestsperDay,
        })),
        star: Number(star),
        lastUpdated: new Date(),
        bookings: [],
        favourites: [],
        status: hotelData.length > 0 ? false : true,
      };

      // // Create and save the new hotel document
      const hotel = new Hotel(newHotel);
      await hotel.save();

      const user = await User.findById(req.userId);

      if (hotelData.length > 0) {
        const hotelInfo = {
          name: hotel.name,
          city: hotel.city,
          state: hotel.state,
          pincode: hotel.pincode,
          ownerName: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        };
        await askForPermissionToAddHotel(hotelInfo);
        await notifyHotelUserRequestReceived(hotelInfo);
      }

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId, status: true });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const { hotelId } = req.params;
      const imageFiles = req.files as Express.Multer.File[];
      const { productTitle, facilities, hotelType, ...hotelData } = req.body;
      // Find the existing hotel by ID
      const existingHotel = await Hotel.findById(hotelId);
      if (!existingHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Parse productTitle to ensure dates are correct
      const parsedProductTitle = JSON.parse(productTitle);

      const facilitiesMap = facilities.split(",");
      const HotelTypes = hotelType.split(",");

      // Delete the existing images if any new images are uploaded
      console.log(imageFiles);
      if (imageFiles.length > 0) {
        const existingImageUrls = existingHotel.imageUrls.map(
          (url: any) => url.split("/").pop() || ""
        );
        await deleteFiles(existingImageUrls);
      }

      // Upload new images
      const imageUrls = await uploadImages(imageFiles);

      const updatedHotel: HotelType = {
        ...existingHotel.toObject(),
        ...hotelData,
        facilities: facilitiesMap,
        hotelType: HotelTypes,
        imageUrls: imageFiles.length > 0 ? imageUrls : existingHotel.imageUrls,
        lastUpdated: new Date(),
        userId: req.userId,
        productTitle: parsedProductTitle,
      };

      console.log(updatedHotel);

      // Update the hotel in the database
      await Hotel.findByIdAndUpdate(hotelId, updatedHotel, { new: true });

      res.status(200).json(updatedHotel);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// async function uploadImages(imageFiles: Express.Multer.File[]) {
//   const uploadPromises = imageFiles.map(async (image) => {
//     const params = {
//       Bucket:'DayBreakPassimages',
//       Key: `images/${Date.now()}_${image.originalname}`,
//       Body: image.buffer,
//       ContentType: image.mimetype,
//       // ACL: 'public-read',
//     };

//     const res = await s3.upload(params).promise();
//     return res.Location;
//   });

//   const imageUrls = await Promise.all(uploadPromises);
//   return imageUrls;
// }

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadDir = path.resolve(__dirname, "../../uploads/hotel/images");

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const backendUri = process.env.BACKEND_URL || "http://localhost:8000"; // Replace with your actual backend URL

    const uploadPromises = imageFiles.map(async (image) => {
      const filename = `${image.originalname}`;
      const filePath = path.join(uploadDir, filename);

      await new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, image.buffer, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Construct the URL to access the image
      const imageUrl = `${backendUri}/uploads/hotel/images/${filename}`;
      return imageUrl;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error; // Propagate the error back to the caller
  }
}

async function deleteFiles(filenames: string[]) {
  try {
    const uploadDir = path.resolve(__dirname, "../../uploads/hotel/images");
    console.log("called at deled file");
    if (fs.existsSync(uploadDir)) {
      filenames.forEach((filename) => {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      });
      console.log(`All files in directory ${uploadDir} have been deleted.`);
    } else {
      console.log(`uploadDir ${uploadDir} does not exist.`);
    }
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
}

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    const files = hotel?.imageUrls || [];
    if (files.length > 0) {
      const filenames = files
        .map((file) => file.split("/").pop())
        .filter(Boolean) as string[];
      await deleteFiles(filenames);
    }
    await Hotel.deleteOne({
      _id: id,
      userId: req.userId,
    });
    res.status(200).json("Successfully deleted hotel");
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel" });
  }
});

router.get(
  "/reservations/hotel",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      // Extract query parameters
      const days =
        typeof req.query.days === "string" ? parseInt(req.query.days) : 7;
      const { bookingDate, firstName, lastName, email } = req.query;

      // Build filter object
      const filter: any = { userId: req.userId };

      // Use $elemMatch to filter bookings array

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      filter.bookings = {
        $elemMatch: {
          checkIn: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      };

      // Add other filters if provided
      if (bookingDate) {
        filter.bookings.$elemMatch.checkIn = new Date(bookingDate as string);
      }
      if (firstName) {
        filter.bookings.$elemMatch.firstName = firstName;
      }
      if (lastName) {
        filter.bookings.$elemMatch.lastName = lastName;
      }
      if (email) {
        filter.bookings.$elemMatch.email = email;
      }
      
      const hotel = await Hotel.findOne(filter);

      res.status(200).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  }
);

router.get(
  "/bookings/hotel",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      // Extract query parameters
      // const days = typeof req.query.days === "string" ? parseInt(req.query.days) : 7;
      const { bookingDate, firstName, lastName, email } = req.query;

      // Build filter object
      const filter: any = { userId: req.userId };

      // Use $elemMatch to filter bookings array

      const endDate = new Date();
      const startDate = new Date();
      // startDate.setDate(endDate.getDate() - days);
      // filter.bookings = {
      //   $elemMatch: {
      //     checkIn: {
      //       $gte: startDate,
      //       $lte: endDate,
      //     },
      //   },
      // };

      // Add other filters if provided
      if (bookingDate) {
        filter.bookings.$elemMatch.checkIn = new Date(bookingDate as string);
      }
      if (firstName) {
        filter.bookings.$elemMatch.firstName = firstName;
      }
      if (lastName) {
        filter.bookings.$elemMatch.lastName = lastName;
      }
      if (email) {
        filter.bookings.$elemMatch.email = email;
      }
      const hotel = await Hotel.findOne(filter)
      res.status(200).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  }
);

export default router;
