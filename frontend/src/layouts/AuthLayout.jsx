import { motion } from "framer-motion";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-black via-neutral-900 to-black
        px-4
      "
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full max-w-md
          rounded-3xl
          bg-gradient-to-b from-neutral-900 to-neutral-800
          border border-white/10
          shadow-[0_30px_80px_rgba(0,0,0,0.8)]
          px-10 py-14
          text-white
        "
      >
        {/* TITLE */}
        <h1
          className="
            text-center text-xl tracking-[0.25em]
            uppercase text-white/70
            mb-10
          "
        >
          {title}
        </h1>

        {/* FORM */}
        <div className="space-y-8">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;