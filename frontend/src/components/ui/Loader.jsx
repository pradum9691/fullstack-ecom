import { motion } from "framer-motion";

const Loader = ({ fullScreen = false, text = "" }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-10 w-10 rounded-full border-t-2 border-r-2 border-black dark:border-white border-opacity-50 dark:border-opacity-50"
      />
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-neutral-500 tracking-widest uppercase"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      {content}
    </div>
  );
};

export default Loader;
