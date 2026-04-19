import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  User,
  Plane,
  Linkedin,
  ClipboardCheck,
  CreditCard,
  Video,
  BookOpen,
  ClipboardList
} from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import UserMenuDropdown from "@/src/components/common/UserMenuDropdown";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Resume Builder", path: "/dashboard/resume", icon: FileText },
    { name: "LinkedIn Support", path: "/dashboard/linkedin", icon: Linkedin },
    { name: "Jobs & Internships", path: "/dashboard/jobs", icon: Briefcase },
    { name: "Interview Schedule", path: "/dashboard/interviews", icon: Calendar },
    { name: "Subscriptions", path: "/dashboard/subscriptions", icon: CreditCard },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Webinars", path: "/dashboard/webinars", icon: Video },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex layout-min-h-dvh bg-transparent overflow-hidden flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-transparent border-r border-slate-200 print:hidden">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Plane className="h-5 w-5 text-white transform -rotate-45" />
            </div>
            <span className="text-xl font-bold text-slate-900 font-display">
              ARMZ Aviation
            </span>
          </Link>
        </div>

        <nav className="grow px-4 space-y-1 overflow-y-auto pb-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                location.pathname === item.path
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-transparent border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Plane className="h-4 w-4 text-white transform -rotate-45" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-display">ARMZ</span>
          </div>
          
          <h2 className="text-lg lg:text-xl font-bold text-slate-800">
            {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </h2>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link to="/dashboard/notifications" aria-label="View notifications" className="relative h-11 w-11 inline-flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Link>
            <div className="pl-4 lg:pl-6 border-l border-slate-200">
              <UserMenuDropdown
                name={user?.name || "Candidate"}
                subtitle={user?.role || "Student"}
                initial={user?.name?.[0] || "C"}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="grow overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 print:p-0 print:overflow-visible">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full layout-max-w-1600 mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Bottom Navigation - Mobile (Instagram Style) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around px-2 z-50 print:hidden safe-bottom">
          {[
            { name: "Home", path: "/dashboard", icon: LayoutDashboard },
            { name: "Jobs", path: "/dashboard/jobs", icon: Briefcase },
            { name: "Profile", path: "/dashboard/profile", icon: User },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded-xl transition-all",
                location.pathname === item.path
                  ? "text-purple-600"
                  : "text-slate-400"
              )}
            >
              <item.icon className={cn("h-6 w-6", location.pathname === item.path && "fill-current")} />
              <span className="text-xs font-bold uppercase tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

