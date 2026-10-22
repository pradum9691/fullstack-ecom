import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.05] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.05]">
          
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-sm font-bold tracking-[0.25em] uppercase text-white">
                Annesie Whites
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/30 max-w-xs mb-8">
              Timeless essentials crafted with precision, comfort, and purpose — 
              designed for the modern generation.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/30 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5">Shop</h4>
            <ul className="space-y-3.5">
              {["All Products", "New Arrivals", "Best Sellers", "Wishlist"].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-white/40 hover:text-white transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5">Company</h4>
            <ul className="space-y-3.5">
              {["About Us", "Contact", "Privacy Policy", "Terms"].map((item) => (
                <li key={item}>
                  <Link to="/contact" className="text-sm text-white/40 hover:text-white transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5">Account</h4>
            <ul className="space-y-3.5">
              {[
                { label: "My Profile", path: "/profile" },
                { label: "My Orders", path: "/orders" },
                { label: "Wishlist", path: "/wishlist" },
                { label: "Sell With Us", path: "/apply-retailer" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm text-white/40 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-5">Newsletter</h4>
            <p className="text-sm text-white/30 mb-5 leading-relaxed">
              New drops & exclusive offers. No spam.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-xs font-semibold"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                You're subscribed!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 transition-all duration-200 group"
                >
                  Subscribe
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20 font-medium">
            © {new Date().getFullYear()} Annesie Whites. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-white/15">
            <span>Designed with</span>
            <span className="text-rose-400">♥</span>
            <span>for modern living</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
