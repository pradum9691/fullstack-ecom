import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Search, CheckCircle2, XCircle, AlertCircle, Eye, CornerDownRight } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  
  // Rejection modal state
  const [rejectingProductId, setRejectingProductId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // We pass the status query parameter to fetch filtered list
      const statusParam = statusFilter === "ALL" ? undefined : statusFilter;
      const res = await api.get("/admin/products", {
        params: { status: statusParam }
      });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      const res = await api.patch(`/admin/products/${id}/approve`);
      if (res.data.success) {
        toast.success("Product approved successfully");
        if (statusFilter !== "ALL") {
          setProducts((prev) => prev.filter((p) => p._id !== id));
        } else {
          fetchProducts();
        }
      }
    } catch {
      toast.error("Failed to approve product");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      return toast.warning("Please provide a rejection reason");
    }

    try {
      const res = await api.patch(`/admin/products/${rejectingProductId}/reject`, {
        reason: rejectReason
      });
      if (res.data.success) {
        toast.success("Product rejected");
        setRejectingProductId(null);
        setRejectReason("");
        if (statusFilter !== "ALL") {
          setProducts((prev) => prev.filter((p) => p._id !== rejectingProductId));
        } else {
          fetchProducts();
        }
      }
    } catch {
      toast.error("Failed to reject product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.retailer?.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-wide">Verify Products</h1>
        <p className="text-sm text-neutral-400 mt-2">Approve or reject products uploaded by retailers before they go live.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-neutral-900 border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, category, or shop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-white transition duration-200 text-white placeholder-neutral-500"
          />
        </div>

        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition duration-200 cursor-pointer ${
                statusFilter === status
                  ? "bg-white text-black border-white"
                  : "bg-black text-neutral-400 border-white/10 hover:text-white"
              }`}
            >
              {status === "PENDING" ? "Pending Approval" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Products list */}
      {filteredProducts.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-12 text-center text-neutral-500">
          <p className="text-lg font-semibold text-white mb-1">No products found</p>
          <p className="text-sm">There are no products in this category at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div 
              key={p._id} 
              className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image and Status Badge */}
                <div className="relative h-48 bg-neutral-950">
                  {p.images && p.images[0] ? (
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      No Image Available
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    p.status === "APPROVED"
                      ? "bg-emerald-500 text-white"
                      : p.status === "REJECTED"
                      ? "bg-rose-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-semibold truncate text-white mt-1">{p.name}</h3>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Price</p>
                      <p className="font-semibold text-neutral-200">₹ {p.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-500 text-xs">Stock</p>
                      <p className={`font-semibold ${p.stock < 5 ? "text-rose-400" : "text-neutral-200"}`}>
                        {p.stock} units
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-xs space-y-1">
                    <p className="text-neutral-500">Retailer Shop</p>
                    <p className="font-medium text-white flex items-center gap-1">
                      <CornerDownRight size={12} className="text-neutral-600" />
                      {p.retailer?.shopName || "Unknown Shop"}
                    </p>
                    <p className="text-[10px] text-neutral-400 ml-4">
                      Owner: {p.retailer?.user?.name || "N/A"}
                    </p>
                  </div>

                  {/* Rejection Reason display */}
                  {p.status === "REJECTED" && p.rejectReason && (
                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-xs text-rose-400 space-y-1">
                      <p className="font-bold uppercase tracking-wider text-[9px]">Rejection Reason:</p>
                      <p className="italic">"{p.rejectReason}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-3 border-t border-white/5 mt-4 pt-4">
                {p.status !== "REJECTED" && (
                  <button
                    onClick={() => setRejectingProductId(p._id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                )}
                {p.status !== "APPROVED" && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition duration-200 cursor-pointer ${
                      p.status === "REJECTED" ? "col-span-2" : ""
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Specify Rejection Reason</h3>
              <button 
                onClick={() => {
                  setRejectingProductId(null);
                  setRejectReason("");
                }} 
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 uppercase font-semibold">Reason</label>
                <textarea
                  required
                  placeholder="Explain why this product is being rejected (e.g. Blurry images, prohibited item, incorrect details)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white transition duration-200 placeholder-neutral-600"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingProductId(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition"
                >
                  Reject Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
