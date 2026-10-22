import { useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const featured = products.slice(0, 4);

  return (
    <section className="py-20 sm:py-24 bg-[#050505] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
              <TrendingUp size={12} className="text-indigo-400" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/25">Trending Now</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
            >
              Featured Collection
            </motion.h2>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate("/products")}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 group"
          >
            View All
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate("/products")}
              className="group cursor-pointer"
            >
              <div className="relative bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.image}
                    loading="lazy"
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transform: "scale(1)" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick shop badge on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="block w-full text-center py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl text-xs font-bold text-white">
                      Quick Shop
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 relative z-10">
                  <h3 className="font-semibold text-sm text-white/80 truncate group-hover:text-white transition-colors">{p.name}</h3>
                  <p className="mt-1.5 text-sm font-bold text-white">₹{p.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden mt-8 text-center">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            View All Products <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;