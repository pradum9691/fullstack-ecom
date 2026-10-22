import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { PlusCircle, Search, AlertCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/retailer/products");
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "badge-emerald";
      case "PENDING":
        return "badge-amber";
      case "REJECTED":
        return "badge-rose";
      default:
        return "badge-neutral";
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400 animate-pulse">Loading product catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-white p-6">
        <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle size={32} />
        </div>
        <p className="text-lg font-medium text-neutral-200">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight gradient-text">My Products</h1>
          <p className="text-sm text-neutral-400 mt-2">Manage your product catalog, pricing, inventory, and track approvals.</p>
        </div>
        <Link
          to="/retailer/products/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#111111] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3.5 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition duration-200 text-white placeholder-neutral-500"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-black rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          {["ALL", "APPROVED", "PENDING", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-white text-black font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table Wrapper */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredProducts.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="text-center py-16 text-neutral-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center text-neutral-500">
                          <ShoppingBag size={20} />
                        </div>
                        <p className="text-sm">No products found matching filters.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredProducts.map((product, idx) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                      className="group cursor-pointer"
                    >
                      {/* Product Image and Name */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 relative">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="Product" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                            )}
                          </div>
                          <div className="space-y-0.5 max-w-[240px]">
                            <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors duration-200 truncate">{product.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{product.description}</p>
                            {product.status === "REJECTED" && product.rejectReason && (
                              <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg inline-block font-medium mt-1">
                                Reason: {product.rejectReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-xs text-neutral-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="font-semibold text-white">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td>
                        <span className={product.stock === 0 ? "text-rose-400 font-medium" : "text-neutral-300"}>
                          {product.stock === 0 ? (
                            <span className="badge badge-rose">Out of Stock</span>
                          ) : (
                            `${product.stock} units`
                          )}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span className={`badge ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
