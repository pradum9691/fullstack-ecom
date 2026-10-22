import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  placeOrder,
  getMyOrdersController,
  getMySingleOrder,
  updateOrderStatus,
  downloadInvoice,
} from "./order.controller.js";
import { refundOrderController } from "../payment/refund.service.js";

const router = express.Router();


router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrdersController);
router.get("/my/:id", authMiddleware, getMySingleOrder);
router.patch("/my/:id/status", authMiddleware, updateOrderStatus);

router.get("/my/:id/invoice", downloadInvoice);
router.post("/my/:id/cancel", authMiddleware, refundOrderController);



export default router;
