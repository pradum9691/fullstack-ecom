import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Search, Eye, AlertCircle, ShoppingBag, MapPin, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/retailer/orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch retailer orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "badge-emerald";
      case "SHIPPED":
        return "badge-indigo";
      case "PAID":
        return "badge-indigo";
      case "PENDING_PAYMENT":
        return "badge-amber";
      case "CANCELLED":
        return "badge-rose";
      default:
        return "badge-neutral";
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace("_", " ");
  };

  const filteredOrders = orders.filter((order) => {
    const customerMatch = order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          order.user?.email?.toLowerCase().includes(search.toLowerCase());
    const idMatch = order._id?.toLowerCase().includes(search.toLowerCase());
    return customerMatch || idMatch;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading orders...</p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-white p-6">
        <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle size={32} />
        </div>
        <p className="text-lg font-medium text-neutral-200">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white"
    >
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight gradient-text">My Orders</h1>
        <p className="text-sm text-neutral-400 mt-2">View sales, track delivery details, and inspect purchased items.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#111111] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3.5 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition duration-200 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>My Earnings (Subtotal)</th>
                <th>Order Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredOrders.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="text-center py-16 text-neutral-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center text-neutral-500">
                          <ShoppingBag size={20} />
                        </div>
                        <p className="text-sm">No orders found.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                      className="group"
                    >
                      <td className="font-mono text-xs text-neutral-400">#{order._id?.substring(0, 10)}...</td>
                      <td className="text-neutral-300">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <div className="space-y-0.5">
                          <p className="font-medium text-white group-hover:text-indigo-400 transition-colors duration-200">{order.user?.name || "N/A"}</p>
                          <p className="text-xs text-neutral-500">{order.user?.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="font-semibold text-white">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Order Details</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-1">ID: {selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-white/5 hover:bg-white hover:text-black rounded-full text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                
                {/* Address details */}
                <div className="bg-black/40 p-5 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" />
                    <span>Shipping Address</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <p className="font-semibold text-white text-sm">{selectedOrder.address?.name}</p>
                    <p className="flex items-center gap-1.5 text-neutral-400">
                      <Phone size={12} /> 
                      {selectedOrder.address?.phone}
                    </p>
                    <p className="leading-relaxed">
                      {selectedOrder.address?.addressLine}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
                  <div className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
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
                            <p className="text-xs text-neutral-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-white">₹{item.subtotal?.toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                    
                    {/* Totals */}
                    <div className="p-4 bg-black/60 flex items-center justify-between border-t border-white/5">
                      <span className="text-sm font-semibold text-neutral-300">My Store Total</span>
                      <span className="text-lg font-bold text-white">₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">Order Status:</span>
                  <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Orders;
