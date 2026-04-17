import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { apiService } from "@/src/services/api";
import toast from "react-hot-toast";
import { GlassCard } from "@/src/components/common/GlassCard";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  renewalDate: string;
  amount: number;
  amountFormatted: string;
  paymentMethod: string;
  autoRenew: boolean;
  createdAt: string;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  pendingSubscriptions: number;
  totalRevenue: number;
  totalRevenueFormatted: string;
  monthlyRecurringRevenue: number;
  monthlyRecurringRevenueFormatted: string;
  churnRate: number;
  averageSubscriptionValue: number;
  averageSubscriptionValueFormatted: string;
}

interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired" | "cancelled" | "pending">("all");
  const [activeTab, setActiveTab] = useState<"overview" | "subscriptions" | "analytics">("overview");
  const [showNewSubscriptionModal, setShowNewSubscriptionModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminSubscriptions();
      if (res?.data) {
        setSubscriptions(res.data.subscriptions || []);
        setStats(res.data.stats || null);
      }
      toast.success('Subscription data refreshed');
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.planName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, filterStatus]);

  const handleStatusChange = async (subscriptionId: string, newStatus: Subscription['status']) => {
    try {
      await apiService.updateSubscriptionStatus(subscriptionId, newStatus);
      setSubscriptions(prev => prev.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
      ));
      toast.success(`Subscription ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update subscription status");
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await apiService.deleteSubscription(subscriptionId);
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
      toast.success("Subscription deleted");
    } catch (error) {
      toast.error("Failed to delete subscription");
    }
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'expired': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'cancelled': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const planDistribution: PlanDistribution[] = [
    { name: 'Starter', value: 45, color: '#64748b' },
    { name: 'Professional', value: 30, color: '#8b5cf6' },
    { name: 'Elite', value: 20, color: '#06b6d4' },
    { name: 'Placement', value: 5, color: '#10b981' }
  ];

  const getPlanDotClass = (planName: string) => {
    switch (planName) {
      case 'Starter':
        return 'bg-slate-500';
      case 'Professional':
        return 'bg-purple-500';
      case 'Elite':
        return 'bg-cyan-500';
      case 'Placement':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 18900 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 25800 },
    { month: 'Jun', revenue: 28900 }
  ];

  const subscriptionGrowthData = [
    { month: 'Jan', subscriptions: 120 },
    { month: 'Feb', subscriptions: 145 },
    { month: 'Mar', subscriptions: 168 },
    { month: 'Apr', subscriptions: 192 },
    { month: 'May', subscriptions: 215 },
    { month: 'Jun', subscriptions: 238 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Subscription Management</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Monitor and manage user subscriptions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="space-y-4" hoverEffect={false}>
              <div className="h-12 w-12 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                <div className="h-8 w-1/4 bg-slate-100 rounded animate-pulse" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Subscription Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Monitor and manage user subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubscriptions}
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Subscription
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl w-fit">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "subscriptions", label: "Subscriptions", icon: Users },
          { id: "analytics", label: "Analytics", icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="admin-subscriptions-tabs"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2"><tab.icon className="h-4 w-4" />{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Subscriptions",
                value: stats?.totalSubscriptions || 0,
                trend: "+12%",
                up: true,
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                label: "Active Subscriptions",
                value: stats?.activeSubscriptions || 0,
                trend: "+8%",
                up: true,
                icon: CheckCircle,
                color: "text-emerald-500",
                bg: "bg-emerald-50"
              },
              {
                label: "Monthly Recurring Revenue",
                value: stats?.monthlyRecurringRevenueFormatted || "₹0",
                trend: "+15%",
                up: true,
                icon: TrendingUp,
                color: "text-purple-500",
                bg: "bg-purple-50"
              },
              {
                label: "Churn Rate",
                value: `${stats?.churnRate || 0}%`,
                trend: "-2%",
                up: true,
                icon: Activity,
                color: "text-rose-500",
                bg: "bg-rose-50"
              }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                      stat.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-display font-bold text-slate-900 mt-2">{stat.value}</h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <GlassCard className="p-8" hoverEffect={false}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">Revenue Trends</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Monthly recurring revenue</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Plan Distribution */}
            <GlassCard className="p-8" hoverEffect={false}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">Plan Distribution</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Subscription breakdown</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {planDistribution.map((plan) => (
                  <div key={plan.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-sm text-slate-600">{plan.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === "subscriptions" && (
        <div className="space-y-6">
          {/* Filters */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  aria-label="Filter subscriptions by status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-white border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Subscriptions Table */}
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Renewal</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscriptions.map((subscription) => (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{subscription.userName}</p>
                          <p className="text-sm text-slate-500">{subscription.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{subscription.planName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{subscription.amountFormatted}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{new Date(subscription.renewalDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSubscription(subscription)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <select
                            aria-label="Change subscription status"
                            value={subscription.status}
                            onChange={(e) => handleStatusChange(subscription.id, e.target.value as Subscription['status'])}
                            className="text-xs bg-white border border-slate-200 rounded px-2 py-1"
                          >
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending">Pending</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubscription(subscription.id)}
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No subscriptions found</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Growth Chart */}
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">Subscription Growth</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Monthly subscription trends</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={subscriptionGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Average Lifespan</p>
                  <p className="text-2xl font-display font-bold text-slate-900">8.5 months</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Conversion Rate</p>
                  <p className="text-2xl font-display font-bold text-slate-900">24.8%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg. Revenue/User</p>
                  <p className="text-2xl font-display font-bold text-slate-900">₹2,450</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}