import {
  fetchDashboardStats,
  fetchAllUsers,
  updateUserStatus,
  fetchPendingRetailers,
  approveRetailerById,
  rejectRetailerById,
  approveProductById,
  rejectProductById,
  fetchAllOrders,
  updateAdminOrderStatus,
} from "./admin.service.js";
import redis from "../../config/redis.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getDashboardStats = async (req, res) => {
  const stats = await fetchDashboardStats();
  res.json({ success: true, data: stats });
};

export const getAllUsers = async (req, res) => {
  const users = await fetchAllUsers();
  res.json({ success: true, data: users });
};

export const toggleUserStatus = async (req, res) => {
  const user = await updateUserStatus(req.params.id);
  res.json({
    success: true,
    message: "User status updated",
    data: user,
  });
};

export const getPendingRetailers = async (req, res) => {
  const retailers = await fetchPendingRetailers();
  res.json({ success: true, data: retailers });
};

export const approveRetailer = async (req, res) => {
  const result = await approveRetailerById(req.params.id);
  res.json({
    success: true,
    message: "Retailer approved successfully",
    data: result,
  });
};

export const rejectRetailer = async (req, res) => {
  const result = await rejectRetailerById(req.params.id);
  res.json({
    success: true,
    message: "Retailer rejected",
    data: result,
  });
};

export const approveProduct = async (req, res) => {
  const result = await approveProductById(req.params.id);

  try {
    await redis.del(`product:${req.params.id}`);
    const keys = await redis.keys("products:*");
    if (keys.length) await redis.del(keys);
  } catch (error) {
    console.error("Redis product approval cache invalidation failed:", error.message);
  }

  res.json({
    success: true,
    message: "Product approved successfully",
    data: result,
  });
};

export const rejectProduct = async (req, res) => {
  const { reason } = req.body; // optional
  const result = await rejectProductById(req.params.id, reason);

  try {
    await redis.del(`product:${req.params.id}`);
    const keys = await redis.keys("products:*");
    if (keys.length) await redis.del(keys);
  } catch (error) {
    console.error("Redis product rejection cache invalidation failed:", error.message);
  }

  res.json({
    success: true,
    message: "Product rejected successfully",
    data: result,
  });
};

export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, page, limit } = req.query;
  const result = await fetchAllOrders({
    status,
    search,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  res.json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});

export const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await updateAdminOrderStatus(req.params.id, status);

  res.json({
    success: true,
    message: "Order status updated successfully by Admin",
    data: order,
  });
});

