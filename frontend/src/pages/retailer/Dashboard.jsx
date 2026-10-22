import { useEffect, useState } from "react";
import api from "../../utils/api";
import { motion } from "framer-motion";
import StatCard from "../../components/ui/StatCard";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Hourglass,
  Store,
  TrendingUp,
  XCircle,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const Loader = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="h-12 w-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500"
      />
      <p className="text-xs text-white/30 font-medium tracking-wider">Loading store data...</p>
    </div>
  </div>
);

const tips = [
  "Add high-quality images to increase your conversion rate by up to 40%.",
  "Write detailed product descriptions to reduce return requests significantly.",
  "Check pending items regularly. Contact admin if approval takes over 48 hours.",
  "Keep your inventory updated to avoid customer order failures.",
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const res = await api.get("/retailer/dashboard");
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <Loader />;

  if (error) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertCircle className="text-rose-400" size={24} />
      </div>
      <p className="text-sm font-medium text-white/60">{error}</p>
      <button onClick={() => { setError(""); fetchStats(); }} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Try again</button>
    </div>
  );

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalSales || 0).toLocaleString("en-IN")}`,
      desc: "Gross earnings from all sales",
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10",
    },
    {
      label: "Store Orders",
      value: stats?.totalOrders || 0,
      desc: "Total orders placed",
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10",
    },
    {
      label: "Live Listings",
      value: stats?.approvedProducts || 0,
      desc: "Visible to customers",
      icon: CheckCircle,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/10",
    },
    {
      label: "Pending Review",
      value: stats?.pendingProducts || 0,
      desc: "Awaiting admin approval",
      icon: Hourglass,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      gradient: "bg-gradient-to-br from-amber-500/20 to-orange-500/10",
    },
  ];

  const totalProducts = stats?.totalProducts || 0;
  const approvedPercent = totalProducts ? Math.round((stats.approvedProducts / totalProducts) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* ── Welcome Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0d0d0d] border border-white/[0.07] rounded-2xl p-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
            <Store size={26} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/25 font-medium uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
              {stats?.shopName || "Store Owner"}
            </h1>
            <p className="text-xs text-white/30 mt-1 flex items-center gap-1.5">
              <TrendingUp size={11} className="text-emerald-400" />
              Here is your store performance summary
            </p>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="self-start flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-40 shrink-0"
          >
            <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => <StatCard key={card.label} {...card} index={i} />)}
      </div>

      {/* ── Details Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Catalog Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative bg-[#111] border border-white/[0.06] rounded-2xl p-6 overflow-hidden"
        >
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <Package size={14} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Product Status</h3>
          </div>
          <p className="text-xs text-white/25 mb-5 relative z-10">Your catalog health breakdown</p>

          <div className="space-y-2 relative z-10">
            {/* Progress */}
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-emerald-400">Approved {approvedPercent}%</span>
              <span className="text-white/20">{totalProducts} total</span>
            </div>
            <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden mb-5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${approvedPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>

            {[
              { label: "Approved", value: stats?.approvedProducts || 0, dot: "bg-emerald-400" },
              { label: "Pending Review", value: stats?.pendingProducts || 0, dot: "bg-amber-400" },
              { label: "Rejected", value: stats?.rejectedProducts || 0, dot: "bg-rose-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                  <span className="text-xs text-white/50 font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}

            <div className="flex items-center justify-between px-3 py-2.5 mt-1 border-t border-white/[0.05]">
              <span className="text-xs text-white/25 font-bold uppercase tracking-wider">Total Listings</span>
              <span className="text-sm font-bold text-white">{totalProducts}</span>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative bg-[#111] border border-white/[0.06] rounded-2xl p-6 overflow-hidden flex flex-col"
        >
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/6 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <Lightbulb size={14} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white">Store Tips</h3>
          </div>
          <p className="text-xs text-white/25 mb-5 relative z-10">Improve your store performance</p>

          <ul className="space-y-3 flex-1 relative z-10">
            {tips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 px-3 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05]"
              >
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ${
                  i === 0 ? "bg-emerald-500/20 text-emerald-400" :
                  i === 1 ? "bg-blue-500/20 text-blue-400" :
                  i === 2 ? "bg-amber-500/20 text-amber-400" :
                  "bg-purple-500/20 text-purple-400"
                }`}>
                  {i + 1}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{tip}</p>
              </motion.li>
            ))}
          </ul>

          <p className="text-[9px] text-white/15 font-medium uppercase tracking-widest text-center mt-5 relative z-10 pt-4 border-t border-white/[0.05]">
            Annesie Quality Standard
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
