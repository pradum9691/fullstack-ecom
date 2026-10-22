import { motion } from "framer-motion";

const StatCard = ({ label, value, icon: Icon, color, bg, border, gradient, desc, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 ${gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700`}
      />

      {/* Card */}
      <div className="relative bg-bg-card border border-border rounded-2xl p-5 hover:border-border-hover transition-all duration-300 group-hover:-translate-y-0.5 overflow-hidden">
        {/* Subtle top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-px ${bg.replace("bg-", "bg-gradient-to-r from-transparent via-").replace("/10", "/50 to-transparent")}`} />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{label}</p>
            {desc && <p className="text-[10px] text-white/20 mt-0.5 font-normal">{desc}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${bg} ${border} border`}>
            <Icon size={16} className={color} />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
