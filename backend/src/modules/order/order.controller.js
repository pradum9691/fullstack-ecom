import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  placeOrderFromCart,
  getMyOrders,
  getOrderByIdForUser,
} from "./order.service.js";
import { Order } from "./order.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";

 

export const placeOrder = asyncHandler(async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({
      success: false,
      message: "Delivery address is required",
    });
  }

  const order = await placeOrderFromCart(req.user._id, address);

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});


export const getMyOrdersController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getMyOrders(req.user._id, {
    page,
    limit,
  });

  res.json({
    success: true,
    orders: result.orders,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    },
  });
});


export const getMySingleOrder = asyncHandler(async (req, res) => {
  const order = await getOrderByIdForUser(req.user._id, req.params.id);

  res.json({
    success: true,
    data: order,
  });
});



export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "PENDING_PAYMENT",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      status,
      $push: {
        statusHistory: {
          status,
          timestamp: new Date(),
          updatedBy: "USER",
        },
      },
      ...(status === "CANCELLED" && { cancelledAt: new Date() }),
    },
    { new: true },
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});

export const downloadInvoice = async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const order = await Order.findOne({
      _id: req.params.id,
      user: user._id,
    }).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="invoice-${order._id}.pdf"`
    );

    doc.pipe(res);

    const fontPath = path.join(process.cwd(), "fonts", "DejaVuSans.ttf");
    if (fs.existsSync(fontPath)) doc.font(fontPath);

    const rupee = (n) => Number(n).toLocaleString("en-IN");

    doc.fontSize(26).text("MERN SHOP", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).text("Premium Ecommerce Invoice", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(11);
    doc.text(`Invoice ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    doc.fontSize(14).text("Bill To");
    doc.moveDown(0.3);

    doc.fontSize(11);
    doc.text(order.address?.name || "");
    doc.text(order.address?.phone || "");
    doc.text(
      `${order.address?.addressLine}, ${order.address?.city}, ${order.address?.state}`
    );

    doc.moveDown(1.5);

    const startY = doc.y;

    const col = {
      product: 50,
      qty: 320,
      price: 380,
      total: 460,
    };

    doc.fontSize(12);
    doc.text("Product", col.product, startY);
    doc.text("Qty", col.qty, startY);
    doc.text("Price", col.price, startY, { width: 70, align: "right" });
    doc.text("Total", col.total, startY, { width: 80, align: "right" });

    doc.moveTo(50, startY + 18).lineTo(550, startY + 18).stroke();

    let y = startY + 30;


    doc.fontSize(11);

    order.items.forEach((item) => {
      const name = item.product?.name || "Product";

      doc.text(name, col.product, y, { width: 240 });
      doc.text(item.quantity, col.qty, y);
      doc.text(rupee(item.price), col.price, y, { width: 70, align: "right" });
      doc.text(rupee(item.subtotal), col.total, y, {
        width: 80,
        align: "right",
      });

      const h = doc.heightOfString(name, { width: 240 });
      y += Math.max(28, h + 10);
    });

    y += 15;

    doc.moveTo(350, y).lineTo(550, y).stroke();
    y += 12;

    doc.fontSize(14);
    doc.text("Grand Total", 350, y);
    doc.text(rupee(order.totalAmount), col.total, y, {
      width: 80,
      align: "right",
    });

    doc.moveDown(4);


    doc.fontSize(11).text("Thank you for shopping with MERN SHOP ❤️", {
      align: "center",
    });

    doc.moveDown(0.5);

    doc.fontSize(9).text("System generated invoice. No signature required.", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error("INVOICE ERROR ", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Invoice generation failed" });
    }
  }
};