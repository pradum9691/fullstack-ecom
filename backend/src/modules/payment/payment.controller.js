import crypto from "crypto";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRazorpayInstance } from "../../utils/razorpay.js";
import { Order } from "../order/order.model.js";
import { AppError } from "../../utils/AppError.js";
import { Payment } from "./payment.model.js";
import { User } from "../../models/user.model.js";
import { sendEmail } from "../../utils/email.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const razorpay = getRazorpayInstance();
  const { orderId } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    status: "PENDING_PAYMENT",
  });

  if (!order) {
    throw new AppError("Order not found or already paid", 400);
  }

  const rpOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: order._id.toString(),
  });

  await Payment.create({
    order: order._id,
    gateway: "RAZORPAY",
    amount: order.totalAmount,
    status: "CREATED",
    gatewayOrderId: rpOrder.id,
  });

  res.json({
    success: true,
    order: rpOrder,
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new AppError("Invalid payment signature", 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    status: "PENDING_PAYMENT",
  });

  if (!order) throw new AppError("Order not found", 404);

  const payment = await Payment.findOneAndUpdate(
    {
      gatewayOrderId: razorpay_order_id,
      order: order._id,
    },
    {
      status: "SUCCESS",
      gatewayPaymentId: razorpay_payment_id,
    },
    { new: true }
  );

  if (!payment) throw new AppError("Payment record not found", 404);

  order.status = "PAID";
  order.statusHistory.push({
    status: "PAID",
    updatedBy: "PAYMENT",
    timestamp: new Date(),
  });

  await order.save();
  const user = await User.findById(order.user);

if (user?.email) {
  await sendEmail({
    to: user.email,
    subject: "Payment Successful",
    html: `
      <h2>Payment Received</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Amount:</b> ₹${order.totalAmount}</p>
      <p>Your payment was successful. Thank you for shopping with us!</p>
    `,
  });
}

  res.json({
    success: true,
    message: "Payment verified successfully",
  });
});