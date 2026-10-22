import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";


import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import retailerRoutes from "./modules/retailer/retailer.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import adminProductRoutes from "./modules/admin/admin.product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import "./config/redis.js";
import passport from "./config/passport.js";


const app = express();
app.use(passport.initialize());

// Express 5 query getter compatibility patch (allows Passport, mongoSanitize, and other packages to mutate req.query)
app.use((req, res, next) => {
  if (req.query) {
    const originalQuery = req.query;
    Object.defineProperty(req, "query", {
      value: { ...originalQuery },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});



const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") || 
                      /^https:\/\/fullstack-pro-[a-z0-9-]+\.vercel\.app$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ MongoDB Injection Protection — strips $ and . from user inputs
app.use(mongoSanitize());

// 🚦 General Rate Limiting — max 100 requests/min for all /api routes
app.use("/api", generalLimiter);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(globalErrorHandler);

export default app;