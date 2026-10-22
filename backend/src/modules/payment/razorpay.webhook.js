import crypto from "crypto";
import { Payment } from "./payment.model.js";
import { Product } from "../product/product.model.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (signature && secret) {
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        // running in test mode
      } else {
        // signature verified
      }
    } else {
      // test mode
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const paymentEntity = req.body.payload.payment.entity;

      const payment = await Payment.findOne({
        gatewayOrderId: paymentEntity.order_id,
        gateway: "RAZORPAY",
      }).populate("order");



      if (!payment) {

        return res.json({ ok: true });
      }

      if (payment.status === "SUCCESS") {

        return res.json({ ok: true });
      }

       
      payment.status = "SUCCESS";
      payment.gatewayPaymentId = paymentEntity.id;
      await payment.save();


      const order = payment.order;

  
      if (order && order.status === "PENDING_PAYMENT") {
        order.status = "PAID";
        await order.save();


        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }

      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(" Webhook error:", err.message);
    res.json({ ok: true });
  }
};
