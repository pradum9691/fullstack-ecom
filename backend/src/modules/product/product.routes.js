import express from "express";
import { addProduct, getProducts, getProductDetail } from "./product.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createProductSchema } from "./product.validation.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Upload images to Cloudinary (returns array of URLs)
router.post(
  "/upload-images",
  authMiddleware,
  roleMiddleware("RETAILER"),
  upload.array("images", 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => file.path);

    res.json({
      success: true,
      message: `${imageUrls.length} image(s) uploaded successfully`,
      data: imageUrls,
    });
  }
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("RETAILER"),
  validateBody(createProductSchema),
  addProduct
);

router.get("/", getProducts);
router.get("/:id", getProductDetail);

export default router;

