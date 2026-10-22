import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAdminProductsService } from "./admin.product.service.js";

export const getAdminProducts = asyncHandler(async (req, res) => {
  const { status } = req.query; 

  const products = await getAdminProductsService(status);
  
  res.json({
    success: true,
    data: products,
  });
});