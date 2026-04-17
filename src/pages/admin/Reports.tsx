import { useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Users, DollarSign, Download, CalendarDays, ArrowUpRight, ArrowDownLeft, Share2, Layers } from "lucide-react";

const timelineOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last 12 Months"];

const chartData = {
  "Last 7 Days": [
    { period: "Mon", revenue: 32000, users: 1350 },
    { period: "Tue", revenue: 38500, users: 1600 },
    { period: "Wed", revenue: 29500, users: 1480 },
    { period: "Thu", revenue: 42500, users: 1760 },
    { period: "Fri", revenue: 50500, users: 1920 },
    { period: "Sat", revenue: 47000, users: 1850 },
    { period: "Sun", revenue: 52000, users: 2020 },
  ],
  "Last 30 Days": [
    { period: "Week 1", revenue: 120000, users: 5200 },
    { period: "Week 2", revenue: 145000, users: 6100 },
    { period: "Week 3", revenue: 162000, users: 6800 },
    { period: "Week 4", revenue: 190000, users: 7400 },
  ],
  "Last 90 Days": [
    { period: "Jan", revenue: 430000, users: 18000 },
    { period: "Feb", revenue: 462000, users: 19400 },
    { period: "Mar", revenue: 501000, users: 21000 },
    { period: "Apr", revenue: 552000, users: 23000 },
  ],
  "Last 12 Months": [
    { period: "Jan", revenue: 410000, users: 17100 },
    { period: "Feb", revenue: 436000, users: 18300 },
    { period: "Mar", revenue: 480000, users: 19700 },
    { period: "Apr", revenue: 521000, users: 20500 },
    { period: "May", revenue: 555000, users: 21500 },
    { period: "Jun", revenue: 590000, users: 22900 },
    { period: "Jul", revenue: 610000, users: 23800 },
    { period: "Aug", revenue: 634000, users: 24500 },
    { period: "Sep", revenue: 662000, users: 25200 },
    { period: "Oct", revenue: 690000, users: 26400 },
    { period: "Nov", revenue: 724000, users: 27800 },
    { period: "Dec", revenue: 742000, users: 28400 },
  ],
};

const subscriptionMix = [
  { name: "Prime", value: 42, fill: "#6366f1", dotClass: "bg-blue-600" },
  { name: "Growth", value: 33, fill: "#e879f9", dotClass: "bg-fuchsia-500" },
  { name: "Enterprise", value: 25, fill: "#f59e0b", dotClass: "bg-amber-500" },
];

const reportLog = [
  { id: 1, title: "Monthly revenue analysis", type: "PDF", status: "Completed", updated: "2 hours ago" },
  { id: 2, title: "User growth forecast", type: "XLSX", status: "Processing", updated: "6 hours ago" },
  { id: 3, title: "Subscription trends", type: "CSV", status: "Completed", updated: "1 day ago" },
  { id: 4, title: "Performance pulse", type: "PDF", status: "Queued", updated: "Just now" },
];

const premiumMetrics = [
  { label: "Monthly revenue", value: "₹ 6.9M", change: "+18.2%", icon: DollarSign, accent: "bg-amber-100 text-amber-600" },
  { label: "New admin users", value: "1.4k", change: "+12.5%", icon: Users, accent: "bg-blue-100 text-blue-600" },
  { label: "Conversion rate", value: "7.6%", change: "+4.8%", icon: TrendingUp, accent: "bg-emerald-100 text-emerald-600" },
  { label: "Report exports", value: "1.2k", change: "+9.4%", icon: BarChart3, accent: "bg-violet-100 text-violet-600" },
];

const insights = [
  { label: "Top-performing program", value: "Aviation Upskill", delta: "+24%", icon: Share2 },
  { label: "Highest retention", value: "Prime Subscribers", delta: "+13%", icon: Layers },
  { label: "Fastest growing region", value: "South Asia", delta: "+21%", icon: ArrowUpRight },
];

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

type TimelineKey = keyof typeof chartData;

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimelineKey>("Last 30 Days");
  const selectedPeriodKey = selectedPeriod as TimelineKey;

  const trendData = useMemo<TrendPoint[]>(
    () => chartData[selectedPeriodKey],
    [selectedPeriodKey]
  );

  const totalRevenue = useMemo(
    () => trendData.reduce((sum: number, item: TrendPoint) => sum + item.revenue, 0),
    [trendData]
  );

  const totalUsers = useMemo(
    () => trendData.reduce((sum: number, item: TrendPoint) => sum + item.users, 0),
    [trendData]
  );

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
                  <ResponsiveContainer width="100%" height="100%">
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
                      18.2% <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">User adoption</p>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">+12.5%</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">Export volume</p>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">1,240</div>
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
              <ResponsiveContainer width="100%" height="100%">
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
                {reportLog.map((entry) => (
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
                ))}
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
