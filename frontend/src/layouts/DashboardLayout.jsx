import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen bg-bg-base text-text-primary overflow-hidden flex">

      {/* ── Desktop Sidebar ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ x: -264, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -264, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-64 shrink-0 hidden lg:block"
          >
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar with toggle */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-bg-base z-10 shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-muted hover:text-text-primary hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200"
          >
            <Menu size={14} />
          </button>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-medium">Admin</span>
            <span>/</span>
            <span className="text-text-secondary font-medium capitalize">
              {location.pathname.split("/").filter(Boolean).pop() || "Dashboard"}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-y-auto px-6 py-8"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
            >
              <Sidebar close={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
