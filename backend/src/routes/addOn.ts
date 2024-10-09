import express, { Request, Response } from "express";
import AddOn from "../models/addOnSchema";
import Hotel from "../models/hotel";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { hotelId, name, description, price, status } = req.body;

  try {
    const newAddOn = new AddOn({
      hotelId,
      name,
      description,
      price,
      status,
    });
    const add = await newAddOn.save();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    if (!hotel.addOns) {
      hotel.addOns = [];
    }
    hotel.addOns.push(add._id.toString());
    await hotel.save();
    res.status(201).send(newAddOn);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/", async (req, res) => {
  const { hotelId } = req.query;
  try {
    const addOns = await AddOn.find({ hotelId });
    res.send(addOns).status(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL
  const { hotelId, name, description, price, status } = req.body; // Extract data from the request body

  try {
    const updatedHotel = await AddOn.findByIdAndUpdate(
      id,
      { hotelId, name, description, price, status },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updatedHotel); // Send the updated document as the response
  } catch (error) {
    res.status(500).json({ error: "Error updating hotel", details: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const addOn = await AddOn.findById(req.params.id);
    if (!addOn) {
      return res.status(404).send({ message: "Add-On not found." });
    }
    res.send(addOn);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const addOn = await AddOn.findById(id);
    if (!addOn) {
      return res.status(404).send({ message: "AddOn not found" });
    }
    const hotel = await Hotel.findById(addOn.hotelId);
    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    if (!hotel.addOns) {
      hotel.addOns = [];
    }
    hotel.addOns = hotel?.addOns.filter(
      (addOnIdInArray) => addOnIdInArray.toString() !== id
    );
    await hotel.save();
    await AddOn.findByIdAndDelete(id);

    res.status(200).send({ message: "AddOn deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
