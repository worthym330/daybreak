import express, { Request, Response } from "express";
import AddOn from "../models/addOnSchema";
import Hotel from "../models/hotel";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { hotelId, name, description, price, status, productId } = req.body;

  try {
    const newAddOn = new AddOn({
      hotelId,
      name,
      description,
      price,
      status,
      productId,
    });
    const add = await newAddOn.save();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    const productIndex = hotel.productTitle.findIndex(
      (product) => product._id.toString() === productId
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .send({ message: "Product not found in the hotel" });
    }
    hotel.productTitle[productIndex].addOns.push(add._id);
    if (!hotel.addOns) {
      hotel.addOns = [];
    }
    hotel.addOns.push(add._id.toString());
    await hotel.save();
    res.status(201).send({ newAddOn, hotel: hotel.productTitle[productIndex] });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/", async (req, res) => {
  const { hotelId } = req.query;

  try {
    if (hotelId) {
      // Find the hotel by its ID and populate the productTitle field with the addOns
      const hotel = await Hotel.findById(hotelId).populate({
        path: "productTitle.addOns", // Populate addOns within productTitle
        model: "AddOn", // Name of the model for AddOns
      });

      if (!hotel) {
        return res.status(404).send({ message: "Hotel not found" });
      }

      // Filter out productTitle entries where addOns is empty and format the response
      const formattedData = hotel.productTitle
        .filter((product) => product.addOns && product.addOns.length > 0)
        .flatMap((product) =>
          product.addOns.map((addon: any) => ({
            id: addon._id,
            productId: addon.productId, // Assuming each product has an ID
            name: addon.name,
            description: addon.description,
            price: addon.price,
            status: addon.status,
            createdAt: addon.createdAt,
            updatedAt: addon.updatedAt,
            title: product.title, // Title from the product
          }))
        );

      return res.status(200).send(formattedData);
    } else {
      const hotels = await Hotel.find().populate({
        path: "productTitle.addOns", // Populate addOns within productTitle
        model: "AddOn", // Name of the model for AddOns
      });

      // Flatten the response structure
      const formattedData = hotels.flatMap((hotel) => {
        return hotel.productTitle
          .filter((product) => product.addOns && product.addOns.length > 0)
          .flatMap((product) =>
            product.addOns.map((addon: any) => ({
              id: addon._id,
              hotelId: hotel.name, // Hotel ID
              productId: addon.productId, // Product ID
              name: addon.name,
              description: addon.description,
              price: addon.price,
              status: addon.status,
              createdAt: addon.createdAt,
              updatedAt: addon.updatedAt,
              title: product, // Title from the product
            }))
          );
      });

      return res.status(200).send(formattedData);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; // Extract the AddOn ID from the URL
  const { hotelId, name, description, price, status, productId } = req.body; // Extract data from the request body

  try {
    // Fetch the current AddOn to compare the existing productId
    const existingAddOn = await AddOn.findById(id);
    if (!existingAddOn) {
      return res.status(404).json({ message: "AddOn not found" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if the productId has changed
    const existingProductId = existingAddOn.productId;
    if (existingProductId && existingProductId !== productId) {
      // Find the old product and remove the addOn reference
      const oldProductIndex = hotel.productTitle.findIndex(
        (product) => product._id.toString() === existingProductId
      );
      if (oldProductIndex !== -1) {
        hotel.productTitle[oldProductIndex].addOns = hotel.productTitle[
          oldProductIndex
        ].addOns.filter((addOn: any) => addOn.toString() !== id);
      }
    }

    // Now proceed to update the AddOn document with the new data
    const updatedAddOn = await AddOn.findByIdAndUpdate(
      id,
      { hotelId, name, description, price, status, productId },
      { new: true }
    );

    if (!updatedAddOn) {
      return res.status(404).json({ message: "AddOn not found" });
    }

    // Find the new product by its productId and push the updated addOn to the product's addOns array
    const newProductIndex = hotel.productTitle.findIndex(
      (product) => product._id.toString() === productId
    );
    if (newProductIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the hotel" });
    }

    // Ensure the new product has an addOns array and add the updated AddOn reference
    hotel.productTitle[newProductIndex].addOns.push(id);

    // Save the updated hotel
    await hotel.save();

    res.status(200).json(updatedAddOn); // Send the updated AddOn as the response
  } catch (error) {
    res.status(500).json({ error: "Error updating AddOn", details: error });
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
    // Find the AddOn by its ID
    const addOn = await AddOn.findById(id);
    if (!addOn) {
      return res.status(404).send({ message: "AddOn not found" });
    }

    // Find the Hotel that contains this AddOn
    const hotel = await Hotel.findById(addOn.hotelId);
    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    if (!hotel.addOns) {
      hotel.addOns = [];
    }

    // Remove the AddOn from the hotel's addOns array
    hotel.addOns = hotel.addOns.filter(
      (addOnIdInArray) => addOnIdInArray.toString() !== id
    );

    // Remove the AddOn from each relevant product's addOns array
    hotel.productTitle.forEach((product) => {
      product.addOns = product.addOns.filter(
        (addOnIdInProduct: any) => addOnIdInProduct.toString() !== id
      );
    });

    // Save the updated hotel
    await hotel.save();
    // Delete the AddOn
    await AddOn.findByIdAndDelete(id);

    res.status(200).send({ message: "AddOn deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: "Error deleting AddOn", details: error });
  }
});

export default router;
