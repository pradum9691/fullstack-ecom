import React from "react";

const SuspenseLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Glow behind the loader */}
        <div className="absolute h-24 w-24 rounded-full bg-white/5 blur-xl animate-pulse" />
        
        {/* Outer Spinning Ring */}
        <div className="h-16 w-16 rounded-full border-2 border-white/5 border-t-white animate-spin" />
        
        {/* Core Pulsing dot */}
        <div className="absolute h-3 w-3 rounded-full bg-white animate-ping" />
      </div>
      
      {/* Brand title */}
      <span className="mt-6 text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 select-none animate-pulse">
        Annesie
      </span>
    </div>
  );
};

export default SuspenseLoader;
