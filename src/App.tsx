import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import MainLayout from "@/src/layouts/MainLayout";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import AdminLayout from "@/src/layouts/AdminLayout";
import EmployerLayout from "@/src/layouts/EmployerLayout";
import ErrorBoundary from "@/src/components/common/ErrorBoundary";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-50">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Lazy Loaded Public Pages
const Home = lazy(() => import("@/src/pages/public/Home"));
const Jobs = lazy(() => import("@/src/pages/public/Jobs"));
const JobDetails = lazy(() => import("@/src/pages/public/JobDetails"));
const Login = lazy(() => import("@/src/pages/public/Login"));
const Register = lazy(() => import("@/src/pages/public/Register"));
const About = lazy(() => import("@/src/pages/public/About"));
const Contact = lazy(() => import("@/src/pages/public/Contact"));
const CollegeCollaboration = lazy(() => import("@/src/pages/public/CollegeCollaboration"));
const Events = lazy(() => import("@/src/pages/public/Events"));
const Blog = lazy(() => import("@/src/pages/public/Blog"));
const AdminLogin = lazy(() => import("@/src/pages/public/AdminLogin"));
const NotFound = lazy(() => import("@/src/pages/public/NotFound"));
const Privacy = lazy(() => import("@/src/pages/public/Privacy"));
const Terms = lazy(() => import("@/src/pages/public/Terms"));
const Cookies = lazy(() => import("@/src/pages/public/Cookies"));
const Programs = lazy(() => import("@/src/pages/public/Programs"));

// Lazy Loaded Employer Pages
const EmployerDashboard = lazy(() => import("@/src/pages/employer/EmployerDashboard"));
const PostJob = lazy(() => import("@/src/pages/employer/PostJob"));
const ApplicantManagement = lazy(() => import("@/src/pages/employer/ApplicantManagement"));
const InterviewManagement = lazy(() => import("@/src/pages/employer/InterviewManagement"));
const EmployerProfile = lazy(() => import("@/src/pages/employer/EmployerProfile"));
const EmployerSubscription = lazy(() => import("@/src/pages/employer/Subscriptions"));
const EmployerConclaves = lazy(() => import("@/src/pages/employer/Conclaves"));

// Lazy Loaded Student Dashboard Pages
const DashboardHome = lazy(() => import("@/src/pages/dashboard/DashboardHome"));
const ResumeBuilder = lazy(() => import("@/src/pages/dashboard/ResumeBuilder"));
const Profile = lazy(() => import("@/src/pages/dashboard/Profile"));
const StudentJobs = lazy(() => import("@/src/pages/dashboard/Jobs"));
const StudentInterviews = lazy(() => import("@/src/pages/dashboard/Interviews"));
const StudentSubscriptions = lazy(() => import("@/src/pages/dashboard/Subscriptions"));
const StudentNotifications = lazy(() => import("@/src/pages/dashboard/Notifications"));
const StudentWebinars = lazy(() => import("@/src/pages/dashboard/Webinars"));
const StudentLinkedIn = lazy(() => import("@/src/pages/dashboard/LinkedInSupport"));
const StudentSettings = lazy(() => import("@/src/pages/dashboard/Settings"));
const StudentApplications = lazy(() => import("@/src/pages/dashboard/Applications"));
const StudentCourses = lazy(() => import("@/src/pages/dashboard/Courses"));
const StudentAssessments = lazy(() => import("@/src/pages/dashboard/Assessments"));

// Lazy Loaded Admin Panel Pages
const AdminDashboard = lazy(() => import("@/src/pages/admin/AdminDashboard"));
const AdminStudents = lazy(() => import("@/src/pages/admin/Students"));
const AdminJobs = lazy(() => import("@/src/pages/admin/Jobs"));
const AdminInternships = lazy(() => import("@/src/pages/admin/Internships"));
const AdminPlans = lazy(() => import("@/src/pages/admin/Plans"));
const AdminPayments = lazy(() => import("@/src/pages/admin/Payments"));
const AdminCampaigns = lazy(() => import("@/src/pages/admin/Campaigns"));
const AdminColleges = lazy(() => import("@/src/pages/admin/Colleges"));
const AdminEvents = lazy(() => import("@/src/pages/admin/Events"));
const AdminReports = lazy(() => import("@/src/pages/admin/Reports"));
const AdminManagement = lazy(() => import("@/src/pages/admin/AdminManagement"));
const AdminCourses = lazy(() => import("@/src/pages/admin/Courses"));
const AdminLeads = lazy(() => import("@/src/pages/admin/Leads"));
const AdminSettings = lazy(() => import("@/src/pages/admin/Settings"));
const AdminSubscriptions = lazy(() => import("@/src/pages/admin/Subscriptions"));

import { AnimatePresence, motion } from "motion/react";
import LeadCaptureModal from "@/src/components/common/LeadCaptureModal";
import WhatsAppButton from "@/src/components/common/WhatsAppButton";
import PaymentFlow from "@/src/components/common/PaymentFlow";
import { useAnalytics } from "@/src/hooks/useAnalytics";
import { useAuthStore } from "@/src/store/authStore";
import { useUIStore } from "@/src/store/uiStore";

export const PaymentContext = React.createContext<{
  isPaymentOpen: boolean;
  openPayment: (planId: string, planName: string) => void;
  closePayment: () => void;
} | null>(null);

function AnimatedRoutes() {
  const location = useLocation();
  useAnalytics();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="programs" element={<Programs />} />
          <Route path="about" element={<About />} />
          <Route path="collaboration" element={<CollegeCollaboration />} />
          <Route path="events" element={<Events />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="register" element={<Register />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Student Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="linkedin" element={<StudentLinkedIn />} />
          <Route path="jobs" element={<StudentJobs />} />
          <Route path="interviews" element={<StudentInterviews />} />
          <Route path="subscription" element={<StudentSubscriptions />} />
          <Route path="subscriptions" element={<StudentSubscriptions />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="webinars" element={<StudentWebinars />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:id" element={<StudentCourses />} />
          <Route path="assessments" element={<StudentAssessments />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Employer Dashboard Routes */}
        <Route 
          path="/employer" 
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployerDashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="applicants" element={<ApplicantManagement />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="subscription" element={<EmployerSubscription />} />
          <Route path="conclaves" element={<EmployerConclaves />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Panel Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="internships" element={<AdminInternships />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="colleges" element={<AdminColleges />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="management" element={<AdminManagement />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const theme = useUIStore((state) => state.theme);
  const [paymentState, setPaymentState] = useState<{ isOpen: boolean; planId?: string; planName?: string }>({
    isOpen: false,
  });

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const openPayment = (planId: string, planName: string) => {
    setPaymentState({ isOpen: true, planId, planName });
  };

  const closePayment = () => {
    setPaymentState({ isOpen: false });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaymentContext.Provider value={{ isPaymentOpen: paymentState.isOpen, openPayment, closePayment }}>
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  color: '#1e293b',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: '#9333ea',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <LeadCaptureModal />
            <PaymentFlow
              isOpen={paymentState.isOpen}
              onClose={closePayment}
              planId={paymentState.planId}
              planName={paymentState.planName}
            />
            <WhatsAppButton />
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </ErrorBoundary>
        </Router>
      </PaymentContext.Provider>
    </QueryClientProvider>
  );
}
