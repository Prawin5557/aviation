import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Building2,
  Plane,
  Bell,
  FileText,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import AICareerCoach from "@/src/components/dashboard/AICareerCoach";
import CareerRoadmap from "@/src/components/dashboard/CareerRoadmap";

import { useDashboardStats, useApplications, useJobs, useSavedJobs } from "@/src/hooks/useQueries";

export default function DashboardHome() {
  const APPS_PAGE_SIZE = 4;
  const { user } = useAuthStore();
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: recentApps = [], isLoading: isAppsLoading } = useApplications(user?.id);
  const { data: jobs = [], isLoading: isJobsLoading } = useJobs();
  const { data: savedJobs = [], isLoading: isSavedLoading } = useSavedJobs(user?.id);
  const navigate = useNavigate();
  const [currentAppsPage, setCurrentAppsPage] = useState(1);

  const isLoading = isStatsLoading || isAppsLoading || isJobsLoading || isSavedLoading;

  const profileCompleteness = user ? 85 : 0; // Simulated logic

  const handleNotificationClick = () => {
    toast.success("You're all caught up! No new notifications.");
  };

  const handleGoPremium = () => {
    navigate("/dashboard/subscriptions");
  };

  const handleViewAllApps = () => {
    navigate("/dashboard/applications");
  };

  const internshipJobs = useMemo(
    () => jobs.filter((job: any) => String(job.type || '').toLowerCase() === "internship"),
    [jobs]
  );

  const internshipCount = internshipJobs.length;
  const savedJobsCount = savedJobs.length;
  const internshipRecommendations = internshipJobs.slice(0, 3);

  const appsPageCount = Math.max(1, Math.ceil(recentApps.length / APPS_PAGE_SIZE));
  const pagedRecentApps = useMemo(() => {
    const start = (currentAppsPage - 1) * APPS_PAGE_SIZE;
    return recentApps.slice(start, start + APPS_PAGE_SIZE);
  }, [recentApps, currentAppsPage]);

  useEffect(() => {
    if (currentAppsPage > appsPageCount && appsPageCount > 0) {
      setCurrentAppsPage(appsPageCount);
    }
  }, [appsPageCount]);

  const statCards = [
    { label: "Total Jobs", value: stats?.totalJobs || jobs.length || "0", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Applications", value: stats?.totalApplications || "0", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Hires", value: stats?.totalHires || "0", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Active Users", value: stats?.activeUsers || "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 px-4 sm:px-0 pt-4 sm:pt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Welcome back, <span className="text-purple-600">{user?.name || 'Captain'}</span> ✈️
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-slate-500 text-sm sm:text-base font-medium">Here's what's happening with your aviation career today.</p>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
              user?.subscription === 'elite' ? "bg-indigo-100 text-indigo-700" :
              user?.subscription === 'professional' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
            )}>
              {user?.subscription || 'Starter'} Plan
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            aria-label="View notifications"
            onClick={handleNotificationClick}
            className="p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/dashboard/resume" className="premium-button-primary px-4 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 w-full sm:w-auto justify-center">
            <FileText className="h-4 w-4" />
            <span>Update Resume</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Profile Completeness Card */}
        <div className="col-span-2 lg:col-span-1 glass-card p-5 sm:p-6 rounded-3xl bg-linear-to-br from-purple-600 to-indigo-700 text-white border-none shadow-xl shadow-purple-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Profile Strength</h3>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">{profileCompleteness}%</span>
          </div>
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profileCompleteness}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white"
            />
          </div>
          <p className="text-xs text-purple-100 mb-4">Complete your profile to get 3x more recruiter views.</p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white text-purple-600 hover:bg-purple-50 border-none font-bold"
            onClick={() => navigate("/dashboard/profile")}
          >
            Complete Now
          </Button>
        </div>

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl animate-pulse">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl mb-4"></div>
              <div className="h-4 w-24 bg-slate-100 rounded-full mb-2"></div>
              <div className="h-8 w-12 bg-slate-100 rounded-full"></div>
            </div>
          ))
        ) : (
          statCards.slice(0, 3).map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-4 sm:p-6 rounded-3xl group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className={`h-10 w-10 sm:h-14 sm:w-14 ${stat.bg} ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">{stat.value}</h3>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Market Trends Chart */}
          <div className="glass-card p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-purple-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">Aviation Job Trends</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Monthly hiring volume in your sector</p>
              </div>
              <div className="flex items-center w-fit space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold">+12.5%</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={200}>
                <AreaChart data={stats?.jobTrends || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#9333ea" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-600"
              onClick={handleViewAllApps}
            >
              View All Applications
            </Button>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card p-5 flex items-center justify-between">
                  <div className="flex items-center space-x-4 grow">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2 grow">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))
            ) : pagedRecentApps.length > 0 ? (
              pagedRecentApps.map((app: any, i: number) => (
                <div key={i} className="glass-card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-white/40 flex items-center justify-center border border-white/20">
                      <Building2 className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Job ID: {app.jobId}</h4>
                      <p className="text-sm text-slate-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full",
                      app.status === "Interview Scheduled" ? "bg-green-100/50 text-green-700" : 
                      app.status === "In Review" ? "bg-purple-100/50 text-purple-700" : "bg-slate-100/50 text-slate-700"
                    )}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-slate-500">No recent applications yet. Start applying to track progress here.</p>
              </div>
            )}

            {!isLoading && recentApps.length > APPS_PAGE_SIZE && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentAppsPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentAppsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-xs text-slate-500 font-medium">Page {currentAppsPage} of {appsPageCount}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentAppsPage((prev) => Math.min(appsPageCount, prev + 1))}
                  disabled={currentAppsPage === appsPageCount}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
          <AICareerCoach />
          {stats?.roadmap && <CareerRoadmap milestones={stats.roadmap} />}
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="glass-card p-4 sm:p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                    <div className="space-y-2 grow">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              ))
            ) : internshipRecommendations.length > 0 ? (
              internshipRecommendations.map((job: any, idx: number) => (
                <div key={idx} className="glass-card p-4 sm:p-6 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{job.title}</h4>
                      <p className="text-xs text-slate-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="h-3 w-3 mr-1" /> {job.location}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Job
                  </Button>
                </div>
              ))
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-slate-500">No internships available at the moment.</p>
              </div>
            )}
          </div>
          <div className="glass-card p-8 rounded-4xl border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">Jobs & Internships</p>
                <h3 className="text-2xl font-bold text-slate-900">Your latest opportunities</h3>
                <p className="text-sm text-slate-500 mt-2">Track jobs, internships, and saved positions from your dashboard.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="bg-purple-600 text-white" onClick={() => navigate('/dashboard/jobs')}>View Jobs</Button>
                <Button variant="outline" size="sm" className="border-slate-200 text-slate-700" onClick={() => navigate('/dashboard/applications')}>View Applications</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400">Open Roles</p>
                <p className="mt-4 text-3xl font-bold text-slate-900">{jobs.length}</p>
                <p className="mt-2 text-sm text-slate-500">Aviation jobs and internships available</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400">Internships</p>
                <p className="mt-4 text-3xl font-bold text-slate-900">{internshipCount}</p>
                <p className="mt-2 text-sm text-slate-500">Early-career aviation opportunities</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400">Saved Jobs</p>
                <p className="mt-4 text-3xl font-bold text-slate-900">{savedJobsCount}</p>
                <p className="mt-2 text-sm text-slate-500">Positions you've bookmarked</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-2">Upgrade to Pro</h4>
            <p className="text-xs text-purple-700 mb-4">Get featured in recruiter searches and priority application status.</p>
            <Button 
              size="sm" 
              className="w-full bg-purple-600 text-white"
              onClick={handleGoPremium}
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
