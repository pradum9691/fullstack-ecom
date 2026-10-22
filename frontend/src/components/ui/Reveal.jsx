import { motion } from "framer-motion";

const Reveal = ({
  children,
  y = 40,
  duration = 0.8,
  delay = 0,
  once = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};


export default Reveal;
