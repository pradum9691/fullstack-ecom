import { getRazorpay } from "../../config/razorpay.js";
import { Payment } from "./payment.model.js";
import { Order } from "../order/order.model.js";
import { Product } from "../product/product.model.js";
import { AppError } from "../../utils/AppError.js";

const razorpay = getRazorpay();

export const refundOrderPayment = async (orderId) => {
  const order = await Order.findById(orderId).populate("items.product");
  if (!order) throw new AppError("Order not found", 404);

  if (order.status === "DELIVERED")
    throw new AppError("Delivered orders cannot be cancelled", 400);

  if (order.status === "CANCELLED")
    throw new AppError("Order already cancelled", 400);

  if (order.status !== "PAID")
    throw new AppError("Only PAID orders can be refunded", 400);

  const payment = await Payment.findOne({
    order: order._id,
    gateway: "RAZORPAY",
    status: "SUCCESS",
  }).sort({ createdAt: -1 });

  if (!payment || !payment.gatewayPaymentId)
    throw new AppError("Successful Razorpay payment not found", 404);

  const razorpayRefund = await razorpay.payments.refund(
    payment.gatewayPaymentId,
    { amount: payment.amount * 100 }
  );

  payment.status = "REFUNDED";
  payment.gatewayRefundId = razorpayRefund.id;
  await payment.save();

  order.status = "CANCELLED";
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: "CANCELLED",
    updatedBy: "CUSTOMER",
    timestamp: new Date(),
  });

  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: item.quantity },
    });
  }

  return { order, payment, razorpayRefund };
};

export const refundOrderController = async (req, res) => {
  try {
    const result = await refundOrderPayment(req.params.id);
    res.json({
      success: true,
      message: "Order cancelled & refund initiated",
      data: result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Refund failed",
    });
  }
};