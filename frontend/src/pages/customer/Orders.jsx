import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Calendar } from "lucide-react";

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/my?t=${Date.now()}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("LOAD ORDERS ERROR", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const payWithRazorpay = async (order) => {
    if (payingId === order._id) return;
    setPayingId(order._id);
    try {
      const res = await api.post("/payments/razorpay-order", {
        orderId: order._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.order.amount,
        currency: "INR",
        order_id: res.data.order.id,
        name: "Annesie Whites",
        description: "Order Payment",
        handler: async function (response) {
          await api.post("/payments/razorpay-verify", {
            ...response,
            orderId: order._id,
          });
          toast.success("Payment successful");
          await loadOrders();
          navigate(`/order/success?orderId=${order._id}`);
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => navigate("/order/failed"),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("PAYMENT ERROR", err.response?.data || err.message);
      toast.error("Unable to start payment");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] text-white flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">No orders yet</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          You haven't placed any orders yet. Start exploring our collections.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 px-8 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer"
        >
          Start Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 pt-6 pb-12 text-text-primary"
    >
      <div className="mb-10">
        <span className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
          Account Dashboard
        </span>
        <h1 className="text-3xl font-semibold tracking-tight gradient-text">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="group cursor-pointer border border-white/5 rounded-3xl p-6 sm:p-8 bg-[#111111] hover:border-white/10 transition-all duration-300 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-neutral-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Order Placed
                  </p>
                  <p className="text-sm font-semibold mt-0.5 text-neutral-300">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right sm:text-left">
                    Order ID
                  </p>
                  <p className="text-xs font-mono font-medium mt-0.5 text-neutral-400">
                    #{order._id.substring(order._id.length - 8)}
                  </p>
                </div>
                
                {order.status === "PENDING_PAYMENT" ? (
                  <button
                    disabled={payingId === order._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      payWithRazorpay(order);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    <CreditCard size={12} />
                    <span>{payingId === order._id ? "Processing..." : "Pay Now"}</span>
                  </button>
                ) : (
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                )}
              </div>
            </div>

            {/* Items display */}
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt="Product" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200 group-hover:text-indigo-400 transition-colors duration-200">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-300">₹ {item.subtotal?.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Total Amount</span>
              <span className="text-lg font-bold text-white">
                ₹ {order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Orders;
