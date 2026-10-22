import express from "express";
import { 
  applyRetailer,
  getRetailerProducts,
  getRetailerStats,
  getRetailerOrders
} from "./retailer.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

 
router.post(
  "/apply",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  applyRetailer
);

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("RETAILER"),
  getRetailerStats
);

router.get(
  "/products",
  authMiddleware,
  roleMiddleware("RETAILER"),
  getRetailerProducts
);

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("RETAILER"),
  getRetailerOrders
);

export default router;
