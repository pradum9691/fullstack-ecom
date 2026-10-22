import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { ShieldAlert, CheckCircle, XCircle, Store, MapPin, CreditCard } from "lucide-react";

const Retailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingRetailers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/retailers");
        if (res.data.success) {
          setRetailers(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch pending retailers.");
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRetailers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.patch(`/admin/retailers/${id}/approve`);
      if (res.data.success) {
        setRetailers((prev) => prev.filter((r) => r._id !== id));
        toast.success(res.data.message || "Retailer approved successfully");
      }
    } catch {
      toast.error("Failed to approve retailer");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.patch(`/admin/retailers/${id}/reject`);
      if (res.data.success) {
        setRetailers((prev) => prev.filter((r) => r._id !== id));
        toast.success(res.data.message || "Retailer rejected");
      }
    } catch {
      toast.error("Failed to reject retailer");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <ShieldAlert className="text-red-500 mb-4" size={48} />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-wide">Retailer Verification</h1>
        <p className="text-sm text-neutral-400 mt-2">Verify shop licenses, GST numbers, and approve application requests.</p>
      </div>

      {retailers.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-12 text-center text-neutral-500 flex flex-col items-center justify-center">
          <Store className="text-neutral-600 mb-4" size={48} />
          <p className="text-lg font-semibold text-white mb-1">No pending verifications</p>
          <p className="text-sm">All retailer registration requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retailers.map((r) => (
            <div 
              key={r._id} 
              className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition duration-300"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white">
                    <Store size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{r.shopName}</h3>
                    <p className="text-xs text-neutral-400">Owner: {r.user?.name} ({r.user?.email})</p>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Details */}
                <div className="space-y-3 text-sm">
                  {/* GST */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-neutral-500 font-medium shrink-0">GSTIN:</span>
                    <span className="font-mono text-neutral-200 break-all">{r.gstNumber}</span>
                  </div>

                  {/* Address */}
                  <div className="flex gap-2 text-neutral-300">
                    <MapPin className="text-neutral-500 shrink-0 mt-0.5" size={16} />
                    <span className="text-neutral-300 text-xs leading-relaxed">{r.shopAddress}</span>
                  </div>

                  {/* Bank Details */}
                  {r.bankDetails && (
                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-2 mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase">
                        <CreditCard size={14} />
                        <span>Bank Information</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-neutral-500 font-medium">Bank:</p>
                          <p className="text-neutral-300 truncate">{r.bankDetails.bankName || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">IFSC Code:</p>
                          <p className="text-neutral-300 font-mono">{r.bankDetails.ifsc || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-neutral-500 font-medium">Account Number:</p>
                          <p className="text-neutral-300 font-mono truncate">{r.bankDetails.accountNumber || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleReject(r._id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition duration-200 cursor-pointer"
                >
                  <XCircle size={14} />
                  <span>Reject Application</span>
                </button>
                <button
                  onClick={() => handleApprove(r._id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition duration-200 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  <span>Approve Retailer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Retailers;
