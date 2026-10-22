import { Truck, ShieldCheck, RefreshCcw, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Free Delivery",
    desc: "On orders above ₹999",
    icon: Truck,
    gradient: "from-indigo-500 to-blue-500",
    glow: "bg-indigo-500/10",
  },
  {
    title: "Secure Payments",
    desc: "100% encrypted transactions",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-500",
    glow: "bg-emerald-500/10",
  },
  {
    title: "30-Day Returns",
    desc: "Hassle-free return policy",
    icon: RefreshCcw,
    gradient: "from-purple-500 to-pink-500",
    glow: "bg-purple-500/10",
  },
  {
    title: "Premium Quality",
    desc: "Curated & certified products",
    icon: Award,
    gradient: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
  },
  {
    title: "Lightning Fast",
    desc: "2-4 business day delivery",
    icon: Zap,
    gradient: "from-rose-500 to-pink-500",
    glow: "bg-rose-500/10",
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 bg-[#060606] border-y border-white/[0.04] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 via-transparent to-purple-500/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center gap-3 text-center group"
              >
                <div className={`relative h-12 w-12 flex items-center justify-center rounded-2xl ${item.glow} border border-white/[0.07] group-hover:border-white/[0.15] transition-all duration-300`}>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  <Icon size={20} className="text-white/50 group-hover:text-white/80 transition-colors duration-300 relative z-10" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white/70 group-hover:text-white transition-colors duration-200">{item.title}</h3>
                  <p className="text-[10px] text-white/25 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;