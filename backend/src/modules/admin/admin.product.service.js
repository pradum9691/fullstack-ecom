import { Product } from "../product/product.model.js";

export const getAdminProductsService = async (status) => {
  const filter = {};

  if (status) {
    filter.status = status.toUpperCase(); 
  }

  const products = await Product.find(filter)
    .populate({
      path: "retailer",
      select: "shopName user",
      populate: {
        path: "user",
        select: "name email",
        model: "User",
      },
    })
    .sort({ createdAt: -1 });

  return products;
};
