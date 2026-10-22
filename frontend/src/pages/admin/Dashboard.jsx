import { useEffect, useState } from "react";
import api from "../../utils/api";
import { motion } from "framer-motion";
import StatCard from "../../components/ui/StatCard";
import {
  Users,
  UserCheck,
  UserX,
  ShoppingBag,
  IndianRupee,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Store,
  RefreshCw,
} from "lucide-react";

const Loader = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="h-12 w-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity size={16} className="text-indigo-400" />
        </div>
      </div>
      <p className="text-xs text-white/30 font-medium tracking-wider">Loading metrics...</p>
    </div>
  </div>
);

const ProgressBar = ({ percent, color }) => (
  <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      className={`h-full rounded-full ${color}`}
    />
  </div>
);

const SectionLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-px flex-1 bg-white/[0.06]" />
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/20">
      <Icon size={11} />
      {label}
    </div>
    <div className="h-px flex-1 bg-white/[0.06]" />
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const res = await api.get("/admin/dashboard");
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard metrics.");
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
      <button onClick={() => { setError(""); fetchStats(); }} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Try again</button>
    </div>
  );

  const activeUserPercent = stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const approvedProductPercent = stats?.totalProducts ? Math.round((stats.approvedProducts / stats.totalProducts) * 100) : 0;

  const financialStats = [
    { label: "Total Revenue", value: `₹${(stats?.totalSales || 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/10" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/10" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, desc: "Awaiting fulfillment", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", gradient: "bg-gradient-to-br from-amber-500/20 to-orange-500/10" },
  ];

  const userStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/10" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10" },
    { label: "Blocked Users", value: stats?.blockedUsers || 0, icon: UserX, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", gradient: "bg-gradient-to-br from-rose-500/20 to-pink-500/10" },
  ];

  const productStats = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", gradient: "bg-gradient-to-br from-sky-500/20 to-blue-500/10" },
    { label: "Pending Approval", value: stats?.pendingProducts || 0, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", gradient: "bg-gradient-to-br from-orange-500/20 to-amber-500/10" },
    { label: "Approved Products", value: stats?.approvedProducts || 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "bg-gradient-to-br from-emerald-500/20 to-green-500/10" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Live</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Command Center</h1>
          <p className="text-xs text-white/30 mt-1 flex items-center gap-1.5">
            <Activity size={11} className="text-indigo-400" />
            Real-time overview of Annesie Whites
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {/* ── Financials ── */}
      <section>
        <SectionLabel icon={TrendingUp} label="Financials & Sales" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {financialStats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </section>

      {/* ── Users ── */}
      <section>
        <SectionLabel icon={Users} label="User Statistics" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userStats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </section>

      {/* ── Products ── */}
      <section>
        <SectionLabel icon={Package} label="Product Catalog" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productStats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </section>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Ratio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative bg-[#111111] border border-white/[0.06] rounded-2xl p-6 overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-1">User Engagement</h3>
          <p className="text-xs text-white/25 mb-6">Active vs Blocked breakdown</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Active — {activeUserPercent}%</span>
              <span className="text-rose-400">Blocked — {100 - activeUserPercent}%</span>
            </div>
            <ProgressBar percent={activeUserPercent} color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Customers", value: stats?.customers || 0, color: "text-blue-400" },
              { label: "Retailers", value: stats?.retailers || 0, color: "text-emerald-400" },
              { label: "Admins", value: stats?.admins || 0, color: "text-purple-400" },
            ].map((item) => (
              <div key={item.label} className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.05]">
                <p className="text-[9px] text-white/25 uppercase font-bold tracking-wider">{item.label}</p>
                <p className={`text-xl font-bold mt-1.5 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Catalog Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative bg-[#111111] border border-white/[0.06] rounded-2xl p-6 overflow-hidden"
        >
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-1">Catalog Health</h3>
          <p className="text-xs text-white/25 mb-6">Product approval status overview</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Approved — {approvedProductPercent}%</span>
              <span className="text-amber-400">Other — {100 - approvedProductPercent}%</span>
            </div>
            <ProgressBar percent={approvedProductPercent} color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
          </div>

          <div className="space-y-2">
            {[
              { label: "Pending Approvals", value: stats?.pendingProducts || 0, dot: "bg-amber-400" },
              { label: "Rejected Products", value: stats?.rejectedProducts || 0, dot: "bg-rose-400" },
              { label: "Approved Products", value: stats?.approvedProducts || 0, dot: "bg-emerald-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                  <span className="text-xs text-white/50 font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Overview Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Retailers", value: stats?.retailers || 0, icon: Store, color: "text-emerald-400" },
          { label: "Total Customers", value: stats?.customers || 0, icon: Users, color: "text-blue-400" },
          { label: "Approved Products", value: stats?.approvedProducts || 0, icon: CheckCircle, color: "text-emerald-400" },
          { label: "Pending Review", value: (stats?.pendingProducts || 0) + (stats?.pendingOrders || 0), icon: Clock, color: "text-amber-400" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
              className="bg-[#111111] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-all duration-200"
            >
              <Icon size={18} className={`${item.color} mb-3`} />
              <p className="text-xl font-bold text-white">{item.value}</p>
              <p className="text-[10px] text-white/30 mt-1 font-medium">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
