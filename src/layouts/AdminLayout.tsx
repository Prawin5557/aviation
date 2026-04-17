import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GraduationCap, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Settings2,
  LogOut,
  Bell,
  Search,
  Plane,
  ClipboardCheck,
  Megaphone,
  School,
  Video,
  ShieldCheck,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { useAdminStore } from "@/src/store/adminStore";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Tooltip } from "@/src/components/ui/Tooltip";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useAdminStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard, desc: "System performance & stats" },
    { name: "Students", path: "/admin/students", icon: Users, desc: "Manage member directory" },
    { name: "Jobs & Internships", path: "/admin/jobs", icon: Briefcase, desc: "Post & moderate listings" },
    { name: "Plan Management", path: "/admin/plans", icon: Settings2, desc: "Configure pricing tiers" },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard, desc: "Track revenue & billing" },
    { name: "Campaigns", path: "/admin/campaigns", icon: Megaphone, desc: "Marketing & notifications" },
    { name: "Colleges", path: "/admin/colleges", icon: School, desc: "Partner institutions" },
    { name: "Events & Webinars", path: "/admin/events", icon: Video, desc: "Live sessions & meetings" },
    { name: "Reports", path: "/admin/reports", icon: BarChart3, desc: "Analytics & data export" },
    { name: "Settings", path: "/admin/settings", icon: Settings, desc: "Portal configurations" },
  ];

  if (user?.isPrime) {
    menuItems.splice(1, 0, { name: "Admin Management", path: "/admin/management", icon: ShieldCheck, desc: "Staff roles & security" });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden text-slate-600">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 88 : 288 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col bg-white/50 backdrop-blur-xl border-r border-slate-200 relative z-50"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="logo-expanded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-2"
              >
                <div className="bg-purple-600 p-1.5 rounded-lg shrink-0">
                  <Plane className="h-5 w-5 text-white transform -rotate-45" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-display whitespace-nowrap">
                  ARMZ Admin
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <Plane className="h-5 w-5 text-white transform -rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="grow px-4 space-y-1 overflow-y-auto pb-8 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Tooltip 
                key={item.path} 
                content={item.name} 
                subtitle={item.desc}
                side="right" 
                className={!isCollapsed ? "hidden" : ""}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all relative group",
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
                  )}
                >
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="active-nav-bg"
                        className="absolute inset-0 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full z-20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                      {/* Subtle Glow */}
                      <div className="absolute inset-0 bg-purple-600 rounded-xl blur-md opacity-20 -z-10" />
                    </>
                  )}
                  <div className="relative z-10 flex items-center space-x-3">
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-white")} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </div>
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Tooltip content="Logout" side="right" className={!isCollapsed ? "hidden" : ""}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all",
                isCollapsed && "justify-center px-0"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </Tooltip>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand side navigation" : "Collapse side navigation"}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all z-50"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", isCollapsed && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="grow flex flex-col overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-20 bg-transparent border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center grow max-w-md">
            <div className="relative w-full group">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                searchQuery ? "text-purple-600" : "text-slate-400 group-focus-within:text-purple-600"
              )} />
              <Input 
                placeholder="Search across admin panel..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white/50 border-slate-200 text-slate-700 focus:ring-purple-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button aria-label="View notifications" className="relative p-2 text-slate-400 hover:text-purple-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.isPrime ? "Prime Admin" : "Staff Admin"}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="grow overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

