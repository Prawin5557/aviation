import { useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Users, DollarSign, Download, CalendarDays, ArrowUpRight, Share2, Layers } from "lucide-react";
import { useDashboardStats, useUsers } from "@/src/hooks/useQueries";

const timelineOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last 12 Months"];

const toNumber = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const compact = value.replace(/,/g, "").trim();
  const match = compact.match(/([0-9]+(?:\.[0-9]+)?)([KMB])?/i);
  if (!match) {
    return 0;
  }

  const numeric = Number(match[1]);
  const suffix = (match[2] || "").toUpperCase();
  const multiplier = suffix === "B" ? 1_000_000_000 : suffix === "M" ? 1_000_000 : suffix === "K" ? 1_000 : 1;
  return numeric * multiplier;
};

function statusStyles(status: string) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Processing":
      return "bg-amber-50 text-amber-700";
    case "Queued":
      return "bg-slate-50 text-slate-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

type TrendPoint = { period: string; revenue: number; users: number };
type TimelineKey = (typeof timelineOptions)[number];

export default function Reports() {
  const { data: stats } = useDashboardStats();
  const { data: users } = useUsers();
  const [selectedPeriod, setSelectedPeriod] = useState<TimelineKey>("Last 30 Days");

  const trendData = useMemo<TrendPoint[]>(() => {
    const source: Array<{ month: string; count: number }> = Array.isArray(stats?.jobTrends) ? stats.jobTrends : [];
    if (!source.length) {
      return [];
    }

    const windowSize = selectedPeriod === "Last 7 Days" ? 7 : selectedPeriod === "Last 30 Days" ? 4 : selectedPeriod === "Last 90 Days" ? 3 : 12;
    const windowData = source.slice(-windowSize);
    const totalCount = windowData.reduce((sum: number, item: { month: string; count: number }) => sum + Number(item.count || 0), 0);
    const totalRevenue = toNumber(stats?.revenue);

    return windowData.map((item: { month: string; count: number }, idx: number) => {
      const usersCount = Number(item.count || 0);
      const distributedRevenue = totalCount > 0 ? Math.round((usersCount / totalCount) * totalRevenue) : 0;
      return {
        period: item.month || `P${idx + 1}`,
        users: usersCount,
        revenue: distributedRevenue,
      };
    });
  }, [selectedPeriod, stats]);

  const subscriptionMix = useMemo(() => {
    const roster = Array.isArray(users) ? users : [];
    const subscriptionCounts = roster.reduce<Record<string, number>>((acc, user: any) => {
      const tier = user.subscription || "Unassigned";
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    const palette = [
      { fill: "#6366f1", dotClass: "bg-blue-600" },
      { fill: "#e879f9", dotClass: "bg-fuchsia-500" },
      { fill: "#f59e0b", dotClass: "bg-amber-500" },
      { fill: "#10b981", dotClass: "bg-emerald-500" },
      { fill: "#64748b", dotClass: "bg-slate-500" },
    ];

    const total = Object.values(subscriptionCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(subscriptionCounts).map(([name, count], index) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      fill: palette[index % palette.length].fill,
      dotClass: palette[index % palette.length].dotClass,
    }));
  }, [users]);

  const reportLog = useMemo(() => {
    const activities = Array.isArray(stats?.userActivity) ? stats.userActivity : [];
    return activities.slice(0, 6).map((entry: any, index: number) => {
      const actionText = String(entry.action || "");
      const lower = actionText.toLowerCase();
      const type = lower.includes("export") ? "Export" : lower.includes("report") ? "Report" : "System";
      const status = lower.includes("fail") ? "Queued" : lower.includes("pending") ? "Processing" : "Completed";
      return {
        id: entry.id || index,
        title: actionText || "Activity event",
        type,
        status,
        updated: entry.time || "Recently",
      };
    });
  }, [stats]);

  const premiumMetrics = useMemo(
    () => [
      { label: "Monthly revenue", value: stats?.revenue || "₹ 0", change: "Live", icon: DollarSign, accent: "bg-amber-100 text-amber-600" },
      { label: "Admin users", value: String((users || []).filter((user: any) => user.role === "admin").length), change: "Live", icon: Users, accent: "bg-blue-100 text-blue-600" },
      { label: "Conversion rate", value: `${stats?.conversionRate || 0}%`, change: "Live", icon: TrendingUp, accent: "bg-emerald-100 text-emerald-600" },
      { label: "Report events", value: String(reportLog.length), change: "Live", icon: BarChart3, accent: "bg-violet-100 text-violet-600" },
    ],
    [reportLog.length, stats, users]
  );

  const insights = useMemo(
    () => [
      { label: "Top-performing channel", value: `${stats?.totalJobs || 0} active jobs`, delta: "Live", icon: Share2 },
      { label: "Highest retention", value: `${stats?.activeUsers || 0} active users`, delta: "Live", icon: Layers },
      { label: "Growth signal", value: `${stats?.newLeads || 0} new leads`, delta: "Live", icon: ArrowUpRight },
    ],
    [stats]
  );

  const totalRevenue = useMemo(
    () => trendData.reduce((sum: number, item: TrendPoint) => sum + item.revenue, 0),
    [trendData]
  );

  const totalUsers = useMemo(
    () => trendData.reduce((sum: number, item: TrendPoint) => sum + item.users, 0),
    [trendData]
  );

  const revenueChange = useMemo(() => {
    if (trendData.length < 2) {
      return "0.0%";
    }
    const first = trendData[0].revenue;
    const last = trendData[trendData.length - 1].revenue;
    if (first <= 0) {
      return "0.0%";
    }
    return `${(((last - first) / first) * 100).toFixed(1)}%`;
  }, [trendData]);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-purple-600 font-bold">Admin reports</p>
          <h1 className="mt-2 text-4xl font-display font-bold text-slate-900 tracking-tight">Operations & insights</h1>
          <p className="mt-3 max-w-2xl text-slate-500">Review the latest platform analytics, export in one click, and track performance across users, revenue, and subscription mix.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="premium-button-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button className="glass-card px-5 py-3 inline-flex items-center gap-2 text-sm text-slate-700 border border-slate-200">
            <Share2 className="h-4 w-4 text-purple-600" />
            Share insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {premiumMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="glass-card p-6">
                  <div className={`inline-flex items-center justify-center rounded-2xl p-3 ${metric.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-6 rounded-4xl border border-slate-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Revenue & user momentum</h2>
                <p className="mt-2 text-sm text-slate-500">Track growth across your selected reporting window and spot trends instantly.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">{selectedPeriod}</div>
                <select
                  value={selectedPeriod}
                  onChange={(event) => setSelectedPeriod(event.target.value as TimelineKey)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  aria-label="Select report time range"
                >
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4 rounded-[28px] bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">Total revenue</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">₹ {totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{totalUsers.toLocaleString()} users</div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={200}>
                    <AreaChart data={trendData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="reportTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.24} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: '1px solid rgba(226,232,240,0.9)',
                          boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fill="url(#reportTrend)" activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-5 rounded-[28px] bg-white p-5 shadow-sm border border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Growth pulse</p>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{selectedPeriod}</span>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-slate-400 text-xs uppercase tracking-[0.24em] font-bold">Revenue change</div>
                    <div className="mt-3 flex items-center gap-3 text-3xl font-semibold text-slate-900">
                      {revenueChange} <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">User adoption</p>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{totalUsers.toLocaleString()}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">Export volume</p>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{reportLog.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-4xl border border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Subscription mix</h2>
                <p className="mt-2 text-sm text-slate-500">View user plan distribution across your platform.</p>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={200}>
                <PieChart>
                  <Pie data={subscriptionMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {subscriptionMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid rgba(226,232,240,0.9)',
                      boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
              {subscriptionMix.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-4xl border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Operational insights</h2>
            <p className="mt-2 text-sm text-slate-500">Actionable highlights for your next leadership review.</p>
            <div className="mt-6 space-y-4">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.label} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{insight.label}</p>
                        <p className="text-sm text-slate-500">{insight.value}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{insight.delta}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.85fr] gap-6">
        <div className="glass-card p-6 rounded-4xl border border-slate-200 overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent report activity</h2>
              <p className="mt-2 text-sm text-slate-500">Track generated exports and download statuses.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="glass-card px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">CSV</button>
              <button className="glass-card px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">XLSX</button>
              <button className="glass-card px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">PDF</button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  <th className="px-4 py-3">Report</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {reportLog.length > 0 ? (
                  reportLog.map((entry: { id: string | number; title: string; type: string; status: string; updated: string }) => (
                    <tr key={entry.id} className="bg-white/90 rounded-3xl shadow-sm">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{entry.title}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{entry.type}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{entry.updated}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white/90 rounded-3xl shadow-sm">
                    <td className="px-4 py-6 text-sm text-slate-500" colSpan={4}>No report activity available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 rounded-4xl border border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Report checklist</h2>
              <p className="mt-2 text-sm text-slate-500">Ensure every report is ready for leadership review.</p>
            </div>
            <CalendarDays className="h-6 w-6 text-purple-600" />
          </div>

          <div className="mt-6 space-y-4">
            {[
              "Verify revenue numbers against CRM",
              "Confirm user adoption lift across cohorts",
              "Review subscription mix before board update",
              "Approve next quarter reporting templates",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-600" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
