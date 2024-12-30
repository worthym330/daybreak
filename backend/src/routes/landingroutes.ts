import express from "express";
import Razorpay from "razorpay";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  LandingBookingNonPartner,
  LandingCart,
  LandingInvoice,
  LandingOrder,
  LandingUser,
} from "../models/landingmodels";
import { createInvoice } from "./hotels";
import { NonPartner } from "./mail";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const generatePassword = () => Math.random().toString(36).slice(-8);

app.post("/create-order", async (req, res) => {
  const { email, phone, name, cartItems, totalAmount } = req.body;

  try {
    let user = await LandingUser.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new LandingUser({
        email,
        phone,
        name,
        password,
        hashedPassword,
      });
      await user.save();

      console.log(
        `User created with email: ${email} and password: ${password}`
      );
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const cart = new LandingCart({
      userId: user._id,
      items: cartItems,
      totalAmount,
    });
    await cart.save();

    const order = new LandingOrder({
      userId: user._id,
      cartId: cart._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      status: "created",
    });
    await order.save();

    res.status(200).json({
      orderId: razorpayOrder.id,
      currency: "INR",
      amount: razorpayOrder.amount,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.post("/validate-payment", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, userId } = req.body;

  try {
    // Find and update the order to mark it as paid
    const order = await LandingOrder.findOneAndUpdate(
      { razorpayOrderId },
      { paymentId: razorpayPaymentId, status: "paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create and save the invoice
    const invoice = new LandingInvoice({
      userId,
      orderId: order._id,
      invoiceNumber: `INV-${Date.now()}`,
      amount: order.amount,
    });
    await invoice.save();

    res.status(200).json({
      message: "Payment verified and order marked as paid",
      invoice,
      order,
    });
  } catch (error) {
    console.error("Error validating payment:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

app.get("/order-details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const invoices = await LandingInvoice.findOne({ orderId: id })
      .populate({
        path: "orderId",
        populate: {
          path: "cartId",
          populate: {
            path: "items",
          },
        },
      })
      .populate("userId");

    if (!invoices) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const user = await LandingUser.findById(invoices.userId);
    const order = await LandingOrder.findById(invoices.orderId);
    const carts = order ? await LandingCart.findById(order.cartId) : null;

    if (!carts) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const totalPrice = carts.items.reduce(
      (total: number, item: any) => total + parseFloat(item.price),
      0
    );

    const igstAmount = (totalPrice * 0.18).toFixed(2);

    const invoiceData = {
      bookingId: invoices.id,
      invoiceNo: invoices.invoiceNumber,
      date: new Date(invoices.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      placeOfSupply: "Maharashtra",
      customerName: user?.name,
      customerEmail: user?.email,
      hotelName: carts.items[0]?.hotelName,
      lineItems: [
        ...carts.items.map((item: any) => ({
          description: item.name,
          amount: item.price,
        })),
        {
          description: "Taxes @18%",
          amount: parseFloat(igstAmount).toFixed(2),
        },
      ],
    };

    const invoice = await createInvoice(invoiceData);
    res
      .status(200)
      .json({
        invoiceData,
        invoice: `${process.env.BACKEND_URL}/uploads/invoices/${invoice.filename
          .split("/")
          .pop()}`,
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
});

app.post("/non-partner", async (req, res) => {
  // const { name, email, phone, items } = req.body;
  console.log(req.body);
  const data = req.body;
  try {
    const order = new LandingBookingNonPartner(req.body);
    await order.save();

    const itemsHtml = data.items.map((item:any) => {
      const formattedDate = new Date(item.date).toDateString();
      return ` 
      <div class="details">
        <li><strong>Package Name:</strong> ${item.name}</li>
        <li><strong>Price:</strong> ₹${item.price}</li>
        <li><strong>No of Persion:</strong> ${item.quantity}</li>
        <li><strong>Hotel Name:</strong> ${item.hotelName}</li>
        <li><strong>Booking Date:</strong> ${formattedDate}</li>
        <hr>
        </div>
      `;
    }).join('');
    let payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      hotel: data.items[0].hotelName,
      length: data.items.length,
      items: itemsHtml
    }
    NonPartner(payload);

    res.status(200).send({ message: "Successfully Created order", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

export default app;
