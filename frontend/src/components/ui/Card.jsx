import { motion } from "framer-motion";

const Card = ({ 
  children, 
  className = "", 
  withGlow = false,
  glowColor = "from-indigo-500/10 to-purple-500/10",
  ...props 
}) => {
  return (
    <div className="relative group">
      {withGlow && (
        <div className={`absolute inset-0 bg-gradient-to-r ${glowColor} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`relative bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-none hover:border-black/10 dark:hover:border-white/10 transition-all duration-300 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Card;
