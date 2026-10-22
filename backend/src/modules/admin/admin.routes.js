import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getPendingRetailers,
  approveRetailer,
  rejectRetailer,
  approveProduct,
  rejectProduct,
  getAllOrders,
  updateOrderStatusAdmin,
} from "./admin.controller.js";

const router = express.Router();


router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);

 
router.get("/retailers", getPendingRetailers);
router.patch("/retailers/:id/approve", approveRetailer);
router.patch("/retailers/:id/reject", rejectRetailer);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatusAdmin);

router.patch(
  "/products/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveProduct
);

router.patch(
  "/products/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectProduct
);


export default router;