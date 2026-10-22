import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getWishlist, toggleWishlist } from "./wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);

export default router;
