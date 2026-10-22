import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Search, UserCheck, UserX, AlertCircle, Users as UsersIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const roleBadge = {
  ADMIN:    "badge badge-indigo",
  RETAILER: "badge badge-amber",
  CUSTOMER: "badge badge-neutral",
};

const Users = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    api.get("/admin/users")
      .then(res => { if (res.data.success) setUsers(res.data.data); })
      .catch(err => setError(err.response?.data?.message || "Failed to fetch users."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.data.isActive } : u));
        toast.success(res.data.message || "User status updated");
      }
    } catch { toast.error("Failed to update user status"); }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchQ && (roleFilter === "ALL" || u.role === roleFilter);
  });

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
    </div>
  );

  if (error) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <AlertCircle className="text-rose-400" size={32} />
      <p className="text-sm text-white/50">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Users</h1>
          <p className="text-xs text-white/30 mt-1">Manage customer, retailer, and administrator accounts.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl">
          <UsersIcon size={13} className="text-indigo-400" />
          <span className="text-xs font-semibold text-white/60">
            {filtered.length} / {users.length} users
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-[#111] border border-white/[0.06] p-3 rounded-2xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/[0.07] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
              <X size={11} />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {["ALL", "CUSTOMER", "RETAILER", "ADMIN"].map(role => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all duration-200 ${
                roleFilter === role
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/35 border-white/[0.08] hover:text-white/70 hover:border-white/20"
              }`}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-white/20 text-sm">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border border-white/[0.1] flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-white/80 text-sm">{user.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="text-white/40 text-xs">{user.email}</td>
                      <td>
                        <span className={roleBadge[user.role] || "badge badge-neutral"}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? "badge-emerald" : "badge-rose"}`}>
                          <span className={`h-1 w-1 rounded-full ${user.isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                          {user.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all duration-200 ${
                            user.isActive
                              ? "border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500"
                              : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                          }`}
                        >
                          {user.isActive ? <><UserX size={11}/> Block</> : <><UserCheck size={11}/> Unblock</>}
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
    </div>
  );
};

export default Users;
