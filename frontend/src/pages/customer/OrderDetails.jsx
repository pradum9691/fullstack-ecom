import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MapPin, Phone, Calendar, ArrowLeft, Download, RefreshCw } from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "badge-amber";
    case "PAID":
      return "badge-indigo";
    case "SHIPPED":
      return "badge-indigo";
    case "DELIVERED":
      return "badge-emerald";
    case "CANCELLED":
      return "badge-rose";
    default:
      return "badge-neutral";
  }
};

const getStatusLabel = (status) => {
  return status?.replace("_", " ");
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/my/${id}?t=${Date.now()}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error("ORDER LOAD ERROR 👉", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancelling(true);
        await api.post(`/orders/my/${order._id}/cancel`);
        toast.success("Order cancelled successfully & refund initiated 💸");
        // Reload order data
        const res = await api.get(`/orders/my/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Cancellation failed");
      } finally {
        setCancelling(false);
      }
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading order details...</p>
      </div>
    );
  }
 
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6">
        <p className="text-sm text-neutral-400 mb-4">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 py-12 text-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="h-10 w-10 bg-[#111111] border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight gradient-text">
              Order Invoice
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">ID: #{order._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className={`badge ${getStatusBadge(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>
 
      {/* Order Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl shadow-xl">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Placed On</span>
          <p className="text-sm font-semibold mt-1 text-white">
            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl shadow-xl">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Items</span>
          <p className="text-sm font-semibold mt-1 text-white">{order.items?.length || 0} Units</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl shadow-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Paid</span>
          <p className="text-sm font-bold mt-1 text-indigo-400">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Items and details (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          {/* Items card */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-3">Products in Order</h3>
            <div className="divide-y divide-white/5">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt="Product" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white">₹{item.subtotal?.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_URL}/orders/my/${order._id}/invoice?token=${localStorage.getItem("token")}`,
                  "_blank",
                );
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#111111] border border-white/10 rounded-xl text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-md"
            >
              <Download size={14} />
              <span>Download Invoice</span>
            </button>

            {order.status === "PAID" && (
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{cancelling ? "Cancelling..." : "Cancel Order"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Address and Tracking (1/3 width) */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-3 flex items-center gap-1.5">
              <MapPin size={13} className="text-indigo-400" />
              <span>Shipping Address</span>
            </h3>
            <div className="text-xs text-neutral-300 space-y-1.5">
              <p className="font-bold text-white text-sm">{order.address?.name}</p>
              <p>{order.address?.addressLine}</p>
              <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
              <p className="flex items-center gap-1 text-neutral-400 pt-1">
                <Phone size={12} />
                <span>{order.address?.phone}</span>
              </p>
            </div>
          </div>

          {/* Timeline Tracking */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-3">Delivery Timeline</h3>
            <div className="space-y-4">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 mt-1.5" />
                      {idx !== order.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-white/5 my-1" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5 pb-2">
                      <p className="font-semibold text-white uppercase tracking-wider">
                        {getStatusLabel(history.status)}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {new Date(history.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 italic">No tracking info logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;
