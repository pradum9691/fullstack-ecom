import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Men",
    subtitle: "Menswear Collection",
    tag: "New Arrivals",
    gradient: "from-[#1a1a2e] to-[#16213e]",
    accentGlow: "bg-indigo-500/20",
    accentBorder: "border-indigo-500/30",
    textAccent: "text-indigo-400",
    image: "https://pngimg.com/uploads/jacket/jacket_PNG8056.png",
    category: "Men",
  },
  {
    title: "Women",
    subtitle: "Women's Fashion",
    tag: "Trending",
    gradient: "from-[#1a0a1e] to-[#200a2e]",
    accentGlow: "bg-purple-500/20",
    accentBorder: "border-purple-500/30",
    textAccent: "text-purple-400",
    image: "https://pngimg.com/uploads/dress/dress_PNG166.png",
    category: "Women",
  },
  {
    title: "Unisex",
    subtitle: "Universal Styles",
    tag: "Best Sellers",
    gradient: "from-[#0a1a1a] to-[#0a1e1e]",
    accentGlow: "bg-emerald-500/20",
    accentBorder: "border-emerald-500/30",
    textAccent: "text-emerald-400",
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png",
    category: "Unisex",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-3"
          >
            Browse by Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Shop by Style
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/products?category=${cat.category}`)}
              className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

              {/* Glow blob */}
              <div className={`absolute top-6 right-6 w-32 h-32 rounded-full ${cat.accentGlow} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

              {/* Content */}
              <div className="absolute top-6 left-6 right-6 z-10">
                <span className={`badge ${cat.textAccent} bg-white/5 ${cat.accentBorder} mb-4 inline-flex`}>
                  {cat.tag}
                </span>
                <p className="text-xs text-white/40 font-medium">{cat.subtitle}</p>
                <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{cat.title}</h3>
              </div>

              {/* Image */}
              <div className="absolute inset-0 flex items-end justify-center pb-16 px-4">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-48 object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-2xl"
                />
              </div>

              {/* Bottom CTA */}
              <div className="absolute bottom-5 left-6 right-6 z-10">
                <div className="flex items-center justify-between bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] rounded-xl px-4 py-3 group-hover:bg-white/[0.1] group-hover:border-white/[0.2] transition-all duration-300">
                  <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">Shop {cat.title}</span>
                  <ArrowRight size={14} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
