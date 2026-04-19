import apiClient from "@/src/services/apiClient";
import { ENV } from '@/src/config/env';
type AnyRecord = Record<string, any>;

const FRONTEND_ONLY = ENV.FRONTEND_ONLY;
const PRIME_ADMIN_EMAIL = 'prime.admin@armz.demo';
const DEMO_USER_STORAGE_KEY = 'frontend_demo_user';
const nowIso = () => new Date().toISOString();

const FRONTEND_STORE_KEYS = {
  admins: 'frontend_admins',
  jobs: 'frontend_admin_jobs',
  internships: 'frontend_admin_internships',
  plans: 'frontend_admin_plans',
  subscriptions: 'frontend_admin_subscriptions',
  payments: 'frontend_admin_payments',
  campaigns: 'frontend_admin_campaigns',
  colleges: 'frontend_admin_colleges',
  events: 'frontend_admin_events',
  students: 'frontend_students',
  leads: 'frontend_leads',
  notifications: 'frontend_notifications',
  notificationPreferences: 'frontend_notification_preferences',
} as const;

const demoJobs = [
  {
    id: 'demo-job-1',
    title: 'Cabin Crew Trainee',
    company: 'ARMZ Aviation',
    location: 'Mumbai, India',
    description: 'Entry-level aviation role for customer-facing cabin operations.',
    salary: '4.2 LPA',
    category: 'Cabin Crew',
    type: 'Full-time',
    postedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    logo: '',
    requirements: ['Excellent communication', 'Customer service skills'],
    applications: 34,
    views: 480,
    status: 'Active',
    experience: '0-1 Years',
  },
  {
    id: 'demo-job-2',
    title: 'Ground Operations Executive',
    company: 'SkyBridge Aviation',
    location: 'Delhi, India',
    description: 'Coordinate airport turnaround and ramp operations.',
    salary: '5.6 LPA',
    category: 'Ground Operations',
    type: 'Full-time',
    postedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    logo: '',
    requirements: ['Airport operations knowledge', 'Shift flexibility'],
    applications: 21,
    views: 320,
    status: 'Active',
    experience: '1-3 Years',
  },
];

const demoInternships = [
  {
    id: 'demo-int-1',
    title: 'Flight Ops Intern',
    company: 'ARMZ Aviation',
    location: 'Bengaluru, India',
    duration: '3-6 months',
    stipend: '15000',
    description: 'Assist with flight operations planning and reporting.',
    department: 'Operations',
    skills: ['Excel', 'Communication'],
    requirements: ['Aviation student'],
    applications: 28,
    views: 410,
    status: 'Active',
    postedAt: nowIso(),
    createdAt: nowIso(),
  },
  {
    id: 'demo-int-2',
    title: 'Aviation Marketing Intern',
    company: 'Runway Media Labs',
    location: 'Mumbai, India',
    duration: '2-4 months',
    stipend: '12000',
    description: 'Support digital campaigns for aviation training products.',
    department: 'Marketing',
    skills: ['Content', 'Analytics'],
    requirements: ['Marketing student'],
    applications: 17,
    views: 265,
    status: 'Active',
    postedAt: nowIso(),
    createdAt: nowIso(),
  },
];

const demoPlans = [
  {
    id: 'basic-student',
    name: 'Basic',
    price: 0,
    period: 'month',
    description: 'Starter plan for students',
    features: ['Profile creation', 'Job browsing'],
    permissions: ['jobs.read'],
    razorpay_plan_id: null,
    type: 'student' as const,
    isActive: true,
    subscriberCount: 124,
    revenueGenerated: 0,
    createdAt: nowIso(),
  },
  {
    id: 'pro-student',
    name: 'Pro',
    price: 999,
    period: 'month',
    description: 'Advanced plan with premium features',
    features: ['Priority listing', 'Advanced insights'],
    permissions: ['jobs.read', 'jobs.apply', 'resume.ai'],
    razorpay_plan_id: null,
    type: 'student' as const,
    isActive: true,
    subscriberCount: 64,
    revenueGenerated: 63936,
    createdAt: nowIso(),
  },
  {
    id: 'enterprise-student',
    name: 'Enterprise',
    price: 2499,
    period: 'month',
    description: 'Enterprise grade support and analytics',
    features: ['All Pro features', 'Priority support', 'Deep analytics'],
    permissions: ['jobs.read', 'jobs.apply', 'resume.ai', 'mentor.priority'],
    razorpay_plan_id: null,
    type: 'student' as const,
    isActive: true,
    subscriberCount: 15,
    revenueGenerated: 37485,
    createdAt: nowIso(),
  },
  {
    id: 'recruiter_starter',
    name: 'Recruiter Starter',
    price: 1999,
    period: 'month',
    description: 'Starter hiring toolkit for employers',
    features: ['Post up to 5 jobs', 'Basic applicant tracking', 'Email support'],
    permissions: ['jobs.post', 'applicants.read', 'profile.branding.basic'],
    razorpay_plan_id: null,
    type: 'employer' as const,
    isActive: true,
    subscriberCount: 22,
    revenueGenerated: 43978,
    createdAt: nowIso(),
  },
  {
    id: 'recruiter_growth',
    name: 'Recruiter Growth',
    price: 4999,
    period: 'month',
    description: 'Growth plan for scaling hiring teams',
    features: ['Post up to 20 jobs', 'Priority listing', 'Interview workflow automation'],
    permissions: ['jobs.post', 'jobs.promote', 'applicants.read', 'interviews.manage'],
    razorpay_plan_id: null,
    type: 'employer' as const,
    isActive: true,
    subscriberCount: 14,
    revenueGenerated: 69986,
    createdAt: nowIso(),
  },
  {
    id: 'recruiter_enterprise',
    name: 'Recruiter Enterprise',
    price: 9999,
    period: 'month',
    description: 'Enterprise hiring suite with premium support',
    features: ['Unlimited job postings', 'Advanced analytics', 'Dedicated account support'],
    permissions: ['jobs.post', 'jobs.promote', 'applicants.read', 'interviews.manage', 'analytics.advanced'],
    razorpay_plan_id: null,
    type: 'employer' as const,
    isActive: true,
    subscriberCount: 5,
    revenueGenerated: 49995,
    createdAt: nowIso(),
  },
];

const demoAdmins = [
  {
    id: 'prime-admin',
    name: 'Prime Admin',
    email: PRIME_ADMIN_EMAIL,
    role: 'prime',
    status: 'Active',
    permissions: ['manage_jobs', 'manage_students', 'manage_plans', 'manage_payments', 'view_reports', 'manage_admins'],
    lastActive: 'Just now',
    joinedAt: nowIso(),
    isPrime: true,
  },
  {
    id: 'admin-ops-1',
    name: 'Aditi Sharma',
    email: 'aditi.ops@armzaviation.com',
    role: 'admin',
    status: 'Active',
    permissions: ['manage_jobs', 'manage_students', 'view_reports'],
    lastActive: '2 hours ago',
    joinedAt: nowIso(),
    isPrime: false,
  },
  {
    id: 'mod-1',
    name: 'Rohan Mehta',
    email: 'rohan.moderator@armzaviation.com',
    role: 'moderator',
    status: 'Active',
    permissions: ['manage_students', 'view_reports'],
    lastActive: '1 day ago',
    joinedAt: nowIso(),
    isPrime: false,
  },
];

const demoSubscriptions = [
  {
    id: 'sub-1',
    userId: 'stu-1',
    userName: 'Ananya Rao',
    userEmail: 'ananya.rao@example.com',
    planId: 'pro-student',
    planName: 'Pro',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    renewalDate: '2026-05-01',
    amount: 999,
    amountFormatted: 'INR 999',
    paymentMethod: 'UPI',
    autoRenew: true,
    createdAt: nowIso(),
  },
  {
    id: 'sub-2',
    userId: 'stu-2',
    userName: 'Rahul Nair',
    userEmail: 'rahul.nair@example.com',
    planId: 'enterprise-student',
    planName: 'Enterprise',
    status: 'pending',
    startDate: '2026-04-10',
    endDate: '2026-05-10',
    renewalDate: '2026-05-10',
    amount: 2499,
    amountFormatted: 'INR 2,499',
    paymentMethod: 'Card',
    autoRenew: false,
    createdAt: nowIso(),
  },
  {
    id: 'sub-3',
    userId: 'stu-3',
    userName: 'Megha Das',
    userEmail: 'megha.das@example.com',
    planId: 'basic-student',
    planName: 'Basic',
    status: 'cancelled',
    startDate: '2026-01-01',
    endDate: '2026-02-01',
    renewalDate: '2026-02-01',
    amount: 0,
    amountFormatted: 'INR 0',
    paymentMethod: 'N/A',
    autoRenew: false,
    createdAt: nowIso(),
  },
];

const demoPayments = [
  {
    id: 'txn-1',
    userId: 'stu-1',
    userName: 'Ananya Rao',
    userEmail: 'ananya.rao@example.com',
    planId: 'pro-student',
    planName: 'Pro',
    amount: 999,
    amountFormatted: 'INR 999',
    currency: 'INR',
    paymentMethod: 'UPI',
    status: 'success',
    transactionDate: '2026-04-01',
    orderId: 'order_demo_1',
    paymentId: 'pay_demo_1',
    createdAt: nowIso(),
  },
  {
    id: 'txn-2',
    userId: 'stu-2',
    userName: 'Rahul Nair',
    userEmail: 'rahul.nair@example.com',
    planId: 'enterprise-student',
    planName: 'Enterprise',
    amount: 2499,
    amountFormatted: 'INR 2,499',
    currency: 'INR',
    paymentMethod: 'Card',
    status: 'failed',
    transactionDate: '2026-04-11',
    orderId: 'order_demo_2',
    paymentId: null,
    createdAt: nowIso(),
  },
];

const demoCampaigns = [
  { id: 'camp-1', name: 'Summer Pilot Drive', target: 'Final year aviation students', reach: 25000, status: 'Active', budget: 120000, spent: 73000, impressions: 54000, clicks: 3200, conversions: 186, createdAt: nowIso() },
  { id: 'camp-2', name: 'Cabin Crew Webinar', target: 'Early career aspirants', reach: 12000, status: 'Draft', budget: 45000, spent: 0, impressions: 0, clicks: 0, conversions: 0, createdAt: nowIso() },
];

const demoColleges = [
  { id: 'college-1', name: 'Delhi Aviation Institute', location: 'New Delhi', students: 420, status: 'Active' },
  { id: 'college-2', name: 'Mumbai Aeronautics Academy', location: 'Mumbai', students: 310, status: 'Pending' },
];

const demoEvents = [
  { id: 'event-1', title: 'Aviation Career Fair', type: 'Event', date: '2026-05-12', attendees: 460, status: 'Upcoming' },
  { id: 'event-2', title: 'Airline Interview Masterclass', type: 'Webinar', date: '2026-04-24', attendees: 260, status: 'Live' },
];

const demoStudents = [
  { id: 'stu-1', firstName: 'Ananya', lastName: 'Rao', email: 'ananya.rao@example.com', phone: '+91 9876543210', institution: 'Delhi Aviation Institute', major: 'Aviation Management', enrollmentDate: '2026-01-10', status: 'Active', courses: 4, assessments: 3, profileCompletion: 88, location: 'Delhi', gpa: '8.4' },
  { id: 'stu-2', firstName: 'Rahul', lastName: 'Nair', email: 'rahul.nair@example.com', phone: '+91 9988776655', institution: 'Mumbai Aeronautics Academy', major: 'Flight Operations', enrollmentDate: '2026-02-15', status: 'Pending', courses: 2, assessments: 1, profileCompletion: 54, location: 'Mumbai', gpa: '7.9' },
];

const demoLeads = [
  { id: 'lead-1', name: 'Sanya Kapoor', email: 'sanya@example.com', phone: '+91 9991112233', interest: 'Cabin Crew Program', source: 'program_interest', status: 'new', createdAt: nowIso(), updatedAt: nowIso() },
  { id: 'lead-2', name: 'Karan Verma', email: 'karan@example.com', phone: '+91 9998887766', interest: 'Employer Hiring Plan', source: 'contact_form', status: 'contacted', createdAt: nowIso(), updatedAt: nowIso() },
];

const demoNotifications = [
  {
    id: 'notif-1',
    userId: 'demo-student-user',
    title: 'Application Update',
    description: 'Your application for Cabin Crew Trainee moved to shortlist.',
    type: 'application',
    icon: 'CheckCircle2',
    timestamp: nowIso(),
    read: false,
    actionUrl: '/dashboard/applications',
    priority: 'high',
  },
  {
    id: 'notif-2',
    userId: 'demo-student-user',
    title: 'New Job Match',
    description: 'A Ground Operations Executive role matches your profile.',
    type: 'job',
    icon: 'Briefcase',
    timestamp: nowIso(),
    read: true,
    actionUrl: '/jobs',
    priority: 'medium',
  },
  {
    id: 'notif-3',
    userId: 'student1',
    title: 'Course Milestone',
    description: 'You unlocked a new lesson in Aviation Interview Prep.',
    type: 'course',
    icon: 'BookOpen',
    timestamp: nowIso(),
    read: false,
    actionUrl: '/dashboard/courses',
    priority: 'low',
  },
];

const demoNotificationPreferences = [
  {
    userId: 'demo-student-user',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    jobAlerts: true,
    interviewReminders: true,
    applicationUpdates: true,
    courseUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    immediateAlerts: true,
  },
  {
    userId: 'student1',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    jobAlerts: true,
    interviewReminders: true,
    applicationUpdates: true,
    courseUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    immediateAlerts: true,
  },
];

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const readCollection = <T>(key: string, fallback: T[]): T[] => {
  if (!isBrowser) return [...fallback];
  const raw = localStorage.getItem(key);
  if (!raw) return [...fallback];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...fallback];
  } catch {
    return [...fallback];
  }
};

const writeCollection = <T>(key: string, value: T[]) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

const getFrontendCollection = <T>(key: string, seed: T[]): T[] => {
  const existing = readCollection(key, seed);
  if (isBrowser && !localStorage.getItem(key)) {
    writeCollection(key, existing);
  }
  return existing;
};

const getFrontendPlansCollection = () => {
  const existing = getFrontendCollection(FRONTEND_STORE_KEYS.plans, demoPlans as any[]);
  const merged = [...existing];

  for (const seedPlan of demoPlans as any[]) {
    if (!merged.some((plan: any) => String(plan.id) === String(seedPlan.id))) {
      merged.push(seedPlan);
    }
  }

  if (JSON.stringify(merged) !== JSON.stringify(existing)) {
    writeCollection(FRONTEND_STORE_KEYS.plans, merged);
  }

  return merged;
};

const computeJobStats = (jobs: any[]) => {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === 'Active').length;
  const totalApplications = jobs.reduce((sum, job) => sum + Number(job.applications || 0), 0);
  const totalViews = jobs.reduce((sum, job) => sum + Number(job.views || 0), 0);
  const categoryMap = new Map<string, number>();
  jobs.forEach((job) => {
    const key = job.category || 'General';
    categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
  });
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    averageApplicationsPerJob: totalJobs ? totalApplications / totalJobs : 0,
    totalViews,
    jobsByCategory: Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    })),
    applicationsByStatus: [
      { status: 'Active', count: activeJobs },
      { status: 'Closed', count: totalJobs - activeJobs },
    ],
  };
};

const computeInternshipStats = (internships: any[]) => {
  const totalInternships = internships.length;
  const activeInternships = internships.filter((item) => item.status === 'Active').length;
  const totalApplications = internships.reduce((sum, item) => sum + Number(item.applications || 0), 0);
  const totalViews = internships.reduce((sum, item) => sum + Number(item.views || 0), 0);
  const deptMap = new Map<string, number>();
  internships.forEach((item) => {
    const key = item.department || 'General';
    deptMap.set(key, (deptMap.get(key) || 0) + 1);
  });
  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return {
    totalInternships,
    activeInternships,
    totalApplications,
    averageApplicationsPerInternship: totalInternships ? totalApplications / totalInternships : 0,
    totalViews,
    internshipsByDepartment: Array.from(deptMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    })),
  };
};

const computeSubscriptionStats = (subscriptions: any[]) => {
  const totalRevenue = subscriptions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const activeSubscriptions = subscriptions.filter((item) => item.status === 'active').length;
  const totalSubscriptions = subscriptions.length;
  const expiredSubscriptions = subscriptions.filter((item) => item.status === 'expired').length;
  const cancelledSubscriptions = subscriptions.filter((item) => item.status === 'cancelled').length;
  const pendingSubscriptions = subscriptions.filter((item) => item.status === 'pending').length;
  const monthlyRecurringRevenue = subscriptions
    .filter((item) => item.status === 'active')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    totalSubscriptions,
    activeSubscriptions,
    expiredSubscriptions,
    cancelledSubscriptions,
    pendingSubscriptions,
    totalRevenue,
    totalRevenueFormatted: `INR ${totalRevenue.toLocaleString('en-IN')}`,
    monthlyRecurringRevenue,
    monthlyRecurringRevenueFormatted: `INR ${monthlyRecurringRevenue.toLocaleString('en-IN')}`,
    churnRate: totalSubscriptions ? Number(((cancelledSubscriptions / totalSubscriptions) * 100).toFixed(1)) : 0,
    averageSubscriptionValue: totalSubscriptions ? Math.round(totalRevenue / totalSubscriptions) : 0,
    averageSubscriptionValueFormatted: `INR ${totalSubscriptions ? Math.round(totalRevenue / totalSubscriptions).toLocaleString('en-IN') : '0'}`,
  };
};

const computePaymentSummary = (transactions: any[]) => {
  const successful = transactions.filter((txn) => txn.status === 'success');
  const failed = transactions.filter((txn) => txn.status !== 'success');
  const totalRevenue = successful.reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
  const pendingAmount = failed.reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

  return {
    totalRevenue,
    totalRevenueFormatted: `INR ${totalRevenue.toLocaleString('en-IN')}`,
    activeSubscriptions: successful.length,
    pendingPayments: failed.length,
    pendingAmount,
    pendingAmountFormatted: `INR ${pendingAmount.toLocaleString('en-IN')}`,
  };
};

const demoStats = {
  totalJobs: 12,
  totalApplications: 48,
  totalHires: 9,
  activeUsers: 126,
  activeStudents: 94,
  revenue: '0',
  newLeads: 0,
  conversionRate: 0,
  platformScore: 0,
  avgResponseTime: '0h',
  offerRate: '0%',
  jobTrends: [],
};

const unwrapData = (response: any): any => response?.data?.data ?? response?.data ?? response;

const ensureArray = (value: any): any[] => (Array.isArray(value) ? value : []);

const normalizeListWithStats = (raw: any, listKey: string) => {
  if (Array.isArray(raw)) {
    return { [listKey]: raw, stats: null };
  }

  if (raw && typeof raw === 'object') {
    const list = ensureArray(raw[listKey] ?? raw.items ?? raw.results);
    return {
      ...raw,
      [listKey]: list,
      stats: raw.stats ?? null,
    };
  }

  return { [listKey]: [], stats: null };
};

const normalizeNotifications = (raw: any) => {
  const notifications = ensureArray(
    Array.isArray(raw) ? raw : raw?.notifications ?? raw?.items ?? raw?.results
  ).map((item: AnyRecord) => ({
    ...item,
    description: item.description ?? item.message ?? '',
  }));

  const unreadCount =
    typeof raw?.unreadCount === 'number'
      ? raw.unreadCount
      : notifications.filter((item: AnyRecord) => !item.read).length;

  return {
    ...(raw && typeof raw === 'object' ? raw : {}),
    notifications,
    unreadCount,
  };
};

const normalizeWebinars = (raw: any) => {
  const webinars = ensureArray(
    Array.isArray(raw) ? raw : raw?.webinars ?? raw?.items ?? raw?.results
  );

  const categoriesFromData = webinars
    .map((item: AnyRecord) => item.category)
    .filter((category: unknown): category is string => typeof category === 'string' && category.length > 0);

  const categories = Array.from(
    new Set(ensureArray(raw?.categories).concat(categoriesFromData))
  ) as string[];

  return {
    ...(raw && typeof raw === 'object' ? raw : {}),
    webinars,
    categories,
  };
};

export const apiService = {
  getAdmins: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.admins, demoAdmins) };
    }

    const response = await apiClient.get('/admins');
    return { data: response.data?.data || response.data };
  },

  createAdmin: async (data: any) => {
    if (FRONTEND_ONLY) {
      const admins = getFrontendCollection(FRONTEND_STORE_KEYS.admins, demoAdmins);
      const admin = {
        id: `admin-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role || 'moderator',
        status: data.status || 'Active',
        permissions: Array.isArray(data.permissions)
          ? data.permissions
          : String(data.permissions || '')
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
        lastActive: 'Just now',
        joinedAt: nowIso(),
        isPrime: data.role === 'prime',
      };
      const next = [admin, ...admins];
      writeCollection(FRONTEND_STORE_KEYS.admins, next);
      return { data: admin };
    }

    const response = await apiClient.post('/admins', data);
    return { data: response.data?.data || response.data };
  },

  updateAdmin: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const admins = getFrontendCollection(FRONTEND_STORE_KEYS.admins, demoAdmins);
      const next = admins.map((admin: any) =>
        String(admin.id) === String(id)
          ? {
              ...admin,
              ...data,
              permissions: Array.isArray(data.permissions)
                ? data.permissions
                : data.permissions
                  ? String(data.permissions)
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : admin.permissions,
              isPrime: data.role ? data.role === 'prime' : admin.isPrime,
            }
          : admin
      );
      writeCollection(FRONTEND_STORE_KEYS.admins, next);
      return { data: next.find((admin: any) => String(admin.id) === String(id)) };
    }

    const response = await apiClient.put(`/admins/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteAdmin: async (id: string) => {
    if (FRONTEND_ONLY) {
      const admins = getFrontendCollection(FRONTEND_STORE_KEYS.admins, demoAdmins);
      const next = admins.filter((admin: any) => String(admin.id) !== String(id) && !admin.isPrime);
      writeCollection(FRONTEND_STORE_KEYS.admins, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admins/${id}`);
    return { data: response.data?.data || response.data };
  },

  adminLogin: async (email: string, password?: string) => {
    if (FRONTEND_ONLY) {
      const normalizedEmail = email.trim().toLowerCase();
      const admins = getFrontendCollection(FRONTEND_STORE_KEYS.admins, demoAdmins);
      const primeAdmin = admins.find(
        (admin: any) => admin.isPrime && String(admin.email).trim().toLowerCase() === normalizedEmail
      );

      if (!primeAdmin) {
        throw new Error('Invalid admin credentials');
      }

      if (!password || password.trim().length < 8) {
        throw new Error('Demo admin login requires a passphrase of at least 8 characters.');
      }

      const primeAdminUser = {
        id: String(primeAdmin.id || 'prime-admin'),
        name: String(primeAdmin.name || 'Prime Admin'),
        email: String(primeAdmin.email || normalizedEmail),
        role: 'admin' as const,
        isPrime: Boolean(primeAdmin.isPrime),
        permissions: Array.isArray(primeAdmin.permissions) ? primeAdmin.permissions : ['*'],
        joinedAt: String(primeAdmin.joinedAt || new Date().toISOString()),
      };

      localStorage.setItem('auth_token', 'frontend-prime-admin-token');
      localStorage.setItem('refresh_token', 'frontend-prime-admin-refresh-token');
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(primeAdminUser));

      return {
        data: primeAdminUser,
      };
    }

    const response = await apiClient.post('/auth/admin/login', { email, password });
    return { data: response.data?.data || response.data };
  },
  getJobs: async () => {
    if (FRONTEND_ONLY) {
      return { data: demoJobs };
    }

    const response = await apiClient.get('/jobs');
    return { data: response.data?.data || response.data };
  },

  createJob: async (data: any) => {
    const response = await apiClient.post('/jobs', data);
    return { data: response.data?.data || response.data };
  },

  updateJob: async (id: string, data: any) => {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteJob: async (id: string) => {
    const response = await apiClient.delete(`/jobs/${id}`);
    return { data: response.data?.data || response.data };
  },

  getJobById: async (id: string) => {
    const response = await apiClient.get(`/jobs/${id}`);
    return { data: response.data?.data || response.data };
  },

  getCompanies: async () => {
    const response = await apiClient.get('/companies');
    return { data: response.data?.data || response.data };
  },

  getDashboardStats: async () => {
    if (FRONTEND_ONLY) {
      return { data: demoStats };
    }

    const response = await apiClient.get('/dashboard/stats');
    return { data: response.data?.data || response.data };
  },

  getApplications: async (userId?: string) => {
    if (FRONTEND_ONLY) {
      return { data: [] };
    }

    const response = await apiClient.get('/applications', {
      params: userId ? { userId } : undefined,
    });
    return { data: response.data?.data || response.data };
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/applications/${id}/status`, { status });
    return { data: response.data?.data || response.data };
  },

  applyForJob: async (jobId: string, userId: string) => {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, { userId });
    return { data: response.data?.data || response.data };
  },

  saveJob: async (jobId: string, userId: string) => {
    const response = await apiClient.post(`/users/${userId}/saved-jobs`, { jobId });
    return { data: response.data?.data || response.data };
  },

  removeSavedJob: async (jobId: string, userId: string) => {
    const response = await apiClient.delete(`/users/${userId}/saved-jobs/${jobId}`);
    return { data: response.data?.data || response.data };
  },

  getSavedJobs: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/saved-jobs`);
    return { data: response.data?.data || response.data };
  },

  getStudents: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.students, demoStudents) };
    }

    const response = await apiClient.get('/students');
    return { data: ensureArray(unwrapData(response)) };
  },

  createStudent: async (data: any) => {
    if (FRONTEND_ONLY) {
      const students = getFrontendCollection(FRONTEND_STORE_KEYS.students, demoStudents);
      const nextStudent = {
        id: `stu-${Date.now()}`,
        ...data,
        createdAt: nowIso(),
      };
      const next = [nextStudent, ...students];
      writeCollection(FRONTEND_STORE_KEYS.students, next);
      return { data: nextStudent };
    }

    const response = await apiClient.post('/students', data);
    return { data: unwrapData(response) };
  },

  updateStudent: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const students = getFrontendCollection(FRONTEND_STORE_KEYS.students, demoStudents);
      const next = students.map((student: any) =>
        String(student.id) === String(id) ? { ...student, ...data, updatedAt: nowIso() } : student
      );
      writeCollection(FRONTEND_STORE_KEYS.students, next);
      return { data: next.find((student: any) => String(student.id) === String(id)) };
    }

    const response = await apiClient.put(`/students/${id}`, data);
    return { data: unwrapData(response) };
  },

  deleteStudent: async (id: string) => {
    if (FRONTEND_ONLY) {
      const students = getFrontendCollection(FRONTEND_STORE_KEYS.students, demoStudents);
      const next = students.filter((student: any) => String(student.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.students, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/students/${id}`);
    return { data: unwrapData(response) };
  },

  getAllUsers: async () => {
    if (FRONTEND_ONLY) {
      return { data: [] };
    }

    const response = await apiClient.get('/users');
    return { data: response.data?.data || response.data };
  },

  updateUser: async (id: string, data: any) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return { data: response.data?.data || response.data };
  },

  getPlans: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendPlansCollection() };
    }

    const response = await apiClient.get('/plans');
    return { data: response.data?.data || response.data };
  },

  getCampaigns: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.campaigns, demoCampaigns) };
    }

    const response = await apiClient.get('/admin/campaigns');
    return { data: response.data?.data || response.data };
  },

  createCampaign: async (data: any) => {
    if (FRONTEND_ONLY) {
      const campaigns = getFrontendCollection(FRONTEND_STORE_KEYS.campaigns, demoCampaigns);
      const nextCampaign = { id: `camp-${Date.now()}`, ...data, createdAt: nowIso() };
      const next = [nextCampaign, ...campaigns];
      writeCollection(FRONTEND_STORE_KEYS.campaigns, next);
      return { data: nextCampaign };
    }

    const response = await apiClient.post('/admin/campaigns', data);
    return { data: response.data?.data || response.data };
  },

  updateCampaign: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const campaigns = getFrontendCollection(FRONTEND_STORE_KEYS.campaigns, demoCampaigns);
      const next = campaigns.map((item: any) =>
        String(item.id) === String(id) ? { ...item, ...data, updatedAt: nowIso() } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.campaigns, next);
      return { data: next.find((item: any) => String(item.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/campaigns/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteCampaign: async (id: string) => {
    if (FRONTEND_ONLY) {
      const campaigns = getFrontendCollection(FRONTEND_STORE_KEYS.campaigns, demoCampaigns);
      const next = campaigns.filter((item: any) => String(item.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.campaigns, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/campaigns/${id}`);
    return { data: response.data?.data || response.data };
  },

  getColleges: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.colleges, demoColleges) };
    }

    const response = await apiClient.get('/admin/colleges');
    return { data: response.data?.data || response.data };
  },

  createCollege: async (data: any) => {
    if (FRONTEND_ONLY) {
      const colleges = getFrontendCollection(FRONTEND_STORE_KEYS.colleges, demoColleges);
      const nextCollege = { id: `college-${Date.now()}`, ...data };
      const next = [nextCollege, ...colleges];
      writeCollection(FRONTEND_STORE_KEYS.colleges, next);
      return { data: nextCollege };
    }

    const response = await apiClient.post('/admin/colleges', data);
    return { data: response.data?.data || response.data };
  },

  updateCollege: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const colleges = getFrontendCollection(FRONTEND_STORE_KEYS.colleges, demoColleges);
      const next = colleges.map((item: any) =>
        String(item.id) === String(id) ? { ...item, ...data } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.colleges, next);
      return { data: next.find((item: any) => String(item.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/colleges/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteCollege: async (id: string) => {
    if (FRONTEND_ONLY) {
      const colleges = getFrontendCollection(FRONTEND_STORE_KEYS.colleges, demoColleges);
      const next = colleges.filter((item: any) => String(item.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.colleges, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/colleges/${id}`);
    return { data: response.data?.data || response.data };
  },

  getEvents: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.events, demoEvents) };
    }

    const response = await apiClient.get('/events');
    return { data: response.data?.data || response.data };
  },

  getLeads: async () => {
    if (FRONTEND_ONLY) {
      return { data: getFrontendCollection(FRONTEND_STORE_KEYS.leads, demoLeads) };
    }

    const response = await apiClient.get('/leads');
    return { data: response.data?.data || response.data };
  },

  createLead: async (data: any) => {
    if (FRONTEND_ONLY) {
      const leads = getFrontendCollection(FRONTEND_STORE_KEYS.leads, demoLeads);
      const nextLead = {
        id: `lead-${Date.now()}`,
        status: 'new',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        ...data,
      };
      const next = [nextLead, ...leads];
      writeCollection(FRONTEND_STORE_KEYS.leads, next);
      return { data: nextLead };
    }

    const response = await apiClient.post('/leads', data);
    return { data: response.data?.data || response.data };
  },

  updateLeadStatus: async (id: string, status: string) => {
    if (FRONTEND_ONLY) {
      const leads = getFrontendCollection(FRONTEND_STORE_KEYS.leads, demoLeads);
      const next = leads.map((item: any) =>
        String(item.id) === String(id) ? { ...item, status, updatedAt: nowIso() } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.leads, next);
      return { data: next.find((item: any) => String(item.id) === String(id)) };
    }

    const response = await apiClient.patch(`/leads/${id}/status`, { status });
    return { data: response.data?.data || response.data };
  },

  deleteLead: async (id: string) => {
    if (FRONTEND_ONLY) {
      const leads = getFrontendCollection(FRONTEND_STORE_KEYS.leads, demoLeads);
      const next = leads.filter((item: any) => String(item.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.leads, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/leads/${id}`);
    return { data: response.data?.data || response.data };
  },

  createEvent: async (data: any) => {
    if (FRONTEND_ONLY) {
      const events = getFrontendCollection(FRONTEND_STORE_KEYS.events, demoEvents);
      const nextEvent = { id: `event-${Date.now()}`, ...data };
      const next = [nextEvent, ...events];
      writeCollection(FRONTEND_STORE_KEYS.events, next);
      return { data: nextEvent };
    }

    const response = await apiClient.post('/events', data);
    return { data: response.data?.data || response.data };
  },

  updateEvent: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const events = getFrontendCollection(FRONTEND_STORE_KEYS.events, demoEvents);
      const next = events.map((item: any) =>
        String(item.id) === String(id) ? { ...item, ...data } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.events, next);
      return { data: next.find((item: any) => String(item.id) === String(id)) };
    }

    const response = await apiClient.put(`/events/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteEvent: async (id: string) => {
    if (FRONTEND_ONLY) {
      const events = getFrontendCollection(FRONTEND_STORE_KEYS.events, demoEvents);
      const next = events.filter((item: any) => String(item.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.events, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/events/${id}`);
    return { data: response.data?.data || response.data };
  },

  login: async (email: string, password?: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return { data: response.data?.data || response.data };
  },

  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return { data: response.data?.data || response.data };
  },

  createSubscription: async (planId: string) => {
    const response = await apiClient.post('/payments/create-subscription', { planId });
    return { data: response.data?.data || response.data };
  },

  createOrder: async (orderData: any) => {
    const response = await apiClient.post('/payments/create-order', orderData);
    return { data: response.data?.data || response.data };
  },

  verifyPayment: async (paymentData: any) => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return { data: response.data?.data || response.data };
  },

  getAdminPlans: async () => {
    if (FRONTEND_ONLY) {
      const plans = getFrontendPlansCollection();
      const totalRevenue = plans.reduce((sum: number, plan: any) => sum + Number(plan.revenueGenerated || 0), 0);
      const totalSubscribers = plans.reduce((sum: number, plan: any) => sum + Number(plan.subscriberCount || 0), 0);
      const stats = {
        totalPlans: plans.length,
        activePlans: plans.filter((plan: any) => !!plan.isActive).length,
        totalSubscribers,
        totalRevenue,
        totalRevenueFormatted: `INR ${totalRevenue.toLocaleString('en-IN')}`,
        averageRevenuePerUser: totalSubscribers ? Math.round(totalRevenue / totalSubscribers) : 0,
        averageRevenuePerUserFormatted: `INR ${totalSubscribers ? Math.round(totalRevenue / totalSubscribers).toLocaleString('en-IN') : '0'}`,
        mostPopularPlan: plans.sort((a: any, b: any) => Number(b.subscriberCount || 0) - Number(a.subscriberCount || 0))[0]?.name || 'N/A',
        planDistribution: plans.map((plan: any, index: number) => ({
          name: plan.name,
          value: Number(plan.subscriberCount || 0),
          color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4],
        })),
      };
      return { data: { plans, stats } };
    }

    const response = await apiClient.get('/admin/plans');
    return { data: normalizeListWithStats(unwrapData(response), 'plans') };
  },

  createAdminPlan: async (planData: any) => {
    if (FRONTEND_ONLY) {
      const plans = getFrontendPlansCollection();
      const nextPlan = {
        id: `plan-${Date.now()}`,
        isActive: true,
        subscriberCount: 0,
        revenueGenerated: 0,
        createdAt: nowIso(),
        type: planData.type || 'student',
        ...planData,
      };
      const next = [nextPlan, ...plans];
      writeCollection(FRONTEND_STORE_KEYS.plans, next);
      return { data: nextPlan };
    }

    const response = await apiClient.post('/admin/plans', planData);
    return { data: response.data?.data || response.data };
  },

  updateAdminPlan: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const plans = getFrontendPlansCollection();
      const next = plans.map((plan: any) =>
        String(plan.id) === String(id) ? { ...plan, ...data } : plan
      );
      writeCollection(FRONTEND_STORE_KEYS.plans, next);
      return { data: next.find((plan: any) => String(plan.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/plans/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteAdminPlan: async (id: string) => {
    if (FRONTEND_ONLY) {
      const plans = getFrontendPlansCollection();
      const next = plans.filter((plan: any) => String(plan.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.plans, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/plans/${id}`);
    return { data: response.data?.data || response.data };
  },

  toggleAdminPlanStatus: async (id: string, isActive: boolean) => {
    if (FRONTEND_ONLY) {
      const plans = getFrontendPlansCollection();
      const next = plans.map((plan: any) =>
        String(plan.id) === String(id) ? { ...plan, isActive } : plan
      );
      writeCollection(FRONTEND_STORE_KEYS.plans, next);
      return { data: next.find((plan: any) => String(plan.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/plans/${id}/status`, { isActive });
    return { data: response.data?.data || response.data };
  },

  syncAdminPlan: async (id: string) => {
    if (FRONTEND_ONLY) {
      return { data: { id, synced: true, syncedAt: nowIso() } };
    }

    const response = await apiClient.post(`/admin/plans/${id}/sync`);
    return { data: response.data?.data || response.data };
  },

  // Job Methods
  getAdminJobs: async () => {
    if (FRONTEND_ONLY) {
      const jobs = getFrontendCollection(FRONTEND_STORE_KEYS.jobs, demoJobs as any[]);
      return { data: { jobs, stats: computeJobStats(jobs) } };
    }

    const response = await apiClient.get('/admin/jobs');
    return { data: normalizeListWithStats(unwrapData(response), 'jobs') };
  },

  createAdminJob: async (data: any) => {
    if (FRONTEND_ONLY) {
      const jobs = getFrontendCollection(FRONTEND_STORE_KEYS.jobs, demoJobs as any[]);
      const nextJob = {
        id: `job-${Date.now()}`,
        applications: 0,
        views: 0,
        status: 'Active',
        postedAt: nowIso(),
        createdAt: nowIso(),
        ...data,
      };
      const next = [nextJob, ...jobs];
      writeCollection(FRONTEND_STORE_KEYS.jobs, next);
      return { data: nextJob };
    }

    const response = await apiClient.post('/admin/jobs', data);
    return { data: response.data?.data || response.data };
  },

  updateAdminJob: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const jobs = getFrontendCollection(FRONTEND_STORE_KEYS.jobs, demoJobs as any[]);
      const next = jobs.map((job: any) =>
        String(job.id) === String(id) ? { ...job, ...data, updatedAt: nowIso() } : job
      );
      writeCollection(FRONTEND_STORE_KEYS.jobs, next);
      return { data: next.find((job: any) => String(job.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/jobs/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteAdminJob: async (id: string) => {
    if (FRONTEND_ONLY) {
      const jobs = getFrontendCollection(FRONTEND_STORE_KEYS.jobs, demoJobs as any[]);
      const next = jobs.filter((job: any) => String(job.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.jobs, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/jobs/${id}`);
    return { data: response.data?.data || response.data };
  },

  // Internship Methods
  getAdminInternships: async () => {
    if (FRONTEND_ONLY) {
      const internships = getFrontendCollection(FRONTEND_STORE_KEYS.internships, demoInternships as any[]);
      return { data: { internships, stats: computeInternshipStats(internships) } };
    }

    const response = await apiClient.get('/admin/internships');
    return { data: normalizeListWithStats(unwrapData(response), 'internships') };
  },

  createAdminInternship: async (data: any) => {
    if (FRONTEND_ONLY) {
      const internships = getFrontendCollection(FRONTEND_STORE_KEYS.internships, demoInternships as any[]);
      const nextInternship = {
        id: `internship-${Date.now()}`,
        applications: 0,
        views: 0,
        status: 'Active',
        postedAt: nowIso(),
        createdAt: nowIso(),
        ...data,
      };
      const next = [nextInternship, ...internships];
      writeCollection(FRONTEND_STORE_KEYS.internships, next);
      return { data: nextInternship };
    }

    const response = await apiClient.post('/admin/internships', data);
    return { data: response.data?.data || response.data };
  },

  updateAdminInternship: async (id: string, data: any) => {
    if (FRONTEND_ONLY) {
      const internships = getFrontendCollection(FRONTEND_STORE_KEYS.internships, demoInternships as any[]);
      const next = internships.map((item: any) =>
        String(item.id) === String(id) ? { ...item, ...data, updatedAt: nowIso() } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.internships, next);
      return { data: next.find((item: any) => String(item.id) === String(id)) };
    }

    const response = await apiClient.put(`/admin/internships/${id}`, data);
    return { data: response.data?.data || response.data };
  },

  deleteAdminInternship: async (id: string) => {
    if (FRONTEND_ONLY) {
      const internships = getFrontendCollection(FRONTEND_STORE_KEYS.internships, demoInternships as any[]);
      const next = internships.filter((item: any) => String(item.id) !== String(id));
      writeCollection(FRONTEND_STORE_KEYS.internships, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/internships/${id}`);
    return { data: response.data?.data || response.data };
  },

  getAdminPayments: async () => {
    if (FRONTEND_ONLY) {
      const transactions = getFrontendCollection(FRONTEND_STORE_KEYS.payments, demoPayments as any[]);
      return { data: { transactions, summary: computePaymentSummary(transactions) } };
    }

    const response = await apiClient.get('/admin/payments');
    const raw = unwrapData(response);
    if (Array.isArray(raw)) {
      return { data: { transactions: raw, summary: null } };
    }

    return {
      data: {
        ...(raw && typeof raw === 'object' ? raw : {}),
        transactions: ensureArray(raw?.transactions ?? raw?.items ?? raw?.results),
        summary: raw?.summary ?? null,
      },
    };
  },

  getPaymentHistory: async (userId?: string) => {
    const response = await apiClient.get('/payments/history', {
      params: userId ? { userId } : undefined,
    });
    return { data: response.data?.data || response.data };
  },

  getSubscriptionStatus: async (userId: string) => {
    const response = await apiClient.get(`/subscriptions/status/${userId}`);
    return { data: response.data?.data || response.data };
  },

  getAdminSubscriptions: async () => {
    if (FRONTEND_ONLY) {
      const subscriptions = getFrontendCollection(FRONTEND_STORE_KEYS.subscriptions, demoSubscriptions as any[]);
      return { data: { subscriptions, stats: computeSubscriptionStats(subscriptions) } };
    }

    const response = await apiClient.get('/admin/subscriptions');
    return { data: normalizeListWithStats(unwrapData(response), 'subscriptions') };
  },

  updateSubscriptionStatus: async (subscriptionId: string, status: string) => {
    if (FRONTEND_ONLY) {
      const subscriptions = getFrontendCollection(FRONTEND_STORE_KEYS.subscriptions, demoSubscriptions as any[]);
      const next = subscriptions.map((item: any) =>
        String(item.id) === String(subscriptionId) ? { ...item, status } : item
      );
      writeCollection(FRONTEND_STORE_KEYS.subscriptions, next);
      return { data: next.find((item: any) => String(item.id) === String(subscriptionId)) };
    }

    const response = await apiClient.put(`/admin/subscriptions/${subscriptionId}/status`, { status });
    return { data: response.data?.data || response.data };
  },

  deleteSubscription: async (subscriptionId: string) => {
    if (FRONTEND_ONLY) {
      const subscriptions = getFrontendCollection(FRONTEND_STORE_KEYS.subscriptions, demoSubscriptions as any[]);
      const next = subscriptions.filter((item: any) => String(item.id) !== String(subscriptionId));
      writeCollection(FRONTEND_STORE_KEYS.subscriptions, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/admin/subscriptions/${subscriptionId}`);
    return { data: response.data?.data || response.data };
  },

  // Notification Methods
  getNotifications: async (userId: string) => {
    if (FRONTEND_ONLY) {
      const notifications = getFrontendCollection(FRONTEND_STORE_KEYS.notifications, demoNotifications as any[])
        .filter((item: any) => !userId || String(item.userId) === String(userId));
      return { data: normalizeNotifications({ notifications }) };
    }

    const response = await apiClient.get('/notifications', { params: { userId } });
    return { data: normalizeNotifications(unwrapData(response)) };
  },

  markNotificationAsRead: async (notificationId: string) => {
    if (FRONTEND_ONLY) {
      const notifications = getFrontendCollection(FRONTEND_STORE_KEYS.notifications, demoNotifications as any[]);
      const next = notifications.map((item: any) =>
        String(item.id) === String(notificationId)
          ? { ...item, read: true }
          : item
      );
      writeCollection(FRONTEND_STORE_KEYS.notifications, next);
      return { data: { success: true } };
    }

    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return { data: response.data?.data || response.data };
  },

  markAllNotificationsAsRead: async (userId: string) => {
    if (FRONTEND_ONLY) {
      const notifications = getFrontendCollection(FRONTEND_STORE_KEYS.notifications, demoNotifications as any[]);
      const next = notifications.map((item: any) =>
        String(item.userId) === String(userId)
          ? { ...item, read: true }
          : item
      );
      writeCollection(FRONTEND_STORE_KEYS.notifications, next);
      return { data: { success: true } };
    }

    const response = await apiClient.patch('/notifications/read-all', { userId });
    return { data: response.data?.data || response.data };
  },

  deleteNotification: async (notificationId: string) => {
    if (FRONTEND_ONLY) {
      const notifications = getFrontendCollection(FRONTEND_STORE_KEYS.notifications, demoNotifications as any[]);
      const next = notifications.filter((item: any) => String(item.id) !== String(notificationId));
      writeCollection(FRONTEND_STORE_KEYS.notifications, next);
      return { data: { success: true } };
    }

    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return { data: response.data?.data || response.data };
  },

  getNotificationPreferences: async (userId: string) => {
    if (FRONTEND_ONLY) {
      const allPrefs = getFrontendCollection(
        FRONTEND_STORE_KEYS.notificationPreferences,
        demoNotificationPreferences as any[]
      );
      const found = allPrefs.find((item: any) => String(item.userId) === String(userId));
      return { data: found || demoNotificationPreferences[0] };
    }

    const response = await apiClient.get(`/notifications/preferences/${userId}`);
    return { data: response.data?.data || response.data };
  },

  updateNotificationPreferences: async (userId: string, preferences: any) => {
    if (FRONTEND_ONLY) {
      const allPrefs = getFrontendCollection(
        FRONTEND_STORE_KEYS.notificationPreferences,
        demoNotificationPreferences as any[]
      );
      const exists = allPrefs.some((item: any) => String(item.userId) === String(userId));
      const next = exists
        ? allPrefs.map((item: any) =>
            String(item.userId) === String(userId)
              ? { ...item, ...preferences, userId }
              : item
          )
        : [{ ...preferences, userId }, ...allPrefs];
      writeCollection(FRONTEND_STORE_KEYS.notificationPreferences, next);
      return { data: next.find((item: any) => String(item.userId) === String(userId)) };
    }

    const response = await apiClient.put(`/notifications/preferences/${userId}`, preferences);
    return { data: response.data?.data || response.data };
  },

  // Webinar Methods
  getWebinars: async (userId?: string) => {
    const response = await apiClient.get('/webinars', {
      params: userId ? { userId } : undefined,
    });
    return { data: normalizeWebinars(unwrapData(response)) };
  },

  registerForWebinar: async (webinarId: string, userId: string) => {
    const response = await apiClient.post(`/webinars/${webinarId}/register`, { userId });
    return { data: response.data?.data || response.data };
  },

  unregisterFromWebinar: async (webinarId: string, userId: string) => {
    const response = await apiClient.post(`/webinars/${webinarId}/unregister`, { userId });
    return { data: response.data?.data || response.data };
  },

  getWebinarRegistrations: async (userId: string) => {
    const response = await apiClient.get(`/webinars/registrations/${userId}`);
    return { data: response.data?.data || response.data };
  },

  getWebinarPreferences: async (userId: string) => {
    const response = await apiClient.get(`/webinars/preferences/${userId}`);
    return { data: response.data?.data || response.data };
  },

  updateWebinarPreferences: async (userId: string, preferences: any) => {
    const response = await apiClient.put(`/webinars/preferences/${userId}`, preferences);
    return { data: response.data?.data || response.data };
  },

  // Course Methods
  getCourses: async () => {
    const response = await apiClient.get('/courses');
    return { data: normalizeListWithStats(unwrapData(response), 'courses') };
  },

  getEnrolledCourses: async (userId?: string) => {
    const response = await apiClient.get('/courses/enrolled', {
      params: userId ? { userId } : undefined,
    });
    return { data: normalizeListWithStats(unwrapData(response), 'courses') };
  },

  updateCourseProgress: async (courseId: string, progress: number) => {
    const response = await apiClient.patch(`/courses/${courseId}/progress`, { progress });
    return { data: response.data?.data || response.data };
  },

  // Interview Methods
  getInterviews: async (userId?: string) => {
    const response = await apiClient.get('/interviews', {
      params: userId ? { userId } : undefined,
    });
    return { data: response.data?.data || response.data };
  },

  rescheduleInterview: async (interviewId: string, newDate: string, newTime: string) => {
    const response = await apiClient.patch(`/interviews/${interviewId}/reschedule`, {
      newDate,
      newTime,
    });
    return { data: response.data?.data || response.data };
  },

  cancelInterview: async (interviewId: string) => {
    const response = await apiClient.delete(`/interviews/${interviewId}`);
    return { data: response.data?.data || response.data };
  },

  // Assessment Methods
  getAssessments: async (userId?: string) => {
    const response = await apiClient.get('/assessments', {
      params: userId ? { userId } : undefined,
    });
    return { data: response.data?.data || response.data };
  },

  startAssessment: async (assessmentId: string) => {
    const response = await apiClient.post(`/assessments/${assessmentId}/start`);
    return { data: response.data?.data || response.data };
  },

  submitAssessment: async (assessmentId: string, answers: Record<string, string>) => {
    const response = await apiClient.post(`/assessments/${assessmentId}/submit`, { answers });
    return { data: response.data?.data || response.data };
  },

  getAssessmentResult: async (assessmentId: string) => {
    const response = await apiClient.get(`/assessments/${assessmentId}/result`);
    return { data: response.data?.data || response.data };
  }
};

export default apiService;
