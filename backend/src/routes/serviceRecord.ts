import express, { Request, Response } from "express";
import ServiceRecord from "../models/invoice";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("", verifyToken, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      console.log(userId);
      
      // Fetch the service records by userId and populate user and hotel info
      const serviceRecords = await ServiceRecord.find({ userId: userId })
        .populate({
          path: "userId", // Populate user info
          select: "-password -otherSensitiveField", // Exclude sensitive fields
        })
        .populate({
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
  
      // Debug: Check the structure of parsedData
      console.log(parsedData);
  
      // Check if any of the service records' hotels have bookings made by the user
      const bookingExists = parsedData.some((record: any) => 
        record.hotelId.bookings.some(
          (booking: any) => booking.userId.toString() === userId.toString()
        )
      );
  
      console.log(bookingExists);
  
      res.status(200).json({ bookingExists });
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
      return res
        .status(404)
        .json({
          message: "Booking not found or service record does not exist",
        });
    }

    res.status(200).json(bookingExists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
