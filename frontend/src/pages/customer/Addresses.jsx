import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Trash2, ArrowLeft, Plus } from "lucide-react";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadAddresses = async (showSuccess = false) => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data.data || []);
      if (showSuccess) {
        toast.success("Addresses loaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post("/addresses", form);
      setForm({
        name: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
      await loadAddresses();
      toast.success("Address added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success("Address deleted");
      await loadAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 py-12 text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 bg-[#111111] border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight gradient-text">
            My Addresses
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your delivery addresses for a faster checkout checkout.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Left: Form (2/5 columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-white/5 pb-3 flex items-center gap-1.5">
              <Plus size={14} />
              <span>Add New Address</span>
            </h3>

            <form onSubmit={addAddress} className="space-y-3">
              {Object.keys(form).map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider pl-1">{key}</label>
                  <input
                    required
                    placeholder={`e.g. ${key === 'pincode' ? '110001' : key === 'phone' ? '9876543210' : key}`}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500/50 transition duration-200 text-white placeholder-neutral-700"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-lg hover:shadow-white/5 cursor-pointer"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>

        {/* Right: Existing Addresses (3/5 columns) */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2">Saved Addresses</h3>
          
          {loading ? (
            <div className="h-[30vh] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-neutral-500 text-sm">
              No address added yet. Use the form to add one.
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {addresses.map((a) => (
                  <motion.div
                    key={a._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex justify-between items-start hover:border-white/10 transition duration-200 shadow-md group"
                  >
                    <div className="text-xs text-neutral-300 space-y-1.5">
                      <p className="font-bold text-white text-sm flex items-center gap-1.5">
                        <MapPin size={13} className="text-indigo-400" />
                        {a.name}
                      </p>
                      <p className="leading-relaxed">{a.addressLine}</p>
                      <p>{a.city}, {a.state} - {a.pincode}</p>
                      <p className="flex items-center gap-1.5 text-neutral-400 font-medium pt-1">
                        <Phone size={12} />
                        {a.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteAddress(a._id)}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-xl text-neutral-400 transition cursor-pointer flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Addresses;