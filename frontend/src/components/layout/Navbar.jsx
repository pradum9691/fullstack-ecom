import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutSuccess } from "../../store/slices/authSlice";
import { useCart } from "../../context/CartContext";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, Shield, Store, ChevronDown, Menu, User, X as XIcon, ShoppingBag } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { clearWishlist } from "../../store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const searchRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    dispatch(logoutSuccess());
    dispatch(clearWishlist());
    clearCart();
    toast.success("Logged out successfully");
    navigate("/login");
    setUserMenuOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
    setShowSearch(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") { setShowSearch(false); setUserMenuOpen(false); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { name: "Shop", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setShowSearch(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-[10px] tracking-[0.2em] font-medium overflow-hidden h-8 flex items-center">
        <div className="marquee">
          {[0, 1, 2].map((i) => (
            <div className="marquee__inner" key={i}>
              <span className="opacity-90">✦ FREE SHIPPING ON ORDERS ABOVE ₹999</span>
              <span className="opacity-60 mx-4">|</span>
              <span className="opacity-90">✦ PREMIUM QUALITY GUARANTEED</span>
              <span className="opacity-60 mx-4">|</span>
              <span className="opacity-90">✦ EASY RETURNS WITHIN 30 DAYS</span>
              <span className="opacity-60 mx-4">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <header className="fixed top-8 left-0 right-0 z-[50] px-4 sm:px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-7xl mx-auto transition-all duration-500 ${
            scrolled
              ? "mt-1"
              : "mt-3"
          }`}
        >
          <div
            className={`
              flex items-center justify-between h-14 px-4 sm:px-6 rounded-2xl
              transition-all duration-500
              ${scrolled
                ? "backdrop-blur-2xl bg-bg-base/80 border border-border shadow-xl shadow-black/5 dark:shadow-black/40"
                : "backdrop-blur-xl bg-bg-base/40 border border-border"
              }
            `}
          >
            {/* Left — Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-xs font-medium tracking-wide rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover"
                  }`}
                >
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute inset-0 bg-bg-card border border-border rounded-xl"
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide rounded-xl text-text-primary hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200"
                >
                  <Shield size={13} />
                  Admin
                </Link>
              )}
              {user?.role === "RETAILER" && (
                <Link
                  to="/retailer/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide rounded-xl text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
                >
                  <Store size={13} />
                  My Store
                </Link>
              )}
            </nav>

            {/* Center — Brand (Responsive placement to prevent mobile overlap) */}
            <Link
              to="/"
              className="flex-1 md:flex-none text-left md:absolute md:left-1/2 md:-translate-x-1/2 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-text-primary"
            >
              <span className="gradient-text">Annesie</span>{" "}
              <span className="text-text-secondary font-light">Whites</span>
            </Link>

            {/* Right — Actions */}
            <div className="flex items-center gap-1">
              {/* Search (text link) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                className="h-8 flex items-center px-2 py-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200"
                aria-label="Search"
              >
                Search
              </motion.button>

              {/* Wishlist (text link) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/wishlist")}
                className="hidden sm:flex relative h-8 w-8 items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200"
                aria-label="Wishlist"
              >
                <Heart size={15} />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-rose-500 text-white"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cart")}
                className="relative h-8 w-8 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200"
                aria-label="Cart"
              >
                <ShoppingBag size={15} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-indigo-500 text-white"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Menu */}
              {user ? (
                <div className="relative hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 h-8 px-3 rounded-xl border border-border hover:border-border-hover text-text-secondary hover:text-text-primary transition-all duration-200 text-xs font-medium"
                  >
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:block max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/60"
                      >
                        <div className="p-3 border-b border-border">
                          <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                          <p className="text-[10px] text-text-muted truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all">
                            <User size={13} /> Profile
                          </Link>
                          <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all">
                            <ShoppingBag size={13} /> My Orders
                          </Link>
                          {user.role === "CUSTOMER" && (
                            <Link to="/apply-retailer" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                              <Store size={13} /> Become a Retailer
                            </Link>
                          )}
                        </div>
                        <div className="p-2 border-t border-border">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <XIcon size={13} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className="hidden md:flex h-8 px-4 items-center text-xs font-semibold rounded-xl bg-text-primary text-bg-base transition-all duration-200 shadow-md"
                >
                  Sign In
                </motion.button>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200 ml-1"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <XIcon size={16} />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-2 backdrop-blur-2xl bg-bg-card/90 border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4">
                  <Search size={16} className="text-text-muted shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent outline-none text-sm text-text-primary placeholder-text-muted font-medium"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} className="text-text-muted hover:text-text-primary transition-colors">
                      <XIcon size={14} />
                    </button>
                  )}
                  <button type="submit" className="px-4 py-1.5 bg-text-primary text-bg-base text-xs font-bold rounded-xl shadow-sm shrink-0">
                    Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mt-2 backdrop-blur-2xl bg-bg-card/95 border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-4 space-y-1">
                  {navLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.path)
                          ? "bg-bg-card-hover text-text-primary border border-border"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover border border-transparent"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all">
                    <div className="flex items-center gap-3">
                      <Heart size={14} /> Wishlist
                    </div>
                    {wishlist.length > 0 && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-500 hover:bg-indigo-500/10 transition-all">
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  {user?.role === "RETAILER" && (
                    <Link to="/retailer/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-500 hover:bg-emerald-500/10 transition-all">
                      <Store size={14} /> My Store
                    </Link>
                  )}
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-border flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{user.name}</p>
                          <p className="text-[10px] text-text-muted">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all">
                        <ShoppingBag size={14} /> My Orders
                      </Link>
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-all">
                        <User size={14} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-500 hover:bg-rose-500/10 transition-all text-left w-full"
                      >
                        <XIcon size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full py-3 bg-text-primary text-bg-base text-sm font-bold rounded-xl shadow-md"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    </>
  );
};

export default Navbar;
