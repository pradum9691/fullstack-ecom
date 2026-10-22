import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";
import { AppError } from "../../utils/AppError.js";

const recalcCart = (cart) => {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  cart.itemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  if (!productId) throw new AppError("productId is required", 400);

  const product = await Product.findOne({
    _id: productId,
    status: "APPROVED",
    isActive: true,
  }).select("price retailer stock");

  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < quantity) throw new AppError("Not enough stock", 400);

  const cart = await getOrCreateCart(userId);

  const item = cart.items.find(i => i.product.toString() === productId);

  if (item) {
    const newQty = item.quantity + quantity;
    if (newQty > product.stock) throw new AppError("Stock limit exceeded", 400);
    item.quantity = newQty;
    item.subtotal = newQty * product.price;
  } else {
    cart.items.push({
      product: product._id,
      retailer: product.retailer,
      quantity,
      price: product.price,
      subtotal: product.price * quantity,
    });
  }

  recalcCart(cart);
  await cart.save();

  return Cart.findOne({ user: userId }).populate([
    { path: "items.product", select: "name price images stock" },
    { path: "items.retailer", select: "shopName" },
  ]);
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate([
    { path: "items.product", select: "name price images stock" },
    { path: "items.retailer", select: "shopName" },
  ]);

  if (!cart) return { items: [], totalAmount: 0, itemsCount: 0 };
  return cart;
};

export const updateCartItem = async (userId, productId, { quantity }) => {
  const cart = await getOrCreateCart(userId);

  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) throw new AppError("Item not found", 404);

  const product = await Product.findById(productId).select("stock");
  if (product.stock < quantity) throw new AppError("Not enough stock", 400);

  item.quantity = quantity;
  item.subtotal = quantity * item.price;

  recalcCart(cart);
  await cart.save();

  return getCart(userId);
};

export const removeCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter(i => i.product.toString() !== productId);

  recalcCart(cart);
  await cart.save();

  return getCart(userId);
};

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalAmount: 0, itemsCount: 0 },
    { upsert: true }
  );
};
