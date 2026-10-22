import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pillars = [
  "Premium materials sourced responsibly",
  "Rigorous quality testing on every batch",
  "Designed to last — built to endure",
  "Ethically manufactured with care",
];

const BrandStorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-[#060606] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 md:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/[0.07] group"
          >
            <img
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop"
              alt="Brand Story"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Bottom badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl px-5 py-4">
                <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Founded with a mission</p>
                <p className="text-sm font-bold text-white mt-1">Quality over Quantity, Always.</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4">Our Story</p>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Designed with Purpose,
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #c084fc)" }}>
                Crafted for Life
              </span>
            </h2>

            <p className="mt-6 text-sm text-white/35 leading-relaxed max-w-lg">
              We believe great design should feel effortless. Every piece is created
              with a focus on quality, balance, and timeless appeal — made to move
              with you, not against you.
            </p>
            <p className="mt-4 text-sm text-white/35 leading-relaxed max-w-lg">
              From materials to form, every detail is refined to deliver comfort,
              durability, and quiet confidence you can feel every single day.
            </p>

            {/* Pillars */}
            <div className="mt-8 space-y-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-xs text-white/45 font-medium">{p}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate("/products")}
              className="mt-10 inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-sm border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
            >
              Explore Collection
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
