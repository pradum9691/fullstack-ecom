import { useState } from "react";
import api from "../../utils/api";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      setOld("");
      setNew("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-28 px-6 pb-20 flex justify-center">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card withGlow glowColor="from-rose-500/10 to-orange-500/10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-rose-500 to-orange-600 shadow-lg shadow-rose-500/20">
                <Lock size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Change Password</h1>
              <p className="text-sm text-neutral-400 mt-2">
                Keep your account secure by updating your password regularly.
              </p>
            </div>
    
            <form onSubmit={submit} className="space-y-6">
              <Input
                label="Current Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOld(e.target.value)}
              />
      
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNew(e.target.value)}
              />
      
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="gradient"
                  fullWidth
                  isLoading={loading}
                >
                  UPDATE PASSWORD
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
