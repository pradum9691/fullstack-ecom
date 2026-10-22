import { motion } from "framer-motion";
import { Layers, Cpu, FlaskConical, Leaf } from "lucide-react";

const expertiseItems = [
  {
    icon: Layers,
    title: "Layered Craftsmanship",
    desc: "Every product is built in multiple stages, each refined to perfection before moving to the next.",
    gradient: "from-indigo-500 to-blue-500",
    glow: "bg-indigo-500/10",
  },
  {
    icon: Cpu,
    title: "Precision Engineering",
    desc: "Our design process blends innovation with meticulous attention to detail at every step.",
    gradient: "from-purple-500 to-pink-500",
    glow: "bg-purple-500/10",
  },
  {
    icon: FlaskConical,
    title: "Material Science",
    desc: "We source and test every material for durability, comfort, and performance standards.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "bg-emerald-500/10",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    desc: "Environmentally conscious production methods that minimize our footprint on the planet.",
    gradient: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
  },
];

const ExpertiseSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* LEFT — Content */}
        <div className="flex items-center bg-[#060606] border-r border-white/[0.04]">
          <div className="px-8 sm:px-12 lg:px-16 py-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4"
            >
              Our Expertise
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight"
            >
              Where Design
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #c084fc, #e879f9)" }}>
                Meets Precision
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-sm text-white/35 leading-relaxed max-w-md"
            >
              Our process blends innovation with craftsmanship. Every detail is
              carefully refined — from material selection to final execution —
              ensuring products that feel purposeful and enduring.
            </motion.p>

            {/* Expertise Grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expertiseItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="group p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    <div className={`h-8 w-8 rounded-xl ${item.glow} flex items-center justify-center mb-3`}>
                      <Icon size={15} className="text-white/60" />
                    </div>
                    <h3 className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-[10px] text-white/25 mt-1.5 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative overflow-hidden min-h-[400px] lg:min-h-0"
        >
          <img
            src="https://images.unsplash.com/photo-1632450017961-ce82a195ee25?q=80&w=1600&auto=format&fit=crop"
            alt="Expertise"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-transparent to-transparent opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Floating stat badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-8 left-8 bg-black/70 backdrop-blur-xl border border-white/[0.15] rounded-2xl p-5"
          >
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-white">98</span>
              <span className="text-indigo-400 text-sm font-bold mb-1">%</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-medium uppercase tracking-wider">Customer Satisfaction</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
