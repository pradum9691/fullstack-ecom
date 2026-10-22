import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Check, Heart, Shield, RefreshCw, Truck } from "lucide-react";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, buyNow } = useCart();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const handleBuyNow = async () => {
    try {
      await buyNow(product._id, 1);
      navigate("/checkout");
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Product fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Save product to recently viewed list
  useEffect(() => {
    if (!product?._id) return;
    const userKey = user ? `recent_products_${user._id}` : "recent_products_guest";
    let list = JSON.parse(localStorage.getItem(userKey)) || [];
    list = list.filter((x) => x !== product._id);
    list.unshift(product._id);
    localStorage.setItem(userKey, JSON.stringify(list.slice(0, 6)));
  }, [product, user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-6 py-12 text-white"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-8 font-medium">
        <span className="hover:text-white cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={12} />
        <span className="hover:text-white cursor-pointer transition" onClick={() => navigate("/products")}>Shop</span>
        <ChevronRight size={12} />
        <span className="text-indigo-400 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl overflow-hidden border border-white/5 bg-[#111111] aspect-[4/5] relative"
          >
            <img
              src={product.images?.[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
 
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300
                    ${
                      activeImage === i
                        ? "border-indigo-500 scale-102"
                        : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
 
        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 self-start mb-4">
            {product.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            {product.name}
          </h1>

          <div className="text-2xl font-bold text-white mb-6">
            ₹{product.price?.toLocaleString("en-IN")}
          </div>

          <p className="text-sm md:text-base text-neutral-400 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-8">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
            <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-white/5">
            <button
              disabled={product.stock === 0}
              onClick={async () => {
                try {
                  await addToCart(product._id, 1);
                  setAdded(true);
                  toast.success("Added to shopping bag");
                  setTimeout(() => setAdded(false), 2000);
                } catch {
                  navigate("/login");
                }
              }}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 cursor-pointer shadow-lg hover:shadow-white/5"
            >
              {added ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
 
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-bold text-sm rounded-xl transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Buy Now</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-2">
              <Truck size={18} className="text-indigo-400" />
              <span className="text-[10px] font-semibold text-neutral-400">Free Delivery</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-2">
              <RefreshCw size={18} className="text-indigo-400" />
              <span className="text-[10px] font-semibold text-neutral-400">7-Day Return</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              <span className="text-[10px] font-semibold text-neutral-400">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductDetails);
