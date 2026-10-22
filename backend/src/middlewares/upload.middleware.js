import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "annesie-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit", quality: "auto" },
    ],
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 5, // max 5 images per request
  },
});
