import { createProduct, fetchApprovedProducts } from "./product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "./product.model.js";
import redis from "../../config/redis.js";

export const addProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.user._id, req.body);
  const keys = await redis.keys("products:*");
  if (keys.length) await redis.del(keys);

  res.status(201).json({
    success: true,
    message: "Product added successfully, pending admin approval",
    data: product,
  });
});


export const getProducts = asyncHandler(async (req, res) => {
  const { ids, search = "", category, minPrice, maxPrice, sort } = req.query;
  const cacheKey = `products:${JSON.stringify(req.query)}`;
  
  let cached = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (error) {
    console.error("Redis connection failed. Falling back to MongoDB.", error.message);
  }

  if (cached) {

    return res.json({ success: true, data: JSON.parse(cached) });
  }

  const query = {
    status: "APPROVED",
    isActive: true,
  };

  if (ids) {
    const idArray = ids.split(",").filter(Boolean);
    query._id = { $in: idArray };
  }
   
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

 
  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }
 
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

 
  let sortQuery = { createdAt: -1 };
  if (sort === "price_asc") sortQuery = { price: 1 };
  if (sort === "price_desc") sortQuery = { price: -1 };

 
  const products = await Product.find(query).sort(sortQuery);

 
  try {
    await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
  } catch (error) {
    console.error("Redis save failed:", error.message);
  }



  res.json({
    success: true,
    data: products,
  });
});

export const getProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cacheKey = `product:${id}`;

  let cached = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (error) {
    console.error("Redis connection failed. Falling back to MongoDB.", error.message);
  }

  if (cached) {

    return res.json({ success: true, data: JSON.parse(cached) });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  try {
    await redis.set(cacheKey, JSON.stringify(product), "EX", 120);
  } catch (error) {
    console.error("Redis save failed:", error.message);
  }



  res.status(200).json({
    success: true,
    data: product,
  });
});
