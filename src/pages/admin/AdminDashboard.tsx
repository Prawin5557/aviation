import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Users,
  Briefcase,
  GraduationCap,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity,
  Clock,
  Loader2,
  Shield,
  BarChart3,
  Sparkles,
  Globe,
  ListChecks,
  Megaphone,
  Bell,
  Star,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { GlassCard } from "@/src/components/common/GlassCard";
import AdminAnalytics from "@/src/components/admin/AdminAnalytics";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useDashboardStats, useUsers, useLeads } from "@/src/hooks/useQueries";
import { useAdminStore } from "@/src/store/adminStore";

const rangeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "12m", label: "Last 12 Months" },
];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "12m">("7d");
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const { data: leads, isLoading: isLeadsLoading } = useLeads();
  const { searchQuery } = useAdminStore();
  const navigate = useNavigate();

  const isLoading = isStatsLoading || isUsersLoading || isLeadsLoading;
  const searchLower = searchQuery.toLowerCase();

  const filteredLeads = useMemo(
    () =>
      leads?.filter((lead: any) =>
        `${lead.name}`.toLowerCase().includes(searchLower) ||
        `${lead.email}`.toLowerCase().includes(searchLower) ||
        `${lead.interest}`.toLowerCase().includes(searchLower)
      ) || [],
    [leads, searchLower]
  );

  const filteredUsers = useMemo(
    () =>
      users?.filter((user: any) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower) ||
        `${user.email}`.toLowerCase().includes(searchLower)
      ) || [],
    [users, searchLower]
  );

  const filteredActivity = useMemo(
    () =>
      stats?.userActivity?.filter((log: any) =>
        `${log.user}`.toLowerCase().includes(searchLower) ||
        `${log.action}`.toLowerCase().includes(searchLower)
      ) || [],
    [stats, searchLower]
  );

  const quickActions = [
    { label: "Post New Job", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Publish Course", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Launch Campaign", icon: Megaphone, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Review Reports", icon: BarChart3, color: "text-slate-600", bg: "bg-slate-50" },
  ];

  const statsCards = [
    {
      label: "Active Users",
      value: stats?.activeUsers ?? 0,
      trend: "+12%",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      badge: "High engagement",
    },
    {
      label: "Open Jobs",
      value: stats?.totalJobs ?? 0,
      trend: "+8%",
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600",
      badge: "Hiring momentum",
    },
    {
      label: "New Leads",
      value: stats?.newLeads ?? 0,
      trend: "+26%",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600",
      badge: "Lead capture",
    },
    {
      label: "Conversion Rate",
      value: `${stats?.conversionRate ?? 18.9}%`,
      trend: "+2.3%",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      badge: "Platform efficiency",
    },
  ];

  const trendData = stats?.jobTrends || [
    { month: "Jan", count: 360 },
    { month: "Feb", count: 470 },
    { month: "Mar", count: 520 },
    { month: "Apr", count: 590 },
    { month: "May", count: 720 },
    { month: "Jun", count: 820 },
  ];

  const topLeads = filteredLeads.slice(0, 4);
  const recentUsers = filteredUsers.slice(0, 5);

  const handleQuickAction = (action: string) => {
    if (action === "Post New Job") {
      navigate("/admin/jobs");
    } else if (action === "Publish Course") {
      navigate("/admin/courses");
    } else if (action === "Launch Campaign") {
      navigate("/admin/campaigns");
    } else {
      navigate("/admin/reports");
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-500">
            <Sparkles className="h-4 w-4 text-purple-600" /> Platform overview
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm sm:text-base">A complete view of platform performance, team activity and growth signals for your admin operations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-3xl bg-slate-900/95 px-5 py-4 text-white shadow-xl shadow-slate-900/5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Live performance</p>
              <p className="mt-3 text-3xl font-semibold">{stats?.platformScore ?? 92}<span className="text-sm text-slate-300">/100</span></p>
              <p className="mt-2 text-slate-400 text-sm max-w-xs">The platform score combines activity, response time and conversion health.</p>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Your focus</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{dateRange === "7d" ? "Weekly pulse" : dateRange === "30d" ? "Monthly performance" : "Annual growth"}</p>
              <p className="mt-2 text-slate-500 text-sm">Use the date range selector to refine activity insights.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value as any)}
            className="min-w-[180px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            aria-label="Select date range"
          >
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Button className="rounded-2xl px-5 py-3" onClick={() => navigate("/admin/reports")}>Generate report</Button>
        </div>
      </div>

      <AdminAnalytics />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend.includes("+");
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{card.label}</p>
                    <p className="mt-4 text-3xl font-display font-bold text-slate-900">{card.value}</p>
                  </div>
                  <div className={`rounded-3xl px-3 py-3 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <span>{card.badge}</span>
                  <span className={`${isPositive ? "text-emerald-600" : "text-rose-600"}`}>{card.trend}</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr,1fr] gap-8">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Job Market Pulse</h2>
              <p className="text-slate-500 text-sm mt-2">Track monthly job activity and seasonal demand across the latest campaigns.</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {rangeOptions.find((option) => option.value === dateRange)?.label}
            </div>
          </div>

          <div className="mt-8 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#9333ea" strokeWidth={3} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Applicants", value: stats?.totalApplications ?? 0 },
              { label: "Hires", value: stats?.totalHires ?? 0 },
              { label: "Avg Time", value: stats?.avgResponseTime ?? "2.4d" },
              { label: "Offer Rate", value: stats?.offerRate ?? "18%" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">Quick Actions</h2>
                <p className="text-slate-500 text-sm mt-1">Actions to keep the overview moving.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg}`}>
                        <Icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                        <p className="text-xs text-slate-500">Quick access to high-priority admin workflows.</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-purple-600" />
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">System Health</h2>
                <p className="text-slate-500 text-sm mt-1">Server load, uptime and stability metrics.</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Stable</div>
            </div>
            <div className="space-y-5">
              {[
                { label: "Server Load", value: "24%", progress: 24 },
                { label: "Database", value: "68%", progress: 68 },
                { label: "API Latency", value: "126ms", progress: 42 },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{metric.label}</span>
                    <span>{metric.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Engaged Applicants</h2>
              <p className="text-slate-500 text-sm mt-1">Latest leads captured across campaigns.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-2xl border-slate-200 text-slate-600" onClick={() => navigate("/admin/leads")}>View all leads</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Lead</th>
                  <th className="px-8 py-5">Interest</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLeadsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-8 py-5"><Skeleton className="h-10 w-full rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-24 rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-32 rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-20 rounded-xl" /></td>
                      <td className="px-8 py-5"></td>
                    </tr>
                  ))
                ) : topLeads.length > 0 ? (
                  topLeads.map((lead: any, index: number) => (
                    <motion.tr
                      key={lead.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{lead.email}</p>
                      </td>
                      <td className="px-8 py-5"><span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{lead.interest}</span></td>
                      <td className="px-8 py-5 text-slate-500">{lead.phone || "—"}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          lead.status === "Qualified" ? "bg-emerald-50 text-emerald-700" : lead.status === "Contacted" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-700">Details</button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400">No leads found for "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Recent Registrations</h2>
              <p className="text-slate-500 text-sm mt-1">Newest members who joined the platform.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-2xl border-slate-200 text-slate-600" onClick={() => navigate("/admin/students")}>View all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Member</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isUsersLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-8 py-5"><Skeleton className="h-10 w-full rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-24 rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-20 rounded-xl" /></td>
                      <td className="px-8 py-5"><Skeleton className="h-6 w-24 rounded-xl" /></td>
                    </tr>
                  ))
                ) : recentUsers.length > 0 ? (
                  recentUsers.map((user: any, index: number) => (
                    <motion.tr
                      key={user.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-purple-700">
                            {user.first_name?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{user.role || "Student"}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          user.status === "Active" ? "bg-emerald-50 text-emerald-700" : user.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-semibold">{user.joined || "New"}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400">No recent registrations match "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">Activity Logs</h2>
            <p className="text-slate-500 text-sm mt-1">A quick view of recent admin and user activity.</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-2xl border-slate-200 text-slate-600">View full log</Button>
        </div>
        <div className="mt-8 grid gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-2xl bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/5 rounded-full bg-slate-100" />
                  <div className="h-3 w-1/4 rounded-full bg-slate-100" />
                </div>
              </div>
            ))
          ) : filteredActivity.length > 0 ? (
            filteredActivity.map((log: any, index: number) => (
              <motion.div
                key={log.id || index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-purple-50 text-purple-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900"><span className="text-purple-600">{log.user}</span> {log.action}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{log.time}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-[0.2em]">{log.source || "Web"}</div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-slate-400">No activity logs available for the selected filters.</div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

