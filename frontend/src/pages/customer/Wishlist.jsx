import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  toggleWishlist,
} from "../../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user, dispatch]);

  if (loading && items.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading wishlist...</p>
      </div>
    );

  if (!items.length)
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] text-white flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 mb-6 animate-pulse">
          <Heart size={28} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Your wishlist is empty</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Save your favorite products to check them out later.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 px-8 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer"
        >
          Explore Products
        </button>
      </motion.div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-6 py-12 text-white"
    >
      <div className="mb-10 text-center sm:text-left">
        <span className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
          Faves
        </span>
        <h1 className="text-3xl font-semibold tracking-tight gradient-text">Your Wishlist</h1>
        <p className="mt-2 text-sm text-neutral-400">Products you've saved for later.</p>
      </div>
 
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.div
              key={p._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl overflow-hidden border border-white/5 bg-[#111111] hover:border-white/10 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <img
                  src={p.images?.[0]}
                  onClick={() => navigate(`/product/${p._id}`)}
                  alt={p.name}
                  className="h-full w-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  onClick={() => dispatch(toggleWishlist(p._id))}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/20 transition cursor-pointer text-rose-500"
                >
                  <Heart size={16} className="fill-rose-500" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="text-sm font-semibold text-neutral-200 truncate group-hover:text-indigo-400 transition cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                  {p.name}
                </h3>
                <p className="text-sm font-bold text-white">₹ {p.price?.toLocaleString("en-IN")}</p>

                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="mt-4 w-full py-2.5 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                >
                  View Product
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Wishlist;
