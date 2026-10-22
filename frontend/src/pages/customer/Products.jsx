import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { fetchWishlist, toggleWishlist } from "../../store/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Search, SlidersHorizontal, ShoppingBag, Zap, X, Clock, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Men", "Women", "Unisex"];

const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="rounded-2xl overflow-hidden bg-bg-card border border-border"
  >
    <div className="h-48 sm:h-64 bg-text-muted/10 animate-pulse" />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-3 w-3/4 bg-text-muted/20 animate-pulse rounded-lg" />
      <div className="h-3 w-1/3 bg-text-muted/20 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        <div className="h-9 bg-text-muted/20 animate-pulse rounded-xl" />
        <div className="h-9 bg-text-muted/20 animate-pulse rounded-xl" />
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ p, isWishlisted, wishlistLoading, onWishlist, onNavigate, onAddToCart, onBuyNow, index }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(p._id, 1);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuy = async (e) => {
    e.stopPropagation();
    setBuying(true);
    await onBuyNow(p._id, 1);
    setBuying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-hover transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 group-hover:-translate-y-1 flex flex-col h-full">
        {/* Image */}
        <div
          className="relative h-48 sm:h-64 overflow-hidden cursor-pointer bg-bg-card-hover shrink-0"
          onClick={() => onNavigate(p._id)}
        >
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted/50">
              <Package size={32} className="mb-2" />
              <span className="text-xs">No Image</span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-bg-card/80 backdrop-blur-md text-text-primary border border-border">
            {p.category}
          </span>

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={wishlistLoading}
            onClick={(e) => {
              e.stopPropagation();
              onWishlist(p._id);
            }}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-xl backdrop-blur-md border transition-all duration-200 ${
              isWishlisted
                ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-sm"
                : "bg-bg-card/60 border-border text-text-muted hover:text-rose-500 hover:border-rose-500/30"
            } ${wishlistLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Heart size={14} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3
            className="text-xs sm:text-sm font-medium text-text-primary truncate cursor-pointer hover:text-indigo-500 transition-colors"
            onClick={() => onNavigate(p._id)}
          >
            {p.name}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1 sm:mt-2 gap-1 sm:gap-0">
            <p className="text-sm sm:text-base font-bold text-text-primary">₹{p.price?.toLocaleString("en-IN")}</p>
            {p.stock < 5 && p.stock > 0 && (
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 w-fit">Only {p.stock} left</span>
            )}
            {p.stock === 0 && (
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit">Out of stock</span>
            )}
          </div>

          <div className="mt-auto pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={adding || p.stock === 0}
              className="flex items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-semibold rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-bg-card-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <ShoppingBag size={12} />
              <span className="truncate">{adding ? "Added" : "Cart"}</span>
            </button>
            <button
              onClick={handleBuy}
              disabled={buying || p.stock === 0}
              className="flex items-center justify-center gap-1.5 py-2 text-[10px] sm:text-xs font-bold rounded-xl bg-text-primary text-bg-base hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <Zap size={12} />
              <span className="truncate">{buying ? "..." : "Buy"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const user = useSelector((state) => state.auth.user);

  const isWishlisted = (id) =>
    wishlist.some((item) =>
      item?._id?.toString() === id || item?.toString?.() === id
    );

  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  const category = params.get("category") || "All";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products", {
          params: {
            category: category !== "All" ? category : undefined,
            search: search || undefined,
            sort: sort || undefined,
          },
        });
        setProducts(res.data.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort]);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user, dispatch]);

  const userKey = user ? `recent_products_${user._id}` : "recent_products_guest";

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(userKey)) || [];
    if (!ids.length) { setRecentProducts([]); return; }
    api.get("/products", { params: { ids: ids.join(",") } })
      .then((res) => setRecentProducts(res.data.data || []))
      .catch(() => {});
  }, [userKey]);

  const saveRecent = (id) => {
    let list = JSON.parse(localStorage.getItem(userKey)) || [];
    list = list.filter((x) => x !== id);
    list.unshift(id);
    localStorage.setItem(userKey, JSON.stringify(list.slice(0, 6)));
  };

  const handleNavigate = (id) => {
    saveRecent(id);
    navigate(`/product/${id}`);
  };

  const updateParam = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };

  return (
    <div className="w-full min-h-screen bg-bg-base text-text-primary">
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-border py-12 sm:py-16 bg-bg-card/30">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase text-text-muted mb-2 sm:mb-3">Collection</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-text-primary tracking-tight">Shop All</h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-text-secondary font-light">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 sticky top-[80px] sm:top-[100px] z-40 bg-bg-base/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => updateParam("category", c === "All" ? "" : c)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-xl border transition-all duration-200 shrink-0 shadow-sm ${
                  category === c
                    ? "bg-text-primary text-bg-base border-text-primary"
                    : "bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-bg-card-hover"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => updateParam("search", e.target.value)}
                className="w-full sm:w-56 pl-9 pr-8 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium rounded-xl border border-border bg-bg-card text-text-primary placeholder-text-muted outline-none focus:border-indigo-500/50 transition-colors shadow-sm"
              />
              {search && (
               <button
                  onClick={() => updateParam("search", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <SlidersHorizontal size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="pl-8 pr-3 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium rounded-xl border border-border bg-bg-card text-text-primary outline-none focus:border-indigo-500/50 transition-colors appearance-none shadow-sm cursor-pointer"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 sm:py-32 flex flex-col items-center gap-4"
          >
            <div className="h-16 w-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center shadow-sm">
              <Package size={24} className="text-text-muted" />
            </div>
            <p className="text-text-secondary text-sm font-medium">No products found</p>
            <button
              onClick={() => { updateParam("search", ""); updateParam("category", ""); }}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard
                key={p._id}
                p={p}
                index={i}
                isWishlisted={isWishlisted(p._id)}
                wishlistLoading={wishlistLoading}
                onWishlist={(id) => {
                  if (!user) return navigate("/login");
                  dispatch(toggleWishlist(id));
                }}
                onNavigate={handleNavigate}
                onAddToCart={addToCart}
                onBuyNow={async (id, qty) => {
                  try {
                    await buyNow(id, qty);
                    navigate("/checkout");
                  } catch {
                    navigate("/login");
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 sm:mt-24 pt-10 border-t border-border"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock size={14} className="text-text-muted" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-text-secondary">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {recentProducts.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleNavigate(p._id)}
                  className="cursor-pointer group bg-bg-card border border-border rounded-xl overflow-hidden hover:border-border-hover shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-32 sm:h-40 shrink-0 bg-bg-card-hover overflow-hidden relative">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted/50"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <p className="text-[10px] sm:text-xs font-medium text-text-secondary truncate group-hover:text-text-primary transition-colors">{p.name}</p>
                    <p className="text-xs sm:text-sm font-bold text-text-primary mt-1">₹{p.price?.toLocaleString("en-IN")}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
