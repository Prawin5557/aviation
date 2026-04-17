import { Outlet } from "react-router-dom";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Ticker from "@/src/sections/Ticker";
import { motion } from "motion/react";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50/30">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-200/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Ticker />
        <Navbar />
        <main className="grow relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

