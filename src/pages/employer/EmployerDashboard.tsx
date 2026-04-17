import React, { useState } from "react";
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Target,
  Eye,
  MessageSquare,
  Activity,
  Award,
  Zap,
  BarChart3,
  PlusCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/src/store/authStore";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const chartData = [
  { month: 'Jan', applications: 45, views: 120, hires: 12 },
  { month: 'Feb', applications: 52, views: 150, hires: 14 },
  { month: 'Mar', applications: 48, views: 140, hires: 11 },
  { month: 'Apr', applications: 70, views: 210, hires: 18 },
  { month: 'May', applications: 85, views: 250, hires: 22 },
  { month: 'Jun', applications: 92, views: 280, hires: 25 },
];

const activeJobs = [
  { id: 1, title: "Senior Captain - A320", company: "Air India", applications: 24, views: 156, status: "Active", salary: "₹2,50,000/mo" },
  { id: 2, title: "First Officer - B787", company: "Emirates", applications: 18, views: 142, status: "Active", salary: "₹1,80,000/mo" },
  { id: 3, title: "Cabin Crew Lead", company: "Indigo", applications: 32, views: 201, status: "Hot", salary: "₹80,000/mo" },
];

import { useDashboardStats, useApplications } from "@/src/hooks/useQueries";
import { Skeleton } from "@/src/components/ui/Skeleton";

export default function EmployerDashboard() {
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: applicants = [], isLoading: isAppsLoading } = useApplications();
  const [activeChart, setActiveChart] = useState("applications");
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const isLoading = isStatsLoading || isAppsLoading;

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const dashboardStats = [
    { label: "Active Jobs", value: stats?.totalJobs || "6", icon: Briefcase, color: "from-purple-600 to-pink-600", increase: "+2 this month" },
    { label: "Total Applicants", value: stats?.totalApplications || "287", icon: Users, color: "from-blue-600 to-cyan-600", increase: "+45 this month" },
    { label: "Interviews", value: stats?.totalHires || "34", icon: Calendar, color: "from-emerald-600 to-teal-600", increase: "+8 scheduled" },
    { label: "Hire Rate", value: "78%", icon: TrendingUp, color: "from-orange-600 to-red-600", increase: "↑ 12% vs last month" },
  ];

  const recentApplications = applicants.slice(0, 8).map((app: any) => ({
    id: app.id,
    name: app.userName || "John Doe",
    position: `Job ID: ${app.jobId}`,
    status: app.status,
    time: new Date(app.appliedAt).toLocaleDateString(),
    matchScore: Math.floor(Math.random() * 40 + 60)
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Employer Dashboard</h1>
          <p className="text-slate-500 mt-2 text-sm">Manage your aviation recruitment process and track your hiring pipeline.</p>
        </div>
        <Button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl font-bold flex items-center gap-2 w-fit">
          <PlusCircle className="h-4 w-4" />
          Post New Job
        </Button>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
              <div className="h-12 w-12 bg-slate-100 rounded-lg mb-4"></div>
              <div className="h-3 w-24 bg-slate-100 rounded-full mb-3"></div>
              <div className="h-8 w-16 bg-slate-100 rounded-full"></div>
            </div>
          ))
        ) : (
          dashboardStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-slate-200 group hover:shadow-lg transition-all"
              >
                <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  {stat.increase}
                </p>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-8 rounded-2xl border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Recruitment Analytics</h3>
              <p className="text-sm text-slate-600 mt-1">6-month performance overview</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {["applications", "views", "hires"].map((chart) => (
                <button
                  key={chart}
                  onClick={() => setActiveChart(chart)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                    activeChart === chart
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {chart}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b' }}
                />
                {activeChart === "applications" && (
                  <Area type="monotone" dataKey="applications" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#colorGradient)" />
                )}
                {activeChart === "views" && (
                  <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorGradient)" />
                )}
                {activeChart === "hires" && (
                  <Area type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGradient)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">487</p>
              <p className="text-xs text-slate-600">Total Applications</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">1.2K</p>
              <p className="text-xs text-slate-600">Job Views</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">102</p>
              <p className="text-xs text-slate-600">Hires Made</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-bold transition-all hover:scale-105">
                Post New Job
              </button>
              <button className="w-full px-4 py-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-bold transition-all hover:scale-105">
                Review Applications
              </button>
              <button className="w-full px-4 py-2.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-bold transition-all hover:scale-105">
                Schedule Interviews
              </button>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                title="Logout from your account"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Performance Highlights */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              This Month
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">New Applicants</span>
                <span className="font-bold text-slate-900">+45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Interviews Scheduled</span>
                <span className="font-bold text-slate-900">+12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Jobs Posted</span>
                <span className="font-bold text-slate-900">+2</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-600">Response Rate</span>
                <span className="font-bold text-emerald-600">78%</span>
              </div>
            </div>
          </div>

          {/* Premium Upgrade */}
          <div className="glass-card p-6 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 text-white border border-purple-500/50">
            <h4 className="font-bold mb-2">Grow Faster</h4>
            <p className="text-xs text-purple-100 mb-4">Upgrade to Pro for featured job placement and priority support.</p>
            <Button className="w-full py-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold">
              Upgrade Now
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Active Jobs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 rounded-2xl border border-slate-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-purple-600" />
            Active Job Postings
          </h3>
          <Button className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-bold mt-4 sm:mt-0">
            View All Jobs
          </Button>
        </div>

        <div className="grid gap-4">
          {activeJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                    <span className={cn(
                      "px-2 py-1 text-xs font-bold rounded-full",
                      job.status === "Hot" 
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    )}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{job.company}</p>
                  <p className="text-sm font-bold text-purple-600">{job.salary}</p>
                </div>
                <div className="flex flex-wrap gap-6 md:text-right">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Applications</p>
                    <p className="text-2xl font-bold text-slate-900">{job.applications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Views</p>
                    <p className="text-2xl font-bold text-slate-900">{job.views}</p>
                  </div>
                  <div className="flex items-end">
                    <Button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-8 rounded-2xl border border-slate-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            Recent Applications
          </h3>
          <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-bold mt-4 sm:mt-0">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left font-semibold text-slate-600">Applicant</th>
                <th className="py-4 text-left font-semibold text-slate-600">Position</th>
                <th className="py-4 text-left font-semibold text-slate-600">Match Score</th>
                <th className="py-4 text-left font-semibold text-slate-600">Status</th>
                <th className="py-4 text-left font-semibold text-slate-600">Applied</th>
                <th className="py-4 text-right font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100 animate-pulse">
                    <td colSpan={6} className="py-4 h-4 bg-slate-100 rounded-full"></td>
                  </tr>
                ))
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                          {app.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">{app.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">{app.position}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{app.matchScore}%</span>
                        <span className={cn(
                          "text-xs font-semibold",
                          app.matchScore > 80 ? "text-emerald-600" : "text-blue-600"
                        )}>
                          {app.matchScore > 80 ? "Excellent" : "Good"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        app.status === "Applied" ? "bg-blue-100 text-blue-700" :
                        app.status === "Under Review" ? "bg-purple-100 text-purple-700" :
                        app.status === "Interview Scheduled" ? "bg-emerald-100 text-emerald-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">{app.time}</td>
                    <td className="py-4 text-right">
                      <button className="text-purple-600 hover:text-purple-700 font-semibold text-xs">Review</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
