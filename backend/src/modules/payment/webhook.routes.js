import express from "express";
import { razorpayWebhook } from "../modules/payment/razorpay.webhook.js";

const router = express.Router();


router.post(
  "/razorpay",
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf.toString(encoding || 'utf8');
    },
  }),
  razorpayWebhook
);

export default router;
