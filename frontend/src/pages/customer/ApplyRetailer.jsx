import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Store, Building2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const ApplyRetailer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    gstNumber: "",
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/retailer/apply", formData);
      if (res.data.success) {
        toast.success("Application submitted successfully! Wait for admin approval.");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card withGlow glowColor="from-indigo-500/20 to-purple-500/20" className="p-8 md:p-10 border-white/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Store size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Become a Retailer</h1>
                <p className="text-sm text-neutral-400 mt-1">Join our marketplace and start selling your products.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b border-white/10 pb-2 flex items-center gap-2 text-white">
                  <Building2 size={18} className="text-indigo-400" />
                  Business Details
                </h3>
                
                <Input
                  label="Shop Name"
                  required
                  type="text"
                  placeholder="e.g. Annesie Electronics"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />

                <Input
                  label="Shop Address"
                  required
                  type="text"
                  placeholder="Complete shop address"
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                />

                <Input
                  label="GST Number"
                  required
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  error={formData.gstNumber && formData.gstNumber.length !== 15 ? "Must be a valid 15-character GSTIN" : ""}
                />
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-semibold border-b border-white/10 pb-2 flex items-center gap-2 text-white">
                  <CreditCard size={18} className="text-purple-400" />
                  Bank Details <span className="text-xs font-normal text-neutral-500">(Optional)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Bank Name"
                    type="text"
                    placeholder="e.g. HDFC Bank"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankDetails: { ...formData.bankDetails, bankName: e.target.value } 
                    })}
                  />
                  
                  <Input
                    label="IFSC Code"
                    type="text"
                    placeholder="HDFC0001234"
                    value={formData.bankDetails.ifsc}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankDetails: { ...formData.bankDetails, ifsc: e.target.value.toUpperCase() } 
                    })}
                  />
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Account Number"
                      type="text"
                      placeholder="XXXXXXXXXXXX"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Button
                  type="submit"
                  variant="gradient"
                  fullWidth
                  isLoading={loading}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyRetailer;
