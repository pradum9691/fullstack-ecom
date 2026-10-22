import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-text-primary text-bg-base hover:opacity-90 border border-transparent shadow-md",
  secondary: "bg-bg-card border border-border text-text-primary hover:bg-bg-card-hover",
  outline: "bg-transparent text-text-primary border border-border hover:border-border-hover hover:bg-bg-card/50",
  ghost: "bg-transparent text-text-primary hover:bg-bg-card-hover",
  danger: "bg-rose-500 text-white hover:bg-rose-600 border border-transparent",
  gradient: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 border border-transparent"
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  icon: "p-3"
};

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false, 
  disabled = false, 
  fullWidth = false,
  icon: Icon,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
