import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import SuspenseLoader from "../components/layout/SuspenseLoader";

// Guards & Layouts
const RetailerRoute = lazy(() => import("./RetailerRoute"));
const RetailerLayout = lazy(() => import("../layouts/RetailerLayout"));

// Lazy Loaded Pages
const Home = lazy(() => import("../pages/customer/Home"));
const Products = lazy(() => import("../pages/customer/Products"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const Orders = lazy(() => import("../pages/customer/Orders"));
const Contact = lazy(() => import("../pages/customer/Contact"));
const Profile = lazy(() => import("../pages/customer/Profile"));
const OrderStatus = lazy(() => import("../pages/customer/OrderStatus"));
const Addresses = lazy(() => import("../pages/customer/Addresses"));
const OrderDetails = lazy(() => import("../pages/customer/OrderDetails"));
const ProductDetails = lazy(() => import("../pages/customer/ProductDetails"));
const Wishlist = lazy(() => import("../pages/customer/Wishlist"));
const GoogleSuccess = lazy(() => import("../pages/customer/GoogleSuccess"));
const ApplyRetailer = lazy(() => import("../pages/customer/ApplyRetailer"));
const NotFound = lazy(() => import("../pages/customer/NotFound"));

// Auth Pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminRetailers = lazy(() => import("../pages/admin/Retailers"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));

// Retailer Pages
const RetailerDashboard = lazy(() => import("../pages/retailer/Dashboard"));
const RetailerProducts = lazy(() => import("../pages/retailer/Products"));
const RetailerAddProduct = lazy(() => import("../pages/retailer/AddProduct"));
const RetailerOrders = lazy(() => import("../pages/retailer/Orders"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order/:status" element={<OrderStatus />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/apply-retailer" element={<ApplyRetailer />} />
          </Route>
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Retailer Protected Routes */}
        <Route element={<RetailerRoute />}>
          <Route element={<RetailerLayout />}>
            <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
            <Route path="/retailer/products" element={<RetailerProducts />} />
            <Route path="/retailer/products/add" element={<RetailerAddProduct />} />
            <Route path="/retailer/orders" element={<RetailerOrders />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/retailers" element={<AdminRetailers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
