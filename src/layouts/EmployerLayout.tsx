import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  User, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import toast from "react-hot-toast";
import UserMenuDropdown from "@/src/components/common/UserMenuDropdown";

const minHeightViewportClass = "min-h-dvh";
const pageBackgroundClass = "bg-brand-50";
const contentMaxWidthClass = "max-w-400";

export default function EmployerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/employer" },
    { icon: Plus, label: "Post a Job", path: "/employer/post-job" },
    { icon: Users, label: "Applicants", path: "/employer/applicants" },
    { icon: Calendar, label: "Interviews", path: "/employer/interviews" },
    { icon: User, label: "Profile", path: "/employer/profile" },
    { icon: CreditCard, label: "Subscription", path: "/employer/subscription" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className={`${minHeightViewportClass} ${pageBackgroundClass} flex overflow-x-hidden`}>
      {isSidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-8">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ARMZ</span>
              <span className="text-xl font-bold text-slate-900 tracking-tight ml-1">EMPLOYER</span>
            </Link>
          </div>

          <nav className="grow px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                  location.pathname === item.path
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow flex flex-col min-w-0">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="lg:hidden h-11 w-11 inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200 bg-white/70"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicants, jobs..."
                className="pl-10 pr-4 py-2.5 bg-slate-100/50 border-transparent focus:bg-white focus:border-purple-200 rounded-xl text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button aria-label="View notifications" className="h-11 w-11 inline-flex items-center justify-center text-slate-500 hover:text-purple-600 bg-white border border-slate-200 rounded-xl transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="pl-4 border-l border-slate-200">
              <UserMenuDropdown
                name={user?.name || "Employer"}
                subtitle="Employer"
                initial={user?.name?.charAt(0) || "E"}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 grow">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`w-full ${contentMaxWidthClass} mx-auto`}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

