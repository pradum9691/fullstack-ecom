import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { loginSuccess } from "../../store/slices/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      setError("");
      const res = await api.post("/auth/register", payload);
      
      // Auto-login on registration success
      localStorage.setItem("token", res.data.token);
      dispatch(
        loginSuccess({
          user: res.data.data,
          token: res.data.token,
        })
      );
      
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <AuthLayout 
      title="CREATE ACCOUNT"
      subtitle="Join us and start your journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-sm font-medium text-rose-500 text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/20">{error}</p>}
 
        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="John Doe"
          {...register("name", { required: true })}
        />
     
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          {...register("email", { required: true })}
        />
 
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          {...register("password", { required: true })}
        />
    
        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          {...register("confirmPassword", { required: true })}
        />
 
        <div className="pt-2">
          <Button
            type="submit"
            variant="gradient"
            fullWidth
            isLoading={isSubmitting}
          >
            CREATE ACCOUNT
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-400 pt-4">
          Already have an account?{" "}
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

export default Register;
