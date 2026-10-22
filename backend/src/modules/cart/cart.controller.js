import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.service.js";

export const addItem = asyncHandler(async (req, res) => {

  
  const cart = await addToCart(req.user._id, req.body);
  res.json({ success: true, data: cart });
});

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user._id);
  res.json({ success: true, data: cart });
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(req.user._id, req.params.productId, req.body);
  res.json({ success: true, data: cart });
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user._id, req.params.productId);
  res.json({ success: true, data: cart });
});

export const clearMyCart = asyncHandler(async (req, res) => {
  await clearCart(req.user._id);
  res.json({ success: true, message: "Cart cleared" });
});
