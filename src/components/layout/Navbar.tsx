import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { name: "HOME", path: "/", hasDropdown: false },
    { name: "ABOUT US", path: "/about", hasDropdown: false },
    { name: "JOBS", path: "/jobs", hasDropdown: false },
    { name: "COLLABORATION", path: "/collaboration", hasDropdown: false },
    { name: "EVENTS", path: "/events", hasDropdown: false },
    { name: "BLOG", path: "/blog", hasDropdown: false },
    { name: "CONTACT", path: "/contact", hasDropdown: false },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      navigate("/");
      setIsProfileOpen(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">ARMZ</span>
              <span className="text-2xl font-light text-slate-400 mx-1">|</span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">AVIATION</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "relative flex items-center space-x-1 text-[10px] font-bold tracking-widest transition-all hover:text-purple-600 uppercase group",
                  location.pathname === link.path ? "text-purple-600" : "text-slate-500"
                )}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="h-3 w-3 opacity-50" />}
                {location.pathname === link.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600" />
                )}
              </Link>
            ))}

            <div className="flex items-center space-x-4 ml-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-200 hover:border-purple-200 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden">
                      <Link 
                        to={user?.role === 'admin' ? '/admin' : user?.role === 'employer' ? '/employer' : '/dashboard'}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                      </Link>
                      <Link 
                        to="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Profile</span>
                      </Link>
                      <div className="h-px bg-slate-100 my-2 mx-2" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button className="premium-button-primary px-8 py-2.5 text-[10px] tracking-widest uppercase">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="premium-button-outline px-8 py-2.5 text-[10px] tracking-widest uppercase">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-purple-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 overflow-hidden">
          <div className="px-4 pt-2 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-4 text-sm font-semibold text-slate-700 hover:bg-purple-50/50 rounded-xl"
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4 opacity-50" />}
              </Link>
            ))}
            <div className="pt-6 grid grid-cols-1 gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-4 px-3 py-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user?.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.role}</p>
                    </div>
                  </div>
                  <Link 
                    to={user?.role === 'admin' ? '/admin' : user?.role === 'employer' ? '/employer' : '/dashboard'} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-4 text-sm font-semibold text-slate-700 hover:bg-purple-50/50 rounded-xl"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-4 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="premium-button-primary w-full py-4 text-sm tracking-widest uppercase">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <button className="premium-button-outline w-full py-4 text-sm tracking-widest uppercase">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
