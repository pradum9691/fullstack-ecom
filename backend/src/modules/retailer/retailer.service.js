import { Retailer } from "./retailer.model.js";
import { User } from "../../models/user.model.js";
import { Product } from "../product/product.model.js";
import { Order } from "../order/order.model.js";

export const applyForRetailer = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "CUSTOMER") {
    throw new Error("Only active customers can apply as retailer");
  }
  const existing = await Retailer.findOne({ user: userId });
  if (existing) {
    throw new Error("Retailer request already submitted");
  }
  const gstExists = await Retailer.findOne({ gstNumber: data.gstNumber });
  if (gstExists) {
    throw new Error("GST number already registered");
  }
  const retailer = await Retailer.create({
    user: userId,
    ...data,
  });

  return retailer;
};

export const fetchRetailerProducts = async (userId) => {
  const retailer = await Retailer.findOne({ user: userId });
  if (!retailer) {
    throw new Error("Retailer account not found");
  }

  return await Product.find({ retailer: retailer._id }).sort({ createdAt: -1 });
};

export const fetchRetailerDashboardStats = async (userId) => {
  const retailer = await Retailer.findOne({ user: userId });
  if (!retailer) {
    throw new Error("Retailer account not found");
  }

  const totalProducts = await Product.countDocuments({ retailer: retailer._id });
  const pendingProducts = await Product.countDocuments({ retailer: retailer._id, status: "PENDING" });
  const approvedProducts = await Product.countDocuments({ retailer: retailer._id, status: "APPROVED" });
  const rejectedProducts = await Product.countDocuments({ retailer: retailer._id, status: "REJECTED" });

  // Sales count where order is paid/shipped/delivered
  const salesResult = await Order.aggregate([
    { $match: { "items.retailer": retailer._id, status: { $in: ["PAID", "SHIPPED", "DELIVERED"] } } },
    { $unwind: "$items" },
    { $match: { "items.retailer": retailer._id } },
    { $group: { _id: null, totalSales: { $sum: "$items.subtotal" } } }
  ]);
  const totalSales = salesResult[0]?.totalSales || 0;

  // Number of unique orders containing retailer's products
  const totalOrders = await Order.countDocuments({
    "items.retailer": retailer._id,
    status: { $in: ["PAID", "SHIPPED", "DELIVERED"] }
  });

  return {
    totalProducts,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    totalSales,
    totalOrders,
    shopName: retailer.shopName
  };
};

export const fetchRetailerOrders = async (userId) => {
  const retailer = await Retailer.findOne({ user: userId });
  if (!retailer) {
    throw new Error("Retailer account not found");
  }

  // Fetch orders where items.retailer matches the retailer's ID
  const orders = await Order.find({ "items.retailer": retailer._id })
    .populate("user", "name email")
    .populate("items.product", "name images")
    .sort({ createdAt: -1 });

  // For each order, filter items to only include this retailer's items and calculate the retailer's total
  return orders.map(order => {
    const retailerItems = order.items.filter(item => item.retailer.toString() === retailer._id.toString());
    const retailerTotal = retailerItems.reduce((acc, item) => acc + item.subtotal, 0);
    return {
      _id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      user: order.user,
      address: order.address,
      items: retailerItems,
      totalAmount: retailerTotal // Retailer specific total of the order
    };
  });
};
