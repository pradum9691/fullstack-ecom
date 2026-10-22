import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError("");
      setMessage("");

      const res = await api.post("/auth/forgot-password", data);
      toast.success("Password reset link sent to email");
      setMessage(res.data.message || "Reset link sent to your email 📩");
    } catch (err) {
      toast.error("Email not registered");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout 
      title="FORGOT PASSWORD" 
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-sm font-medium text-rose-500 text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/20">{error}</p>}
        {message && <p className="text-sm font-medium text-emerald-500 text-center bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">{message}</p>}

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          {...register("email", { required: true })}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="gradient"
            fullWidth
            isLoading={isSubmitting}
          >
            SEND RESET LINK
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-400 pt-4">
          Back to{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors"
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
