import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ["RAZORPAY", "STRIPE"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["CREATED", "PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "CREATED",
      index: true,
    },
    gatewayOrderId: { type: String, index: true, unique: true},
    gatewayPaymentId: { type: String, index: true },
    gatewayRefundId: { type: String, index: true },
    errorReason: String,
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
