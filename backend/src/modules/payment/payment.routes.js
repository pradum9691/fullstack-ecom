import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../payment/payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/razorpay-order", authMiddleware, createRazorpayOrder);
router.post("/razorpay-verify", authMiddleware, verifyRazorpayPayment);

export default router;
