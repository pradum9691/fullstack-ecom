import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { User, Mail, Edit3, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data.data);
        setName(res.data.data.name || `${res.data.data.firstName || ''} ${res.data.data.lastName || ''}`.trim());
      } catch (err) {
        console.error("Profile load failed", err);
        setError("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading Profile..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base text-rose-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  const fullName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.name || "User";

  const rawAvatar = profile?.avatar || user?.avatar;

  const avatar = rawAvatar
    ? `https://images.weserv.nl/?url=${encodeURIComponent(rawAvatar)}`
    : "/avatar.png";

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
    try {
      setSaving(true);
      const res = await api.put("/auth/profile", { name });
      setProfile(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base pt-24 px-6 pb-20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-bg-card border border-border rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-2xl">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-60" />
            
            {/* Avatar & Header Info */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  onError={(e) => (e.target.src = "/avatar.png")}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-bg-base shadow-xl transition-transform duration-500 group-hover:scale-105"
                  alt="Profile"
                />
                <button className="absolute bottom-2 right-2 h-10 w-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors cursor-pointer border-2 border-bg-base">
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left mt-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">{fullName}</h1>
                <p className="text-sm text-text-secondary mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={14} />
                  {profile.email}
                </p>

                <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/addresses")}
                    className="border-border text-text-primary hover:bg-bg-card-hover"
                  >
                    Manage Addresses
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/orders")}
                  >
                    Order History
                  </Button>
                </div>
              </div>
            </div>
   
            {/* Account Details Section */}
            <div className="mt-14 pt-10 border-t border-border relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-border bg-bg-base shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-2">
                    <User size={14} className="text-indigo-500" /> Full Name
                  </p>
                  {isEditing ? (
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-10 text-sm"
                      />
                      <Button
                        variant="primary"
                        isLoading={saving}
                        disabled={saving}
                        onClick={handleSave}
                        className="h-10 px-4"
                      >
                        <Save size={14} />
                      </Button>
                    </div>
                  ) : (
                    <p className="font-semibold text-text-primary text-base">{fullName}</p>
                  )}
                </div>

                <div className="p-5 rounded-2xl border border-border bg-bg-base shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-purple-500" /> Email Address
                  </p>
                  <p className="font-semibold text-text-primary text-base truncate">{profile.email}</p>
                  <p className="text-[10px] text-text-muted mt-1">(Verified)</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {profile.role === "CUSTOMER" && (
                  <Button
                    variant="gradient"
                    onClick={() => navigate("/apply-retailer")}
                  >
                    Become a Retailer
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/change-password")}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-border px-4 py-2 rounded-xl"
                >
                  Change Password
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;