import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import waitlistRoutes from "./routes/waitlist";
import contactRoutes from "./routes/contactus";
import invoiceRoutes from "./routes/serviceRecord";
import discountRoutes from "./routes/discount";
import addOnRoutes from "./routes/addOn";
import axios from "axios";
const url = require("url");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
const options: mongoose.ConnectOptions & {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
} = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string, options)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels/", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/waitlist/", waitlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/add-ons", addOnRoutes);

app.get("/expand-url", async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid or missing URL parameter" });
  }

  try {
    // console.log("called", req.query);
    const response = await axios.get(
      `https://unshorten.me/s/${encodeURIComponent(url)}`
    );
    console.log(response.request.res);
    let expandedUrl = response.data;

    const consentPrefix = "https://consent.google.com/m?continue=";
    if (expandedUrl.startsWith(consentPrefix)) {
      expandedUrl = decodeURIComponent(
        expandedUrl.substring(consentPrefix.length)
      );
    }

    const parsedUrl = new URL(expandedUrl);
    parsedUrl.searchParams.set("hl", "en");
    expandedUrl = parsedUrl.toString();
    // console.log(expandedUrl);

    res.json({ expandedUrl });
  } catch (error) {
    console.error("Error expanding URL:", error);
    res.status(500).json({ error: "Failed to expand URL" });
  }
});
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
// });

app.listen(process.env.PORT, () => {
  console.log(`server running on localhost:${process.env.PORT}`);
});
