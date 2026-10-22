import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import AuthLayout from "../../layouts/AuthLayout";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError("");

      await api.post(`/auth/reset-password/${token}`, data);

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Password reset failed");
      setError(err.response?.data?.message || "Reset link expired");
    }
  };

  return (
    <AuthLayout 
      title="RESET PASSWORD" 
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-sm font-medium text-rose-500 text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/20">{error}</p>}

        <Input
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          {...register("password", { required: true })}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="gradient"
            fullWidth
            isLoading={isSubmitting}
          >
            RESET PASSWORD
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
