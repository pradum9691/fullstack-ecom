import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getMyAddresses,
  addAddress,
  deleteAddress,
} from "./address.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyAddresses);
router.post("/", addAddress);
router.delete("/:id", deleteAddress);

export default router;
