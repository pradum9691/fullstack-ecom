import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../store/slices/authSlice";
import { clearWishlist } from "../../store/slices/wishlistSlice";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  PackageCheck,
  ShoppingBag,
  LogOut,
  X,
  ClipboardList,
  Zap,
  ExternalLink,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, accent: "indigo" },
  { name: "Manage Users", path: "/admin/users", icon: Users, accent: "blue" },
  { name: "Verify Retailers", path: "/admin/retailers", icon: ShieldCheck, accent: "emerald" },
  { name: "Verify Products", path: "/admin/products", icon: PackageCheck, accent: "purple" },
  { name: "Manage Orders", path: "/admin/orders", icon: ClipboardList, accent: "amber" },
];

const accentColors = {
  indigo: { active: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30", icon: "text-indigo-400", dot: "bg-indigo-400" },
  blue: { active: "text-blue-400 bg-blue-500/15 border-blue-500/30", icon: "text-blue-400", dot: "bg-blue-400" },
  emerald: { active: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", icon: "text-emerald-400", dot: "bg-emerald-400" },
  purple: { active: "text-purple-400 bg-purple-500/15 border-purple-500/30", icon: "text-purple-400", dot: "bg-purple-400" },
  amber: { active: "text-amber-400 bg-amber-500/15 border-amber-500/30", icon: "text-amber-400", dot: "bg-amber-400" },
};

const Sidebar = ({ close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { clearCart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    dispatch(logoutSuccess());
    dispatch(clearWishlist());
    clearCart();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full flex flex-col bg-[#080808] border-r border-white/[0.06] select-none">
      {/* ── Brand Header ── */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-white">
                Admin Panel
              </p>
              <p className="text-[9px] text-white/25 tracking-wider mt-0.5">
                Annesie Whites
              </p>
            </div>
          </div>
          {close && (
            <button
              onClick={close}
              className="lg:hidden h-7 w-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/20 px-3 py-2 mt-1">
          Management
        </p>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const colors = accentColors[item.accent];

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <Link
                to={item.path}
                onClick={close}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  active
                    ? `${colors.active} border`
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ zIndex: -1 }}
                  />
                )}
                <Icon size={15} className={active ? colors.icon : "group-hover:text-white/60 transition-colors"} />
                <span>{item.name}</span>
                {active && (
                  <span className={`ml-auto h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-200 group"
        >
          <ShoppingBag size={14} className="group-hover:text-white/60 transition-colors" />
          <span>Go to Storefront</span>
          <ExternalLink size={10} className="ml-auto opacity-0 group-hover:opacity-50 transition-all" />
        </Link>

        {/* User Info */}
        <div className="px-3 py-3 mt-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white/80">{user?.name || "Admin"}</p>
              <p className="text-[9px] text-white/25 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
