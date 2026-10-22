import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cart, loading, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
 
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading your cart...</p>
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
        <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Add some timeless essentials to your cart and they will appear here.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 px-8 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer"
        >
          Browse Products
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 py-12 text-white"
    >
      <h1 className="text-3xl font-semibold tracking-tight mb-10 gradient-text">
        Shopping Bag
      </h1>
 
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cart.items.map((item) => (
            <motion.div
              key={item.product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 sm:gap-6 border border-white/5 rounded-2xl p-5 bg-[#111111] hover:border-white/10 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden border border-white/5 bg-black flex-shrink-0">
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
 
              {/* Product Info & Controls */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold leading-snug text-white hover:text-indigo-400 transition cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    ₹ {item.product.price?.toLocaleString("en-IN")}
                  </p>
                </div>
 
                <div className="flex items-center gap-4 mt-4">
                  {/* Quantity controls */}
                  <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQty(item.product._id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="text-xs font-semibold w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.product._id, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-xl text-neutral-400 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Trash2 size={13} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
 
              {/* Subtotal */}
              <div className="text-base font-bold sm:self-center text-right sm:text-left whitespace-nowrap text-white">
                ₹ {item.subtotal?.toLocaleString("en-IN")}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
 
      {/* Checkout Row */}
      <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 border-t border-white/5 pt-8">
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wider">Estimated Total</p>
          <p className="text-2xl font-bold text-white mt-1">
            ₹ {cart.totalAmount?.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>Proceed to checkout</span>
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default Cart;