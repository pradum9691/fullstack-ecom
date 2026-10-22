import { 
  applyForRetailer,
  fetchRetailerProducts,
  fetchRetailerDashboardStats,
  fetchRetailerOrders,
} from "./retailer.service.js";
import { applyRetailerSchema } from "./retailer.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const applyRetailer = async (req, res) => {
  try {
    const { error, value } = applyRetailerSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const retailer = await applyForRetailer(req.user._id, value);
    res.status(201).json({
      success: true,
      message: "Retailer request submitted, pending admin approval",
      data: retailer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRetailerProducts = asyncHandler(async (req, res) => {
  const products = await fetchRetailerProducts(req.user._id);
  res.json({
    success: true,
    data: products,
  });
});

export const getRetailerStats = asyncHandler(async (req, res) => {
  const stats = await fetchRetailerDashboardStats(req.user._id);
  res.json({
    success: true,
    data: stats,
  });
});

export const getRetailerOrders = asyncHandler(async (req, res) => {
  const orders = await fetchRetailerOrders(req.user._id);
  res.json({
    success: true,
    data: orders,
  });
});
