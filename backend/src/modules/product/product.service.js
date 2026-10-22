import { Product } from "./product.model.js";
import { Retailer } from "../retailer/retailer.model.js";
import { AppError } from "../../utils/AppError.js";

export const createProduct = async (userId, data) => {
  const retailer = await Retailer.findOne({
    user: userId,
    status: "APPROVED",
    isActive: true,
  });

  if (!retailer) {
    throw new AppError("Only approved retailers can add products", 403);
  }

  const product = await Product.create({
    retailer: retailer._id,
    ...data,
  });

  return product;
};
export const fetchApprovedProducts = async (query) => {
  const products = await Product.find({
    status: "APPROVED",
    isActive: true,
  });

  return {
    products,
  };
};

export const fetchProductById = async (id) => {
  return await Product.findOne({
    _id: id,
    status: "APPROVED",
    isActive: true,
  });
};
