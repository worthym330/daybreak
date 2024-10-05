import Discount from "../models/discount";

import express, { Request, Response } from "express";
const router = express.Router();

router.post("", async (req: Request, res: Response) => {
  try {
    const { code, percentage, expirationDate, status, amount, createdBy } =
      req.body;
    const discount = new Discount({
      code,
      percentage,
      expirationDate,
      status,
      amount,
      createdBy,
    });
    await discount.save();
    res.status(201).json({ message: "Discount created", discount });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!!!", error });
  }
});

// 2. Get all discounts
router.get("", async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

// 3. Get a specific discount by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

// 4. Update a discount by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { code, percentage, expirationDate, status, amount, updatedBy } =
      req.body;
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      { code, percentage, expirationDate, status, amount, updatedBy },
      { new: true, runValidators: true }
    );

    if (!updatedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json({ message: "Discount updated", updatedDiscount });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!!!", error });
  }
});

// 5. Delete a discount by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json({ message: "Discount deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

export default router;
