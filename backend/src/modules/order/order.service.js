import { Order } from "./order.model.js";
import { Cart } from "../cart/cart.model.js";
import { AppError } from "../../utils/AppError.js";

export const getMyOrders = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.product", "name price images")
      .populate("items.retailer", "shopName"),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    orders,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getOrderByIdForUser = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate(
    "items.product items.retailer",
  );

  if (!order) throw new AppError("Order not found", 404);

  return order;
};

export const placeOrderFromCart = async (userId, address) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const items = cart.items.map((i) => {
    if (!i.product.retailer) {
      throw new AppError("Product retailer missing", 400);
    }

    return {
      product: i.product._id,
      retailer: i.product.retailer,
      quantity: i.quantity,
      price: i.product.price,
      subtotal: i.subtotal,
    };
  });

  const order = await Order.create({
    user: userId,
    items,
    totalAmount: cart.totalAmount,
    address,
    status: "PENDING_PAYMENT",

    statusHistory: [
      {
        status: "PENDING_PAYMENT",
        timestamp: new Date(),
        updatedBy: "SYSTEM",
      },
    ],
  });
  cart.items = [];
  cart.totalAmount = 0;
  cart.itemsCount = 0;
  await cart.save();
  return order;
};
