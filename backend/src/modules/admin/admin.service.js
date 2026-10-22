import { User } from "../../models/user.model.js";
import { Retailer } from "../retailer/retailer.model.js";
import { AppError } from "../../utils/AppError.js";
import { Product } from "../product/product.model.js";
import { Order } from "../order/order.model.js";


export const fetchDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const blockedUsers = await User.countDocuments({ isActive: false });
  const admins = await User.countDocuments({ role: "ADMIN" });
  const retailers = await User.countDocuments({ role: "RETAILER" });
  const customers = await User.countDocuments({ role: "CUSTOMER" });

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "PENDING_PAYMENT" });
  const completedOrders = await Order.countDocuments({ status: { $in: ["PAID", "SHIPPED", "DELIVERED"] } });

  const salesResult = await Order.aggregate([
    { $match: { status: { $in: ["PAID", "SHIPPED", "DELIVERED"] } } },
    { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
  ]);
  const totalSales = salesResult[0]?.totalSales || 0;

  const totalProducts = await Product.countDocuments();
  const pendingProducts = await Product.countDocuments({ status: "PENDING" });
  const approvedProducts = await Product.countDocuments({ status: "APPROVED" });
  const rejectedProducts = await Product.countDocuments({ status: "REJECTED" });

  return { 
    totalUsers, activeUsers, blockedUsers, 
    admins, retailers, customers,
    totalOrders, pendingOrders, completedOrders, totalSales,
    totalProducts, pendingProducts, approvedProducts, rejectedProducts
  };
};

export const fetchAllUsers = async () => {
  return await User.find().select("-password");
};

export const updateUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.isActive = !user.isActive;
  await user.save();

  return {
    id: user._id,
    email: user.email,
    isActive: user.isActive,
  };
};

export const fetchPendingRetailers = async () => {
  return await Retailer.find({ status: "PENDING" })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
};

export const approveRetailerById = async (retailerId) => {
  const retailer = await Retailer.findById(retailerId);
  if (!retailer) {
    throw new AppError("Retailer not found", 404);
  }

  if (retailer.status === "APPROVED") {
    throw new AppError("Retailer already approved", 400);
  }

  retailer.status = "APPROVED";
  await retailer.save();

  const user = await User.findById(retailer.user);
  if (!user) {
    throw new AppError("User linked to retailer not found", 404);
  }

  user.role = "RETAILER";
  await user.save();

  return {
    retailerId: retailer._id,
    userId: user._id,
    role: user.role,
    status: retailer.status,
  };
};

export const rejectRetailerById = async (retailerId) => {
  const retailer = await Retailer.findById(retailerId);
  if (!retailer) {
    throw new AppError("Retailer not found", 404);
  }

  retailer.status = "REJECTED";
  await retailer.save();

  return {
    retailerId: retailer._id,
    status: retailer.status,
  };
};

export const approveProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.status === "APPROVED") {
    throw new AppError("Product already approved", 400);
  }

  product.status = "APPROVED";
  await product.save();

  return {
    productId: product._id,
    status: product.status,
  };
};

export const rejectProductById = async (productId, reason) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.status === "REJECTED") {
    throw new AppError("Product already rejected", 400);
  }

  product.status = "REJECTED";
  if (reason) {
    product.rejectReason = reason; 
  }
  await product.save();

  return {
    productId: product._id,
    status: product.status,
  };
};

export const fetchAllOrders = async ({ status, search, page = 1, limit = 10 }) => {
  let queryObj = {};
  if (status && status !== "ALL") {
    queryObj.status = status;
  }

  if (search) {
    if (search.match(/^[0-9a-fA-F]{24}$/)) {
      queryObj._id = search;
    } else {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).select("_id");
      const userIds = users.map(u => u._id);
      queryObj.user = { $in: userIds };
    }
  }

  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(queryObj);
  const orders = await Order.find(queryObj)
    .populate("user", "name email")
    .populate("items.product", "name images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const allowedStatuses = [
    "PENDING_PAYMENT",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    updatedBy: "ADMIN",
  });

  if (status === "CANCELLED") {
    order.cancelledAt = new Date();
  }

  await order.save();
  return order;
};