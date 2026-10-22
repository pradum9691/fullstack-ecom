import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Timer } from "lucide-react";
import { useState, useEffect } from "react";

const useCountdown = (targetHours = 12) => {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = targetHours; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetHours]);
  return time;
};

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-bg-card/[0.07] border border-border rounded-xl px-4 py-2.5 min-w-[52px] text-center">
      <span className="text-2xl font-bold text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-[9px] text-white/25 uppercase tracking-widest mt-1.5 font-bold">{label}</span>
  </div>
);

const BannerSection = () => {
  const navigate = useNavigate();
  const time = useCountdown(11);

  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[440px] flex items-center overflow-hidden rounded-3xl border border-white/[0.08]"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <motion.img
            src="https://plus.unsplash.com/premium_photo-1699982290061-819c51d39690?q=80&w=1332&auto=format&fit=crop"
            alt="Sale Banner"
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Animated particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
            className="absolute w-1 h-1 rounded-full bg-white/50"
            style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 20}%` }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 px-10 sm:px-16 py-14 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Timer size={10} />
            Limited Time Offer
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
          >
            Get <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #f97316)" }}>20% Off</span>
            <br />
            Premium Collection
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 text-sm text-white/40 leading-relaxed max-w-md"
          >
            Crafted essentials designed for performance, comfort, and timeless style.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center gap-3"
          >
            <TimeUnit value={time.h} label="Hours" />
            <span className="text-white/30 text-2xl font-light mb-5">:</span>
            <TimeUnit value={time.m} label="Min" />
            <span className="text-white/30 text-2xl font-light mb-5">:</span>
            <TimeUnit value={time.s} label="Sec" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/products")}
            className="mt-8 group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm bg-bg-card text-text-primary hover:bg-bg-card-hover transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
          >
            <Sparkles size={15} />
            Shop the Sale
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default BannerSection;