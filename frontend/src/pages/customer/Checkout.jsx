import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { Minus, Plus, Trash2, MapPin, Phone, CreditCard, Loader2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
  const { cart, loading, updateQty, removeFromCart, refreshCart } = useCart();

  const [placing, setPlacing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();

  const handleQtyChange = useCallback(
    async (productId, qty) => {
      if (qty < 1 || updatingId === productId) return;
      setUpdatingId(productId);
      await updateQty(productId, qty);
      setUpdatingId(null);
    },
    [updateQty, updatingId],
  );

  const handleRemove = useCallback(
    async (productId) => {
      if (updatingId === productId) return;
      setUpdatingId(productId);
      await removeFromCart(productId);
      setUpdatingId(null);
    },
    [removeFromCart, updatingId],
  );

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get("/addresses");
        const list = res.data?.data || [];
        setAddresses(list);

        const def = list.find((a) => a.isDefault);
        setSelectedAddress(def || list[0] || null);
      } catch (err) {
        console.error(
          "ADDRESS LOAD ERROR",
          err.response?.data || err.message,
        );
        setAddresses([]);
      }
    };

    loadAddresses();
  }, []);

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    try {
      setPlacing(true);

      const res = await api.post("/orders", {
        address: selectedAddress,
      });

      const orderId = res.data.data._id;
      await refreshCart();
      toast.success("Order placed successfully!");
      navigate(`/order/success?orderId=${orderId}`);
    } catch (err) {
      toast.error("Failed to place order");
      console.error("ORDER ERROR", err.response?.data || err.message);
      navigate("/order/failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] text-white flex flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-neutral-500 mt-2">Add items to your cart before checking out.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-8 px-8 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-300 shadow-lg cursor-pointer"
        >
          Continue Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-6 py-12 text-white"
    >
      <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Left Column: Items (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight gradient-text mb-2">Checkout</h1>
          <p className="text-sm text-neutral-400 mb-6">Review your shopping bag and proceed to order placement.</p>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 sm:gap-6 items-center border border-white/5 bg-[#111111] rounded-2xl p-5 shadow-xl hover:border-white/10 transition duration-300"
                >
                  <img
                    src={item.product.images?.[0]}
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl object-cover bg-black flex-shrink-0"
                    alt={item.product.name}
                  />

                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[200px] sm:max-w-[320px]">{item.product.name}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400">₹ {item.product.price?.toLocaleString("en-IN")}</p>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        disabled={updatingId === item.product._id}
                        onClick={() =>
                          handleQtyChange(item.product._id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition disabled:opacity-40 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>

                      <button
                        disabled={updatingId === item.product._id}
                        onClick={() =>
                          handleQtyChange(item.product._id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition disabled:opacity-40 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-28 sm:h-32 py-1">
                    <button
                      disabled={updatingId === item.product._id}
                      onClick={() => handleRemove(item.product._id)}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-xl text-neutral-400 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="text-sm sm:text-base font-bold text-white">
                      ₹ {item.subtotal?.toLocaleString("en-IN")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
 
        {/* Right Column: Address and Order Summary (1/3 width) */}
        <div className="space-y-6">
          {/* Address Selection */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-indigo-400" />
                <span>Shipping Address</span>
              </h2>
              <button
                onClick={() => navigate("/addresses")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Manage
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-500 space-y-3">
                <p className="italic">No saved addresses found.</p>
                <button
                  onClick={() => navigate("/addresses")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-xl text-[10px] font-bold tracking-wider uppercase transition cursor-pointer"
                >
                  <PlusCircle size={12} />
                  <span>Add Address</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
                {addresses.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => setSelectedAddress(a)}
                    className={`flex gap-3 items-start border p-4 rounded-xl cursor-pointer transition-all duration-300
                      ${
                        selectedAddress?._id === a._id
                          ? "border-indigo-500 bg-indigo-500/[0.03]"
                          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === a._id}
                      onChange={() => setSelectedAddress(a)}
                      className="mt-1 accent-indigo-500 cursor-pointer"
                    />

                    <div className="text-xs text-neutral-300 space-y-1">
                      <p className="font-bold text-white text-sm">{a.name}</p>
                      <p>{a.addressLine}</p>
                      <p>{a.city}, {a.state} - {a.pincode}</p>
                      <p className="flex items-center gap-1.5 text-neutral-500 pt-0.5">
                        <Phone size={10} />
                        <span>{a.phone}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          {/* Order Summary */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-3">Order Summary</h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total Items</span>
                <span>{cart.itemsCount} Units</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>₹ {cart.totalAmount?.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Delivery</span>
                <span>Free Delivery</span>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span>₹ {cart.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing || !selectedAddress}
              className="w-full py-3.5 bg-white text-black font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-neutral-200 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
