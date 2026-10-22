import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  addItem,
  getMyCart,
  updateItem,
  removeItem,
  clearMyCart,
} from "./cart.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "./cart.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyCart);
router.post("/add", validateBody(addToCartSchema), addItem);
router.patch("/:productId", validateBody(updateCartItemSchema), updateItem);
router.delete("/:productId", removeItem);
router.delete("/", clearMyCart);

export default router;
