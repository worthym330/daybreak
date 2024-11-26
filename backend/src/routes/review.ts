import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import axios from "axios";
import Review from "../models/reviews";

const router = express.Router();

// /api/waitlist
router.post("/:hotelId", async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    const { rating, comment, userId } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    const review = new Review({
      rating,
      userId,
      comment,
      hotel: hotelId,
    });
    await review.save();
    hotel?.reviews?.push(review._id);
    await hotel.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, userId, status } = req.body;

    // Find and update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment, userId, status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find and delete the review
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Remove the review reference from the hotel's reviews array
    await Hotel.findByIdAndUpdate(review.hotel, {
      $pull: { reviews: id },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/status/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Only the fields to update

    // Update specific fields in the review
    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id).populate("hotel", "name address");
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    // Fetch all reviews with optional hotel details
    const reviews = await Review.find().populate("hotel", "name address");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:hotelId/hotels", async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    console.log(hotelId);
    const reviews = await Review.find({ hotel: hotelId }).populate({
      path: "userId",
      select: "firstName lastName email",
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:hotelId/detail", async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    const reviews = await Review.find({ hotel: hotelId }).populate({
      path: "userId",
      select: "firstName lastName email",
    });
    // const reviews = await Review.find({ hotel: hotelId, status: "approved" });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

async function getPlaceId(shortUrl: string | undefined) {
  try {
    if (shortUrl) {
      const response = await axios.get(shortUrl);
      const resolvedUrl = response.request.res.responseUrl;
      const placeIdMatch = resolvedUrl.match(/place\/(?:[^/]+\/)?([^/?]+)/);
      if (placeIdMatch) {
        return placeIdMatch[1];
      } else {
        throw new Error("Place ID not found in the resolved URL.");
      }
      // return response.data
    }
  } catch (error) {}
}

async function reverseGeocode(lat: any, lng: any) {
  if (!lat || !lng) {
    throw new Error("Latitude and Longitude are required.");
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    // Perform the reverse geocoding request
    const response = await axios.get(url);

    // Check the API response status
    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];

      return {
        formatted_address: result.formatted_address,
        place_id: result.place_id,
        location: {
          lat,
          lng,
        },
        full_response: result, // Optional: Include the full response if needed
      };
    } else {
      throw new Error("No results found for the given coordinates.");
    }
  } catch (error) {
    console.error("Geocoding API error:", error);
    throw new Error("Failed to fetch geocoding information.");
  }
}

// Helper function to fetch reviews using Place ID
async function fetchReviews(placeId: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching reviews from Places API.");
  }
}

// API endpoint to get reviews
router.get("/google/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const hotel = await Hotel.findById(hotelId);

  try {
    const placeId = await getPlaceId(hotel?.mapurl);
    const match = placeId.match(
      /@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/
    );

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      const latlng = { lat, lng };
      const reverseData = await reverseGeocode(lat, lng);

      const reviews = await fetchReviews(reverseData.place_id);
      res.json({
        reverseData,
        reviews,
        url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${reverseData.place_id}&key=${process.env.GOOGLE_API_KEY}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});
export default router;
