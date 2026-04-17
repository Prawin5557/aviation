import toast from "react-hot-toast";
import apiClient from "@/src/services/apiClient";
import { ENV } from "@/src/config/env";
import type { Plan } from "@/src/types";

// Mock Data
const MOCK_JOBS = [
  {
    id: "1",
    title: "Cabin Crew Internship",
    company: "Emirates",
    location: "Dubai, UAE",
    type: "Internship",
    salary: "$10,000 - $14,000",
    experience: "0-1 Years",
    description: "Gain hands-on cabin crew experience with global service standards and passenger care training.",
    requirements: ["Strong communication", "Hospitality mindset", "Willingness to work flexible hours"],
    postedAt: "2 days ago",
    category: "Cabin Crew",
    logo: "https://picsum.photos/seed/emirates/100/100",
    status: "Active"
  },
  {
    id: "2",
    title: "A320 Captain",
    company: "Qatar Airways",
    location: "Doha, Qatar",
    type: "Full-time",
    salary: "$120,000 - $180,000",
    experience: "10+ Years",
    description: "Seeking experienced A320 Captains for our expanding fleet. High standards of safety and professionalism required.",
    requirements: ["5000+ total hours", "1000+ hours on type", "ATPL License"],
    postedAt: "1 week ago",
    category: "Pilot",
    logo: "https://picsum.photos/seed/qatar/100/100",
    status: "Active"
  },
  {
    id: "3",
    title: "Aircraft Maintenance Engineer",
    company: "Lufthansa Technik",
    location: "Frankfurt, Germany",
    type: "Full-time",
    salary: "€55,000 - €75,000",
    experience: "3-5 Years",
    description: "Perform line and base maintenance on various aircraft types. Ensure airworthiness and safety compliance.",
    requirements: ["EASA Part 66 B1/B2", "Type rating preferred", "Fluent English"],
    postedAt: "3 days ago",
    category: "Engineering",
    logo: "https://picsum.photos/seed/lufthansa/100/100",
    status: "Active"
  },
  {
    id: "4",
    title: "Ground Operations Manager",
    company: "Delta Air Lines",
    location: "Atlanta, USA",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    experience: "5-10 Years",
    description: "Oversee ground handling operations, ensuring efficiency and safety in ramp and gate activities.",
    requirements: ["5+ years management", "Aviation ops background", "Strong leadership"],
    postedAt: "5 days ago",
    category: "Operations",
    logo: "https://picsum.photos/seed/delta/100/100",
    status: "Active"
  },
  {
    id: "5",
    title: "Air Traffic Controller",
    company: "NATS",
    location: "London, UK",
    type: "Full-time",
    salary: "£60,000 - £90,000",
    experience: "5+ Years",
    description: "Manage safe and efficient flow of air traffic in controlled airspace.",
    requirements: ["ATC License", "High stress tolerance", "Medical Class 3"],
    postedAt: "4 days ago",
    category: "Operations",
    logo: "https://picsum.photos/seed/nats/100/100",
    status: "Active"
  }
];

const MOCK_APPLICATIONS = [
  {
    id: "app1",
    jobId: "1",
    userId: "student1",
    status: "Under Review",
    appliedAt: "2024-03-10",
    name: "John Doe",
    experience: "2 years",
    score: 85,
    job: MOCK_JOBS[0],
    job_details: { title: MOCK_JOBS[0].title, company: MOCK_JOBS[0].company }
  },
  {
    id: "app2",
    jobId: "3",
    userId: "student1",
    status: "Interview Scheduled",
    appliedAt: "2024-03-12",
    name: "John Doe",
    experience: "2 years",
    score: 92,
    job: MOCK_JOBS[2],
    job_details: { title: MOCK_JOBS[2].title, company: MOCK_JOBS[2].company }
  }
];

const MOCK_SAVED_JOBS_BY_USER: Record<string, string[]> = {
  student1: ["1", "3"]
};

const MOCK_STUDENTS = [
  { 
    id: "student1", 
    name: "John Doe", 
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com", 
    phone: "+91 98765 43210",
    role: "student", 
    status: "Active", 
    joinedAt: "2024-01-15",
    joined: "2024-01-15",
    createdAt: "2024-01-15",
    photoURL: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    skills: ["Communication", "Safety", "A320 Type Rating"],
    experience: "2 Years"
  },
  { 
    id: "student2", 
    name: "Jane Smith", 
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com", 
    phone: "+91 87654 32109",
    role: "student", 
    status: "Active", 
    joinedAt: "2024-02-20",
    joined: "2024-02-20",
    createdAt: "2024-02-20",
    photoURL: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    skills: ["Ground Ops", "Management", "Logistics"],
    experience: "4 Years"
  }
];

const MOCK_LEADS = [
  { 
    id: "lead1", 
    name: "Rahul Sharma", 
    email: "rahul@example.com", 
    phone: "+91 99887 76655", 
    interest: "Pilot Training", 
    source: "program_interest" as const,
    status: "new" as const,
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z"
  },
  { 
    id: "lead2", 
    name: "Priya Patel", 
    email: "priya@example.com", 
    phone: "+91 88776 65544", 
    interest: "Cabin Crew Training", 
    source: "course_enroll" as const,
    status: "contacted" as const,
    createdAt: "2024-03-14T14:20:00Z",
    updatedAt: "2024-03-16T09:00:00Z"
  },
  { 
    id: "lead3", 
    name: "Amit Kumar", 
    email: "amit@example.com", 
    phone: "+91 77665 54433", 
    interest: "MRO Engineering", 
    source: "job_apply" as const,
    status: "qualified" as const,
    createdAt: "2024-03-10T16:45:00Z",
    updatedAt: "2024-03-18T11:30:00Z"
  },
  { 
    id: "lead4", 
    name: "Sneha Reddy", 
    email: "sneha@example.com", 
    phone: "+91 96543 21098", 
    interest: "Ground Operations", 
    source: "contact_form" as const,
    status: "new" as const,
    createdAt: "2024-03-17T08:15:00Z",
    updatedAt: "2024-03-17T08:15:00Z"
  },
  { 
    id: "lead5", 
    name: "Vikram Singh", 
    email: "vikram@example.com", 
    phone: "+91 87654 32109", 
    interest: "Aviation Management", 
    source: "newsletter" as const,
    status: "converted" as const,
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-03-20T15:45:00Z"
  }
];

const MOCK_PLANS: Plan[] = [
  { 
    id: "prime", 
    name: "Prime", 
    price: 4999, 
    features: [
      "Job Alerts & Notifications",
      "Resume Builder (Basic)",
      "Limited Applications (10/month)",
      "Access to Job Board",
      "Email Support"
    ],
    period: "month",
    description: "Perfect for students starting their aviation journey.",
    permissions: ["view_jobs", "apply_jobs", "resume_builder"],
    razorpay_plan_id: "plan_prime",
    type: "student"
  },
  { 
    id: "premium", 
    name: "Premium", 
    price: 14999, 
    features: [
      "Everything in Prime",
      "AI Career Coach",
      "Priority Applications",
      "Resume Optimization",
      "Interview Preparation Module",
      "Unlimited Applications",
      "Priority Support"
    ],
    period: "month",
    description: "Advanced tools for serious aviation professionals.",
    permissions: ["view_jobs", "apply_jobs", "resume_builder", "ai_coach", "priority", "interview_prep", "unlimited_applications"],
    razorpay_plan_id: "plan_premium",
    type: "student"
  },
  { 
    id: "placement", 
    name: "Placement", 
    price: 99999, 
    features: [
      "Everything in Premium",
      "1-on-1 Career Mentorship",
      "Guaranteed Interview Opportunities",
      "LinkedIn Profile Optimization",
      "Direct Employer Connections",
      "Placement Assistance",
      "Lifetime Access to Resources",
      "Dedicated Account Manager"
    ],
    period: "one-time",
    description: "The ultimate placement guarantee package for serious aviation careers.",
    permissions: ["view_jobs", "apply_jobs", "resume_builder", "ai_coach", "priority", "interview_prep", "unlimited_applications", "mentorship", "linkedin_support", "placement_guarantee"],
    razorpay_plan_id: "plan_placement",
    type: "student"
  },
  { 
    id: "recruiter_starter",
    name: "Recruiter Starter",
    price: 19999,
    features: [
      "5 Active Job Posts",
      "Basic Applicant Tracking",
      "Recruiter Dashboard",
      "Email Support",
      "Candidate Shortlisting Tools"
    ],
    period: "month",
    description: "Ideal for small aviation teams hiring on-demand.",
    permissions: ["post_jobs", "view_applicants", "basic_analytics", "job_boost"],
    razorpay_plan_id: "plan_recruiter_starter",
    type: "employer"
  },
  { 
    id: "recruiter_growth",
    name: "Recruiter Growth",
    price: 49999,
    features: [
      "20 Active Job Posts",
      "Featured Employer Listing",
      "Advanced Applicant Match Scores",
      "Priority Support",
      "Recruitment Analytics"
    ],
    period: "month",
    description: "Scale your hiring with premium recruiter tools.",
    permissions: ["post_jobs", "view_applicants", "advanced_analytics", "priority_support", "featured_employer"],
    razorpay_plan_id: "plan_recruiter_growth",
    type: "employer"
  },
  { 
    id: "recruiter_enterprise",
    name: "Recruiter Enterprise",
    price: 99999,
    features: [
      "Unlimited Job Posts",
      "Enterprise ATS Integration",
      "Dedicated Hiring Partner",
      "Custom Recruitment Campaigns",
      "Executive Talent Matching"
    ],
    period: "month",
    description: "Built for enterprise recruiters and staffing firms.",
    permissions: ["post_jobs", "view_applicants", "enterprise_analytics", "dedicated_manager", "custom_campaigns"],
    razorpay_plan_id: "plan_recruiter_enterprise",
    type: "employer"
  }
];

const MOCK_CAMPAIGNS = [
  { id: "c1", name: "Summer Internship Drive", status: "Active", reach: 5000, target: "Students" },
  { id: "c2", name: "Pilot Recruitment 2024", status: "Draft", reach: 0, target: "Pilots" }
];

const MOCK_COLLEGES = [
  { id: "col1", name: "Aviation University of India", location: "Delhi", students: 1200, status: "Active" as const },
  { id: "col2", name: "Skyline Aeronautics Academy", location: "Mumbai", students: 800, status: "Active" as const }
];

const MOCK_EVENTS = [
  { id: "e1", title: "Aviation Career Fair", date: "2024-05-20", location: "Virtual", type: "Event" as const, attendees: 500, status: "Upcoming" },
  { id: "e2", title: "Pilot Training Webinar", date: "2024-04-15", location: "Online", type: "Webinar" as const, attendees: 200, status: "Upcoming" }
];

const MOCK_WEBINARS = [
  {
    id: "w1",
    title: "Aviation Career Roadmap 2024",
    description: "Join industry experts as they share insights into navigating your aviation career path, from entry-level positions to senior leadership roles.",
    speaker: "Capt. Sarah Johnson",
    speakerRole: "Senior Pilot, Emirates Airlines",
    speakerImage: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    date: "2024-04-25",
    time: "18:00",
    duration: "60 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 245,
    maxAttendees: 500,
    topics: ["Career Planning", "Industry Trends", "Interview Tips", "Salary Negotiation"],
    requirements: "Any aviation professional",
    language: "English",
    image: "https://images.unsplash.com/photo-1540575861501-7ad058df3283?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-1",
    category: "Career Development"
  },
  {
    id: "w2",
    title: "Mastering Ground Operations",
    description: "Learn advanced ground operations techniques, safety protocols, and best practices from experienced operations managers.",
    speaker: "Mark Thompson",
    speakerRole: "Operations Manager, Singapore Airlines",
    speakerImage: "https://ui-avatars.com/api/?name=Mark+Thompson&background=random",
    date: "2024-04-28",
    time: "16:00",
    duration: "90 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 167,
    maxAttendees: 400,
    topics: ["Ground Handling", "Safety Protocols", "Team Management", "Problem Solving"],
    requirements: "Ground operations background preferred",
    language: "English",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-2",
    category: "Technical Training"
  },
  {
    id: "w3",
    title: "Cabin Crew Excellence & Customer Service",
    description: "Master premium customer service skills, crisis management, and cultural sensitivity for modern cabin crew roles.",
    speaker: "Ms. Lisa Chen",
    speakerRole: "Cabin Crew Trainer, Cathay Pacific",
    speakerImage: "https://ui-avatars.com/api/?name=Lisa+Chen&background=random",
    date: "2024-05-02",
    time: "15:00",
    duration: "75 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 312,
    maxAttendees: 600,
    topics: ["Customer Service", "Safety & Security", "Cultural Awareness", "Emergency Procedures"],
    requirements: "Aspiring or current cabin crew",
    language: "English",
    image: "https://images.unsplash.com/photo-1706863527883-34ecb277a4d3?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-3",
    category: "Cabin Crew"
  },
  {
    id: "w4",
    title: "Aircraft Maintenance Engineering Excellence",
    description: "Explore the latest in aircraft maintenance, regulatory compliance, and emerging technologies in MRO.",
    speaker: "Eng. Rajesh Kumar",
    speakerRole: "Chief Engineer, Lufthansa Technik",
    speakerImage: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random",
    date: "2024-05-05",
    time: "17:30",
    duration: "120 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 89,
    maxAttendees: 300,
    topics: ["Maintenance Systems", "Regulatory Compliance", "Root Cause Analysis", "Technology Innovation"],
    requirements: "Engineering background or EASA certification",
    language: "English",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-4",
    category: "Engineering"
  },
  {
    id: "w5",
    title: "Air Traffic Control Fundamentals",
    description: "Introduction to ATC systems, communication protocols, and procedures for aspiring air traffic controllers.",
    speaker: "Dr. James Wilson",
    speakerRole: "Head of ATC Training, NATS",
    speakerImage: "https://ui-avatars.com/api/?name=James+Wilson&background=random",
    date: "2024-05-08",
    time: "14:00",
    duration: "100 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 156,
    maxAttendees: 250,
    topics: ["Communication", "Radar Systems", "Safety Procedures", "Decision Making"],
    requirements: "High school graduate, good English",
    language: "English",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-5",
    category: "Air Traffic Control"
  },
  {
    id: "w6",
    title: "Aviation Entrepreneurship & Startup Success",
    description: "Learn how to launch successful aviation businesses with founders who have scaled their ventures.",
    speaker: "Priya Verma",
    speakerRole: "Founder & CEO, SkyGenius Startup",
    speakerImage: "https://ui-avatars.com/api/?name=Priya+Verma&background=random",
    date: "2024-05-12",
    time: "18:00",
    duration: "90 minutes",
    timezone: "IST",
    status: "upcoming",
    registeredCount: 203,
    maxAttendees: 400,
    topics: ["Business Planning", "Funding", "Market Analysis", "Growth Strategies"],
    requirements: "Entrepreneurs and aspiring business founders",
    language: "English",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
    meetingLink: "https://zoom.us/meeting/webinar-6",
    category: "Entrepreneurship"
  }
];

const MOCK_WEBINAR_REGISTRATIONS: Record<string, string[]> = {
  student1: ["w1", "w3"]
};

const MOCK_NOTIFICATIONS = [
  {
    id: "notif1",
    userId: "student1",
    title: "New Job Match",
    description: "A new Ground Staff position matches your profile.",
    type: "job",
    icon: "Briefcase",
    timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/jobs/4",
    priority: "high"
  },
  {
    id: "notif2",
    userId: "student1",
    title: "Course Update",
    description: "New lesson added to 'Aviation Safety Management'.",
    type: "course",
    icon: "BookOpen",
    timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/dashboard/courses",
    priority: "medium"
  },
  {
    id: "notif3",
    userId: "student1",
    title: "Interview Reminder",
    description: "Your interview with Air India is tomorrow at 10 AM.",
    type: "event",
    icon: "Calendar",
    timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/dashboard/interviews",
    priority: "high"
  },
  {
    id: "notif4",
    userId: "student1",
    title: "Application Status",
    description: "Your application for Cabin Crew Internship at Emirates has been reviewed.",
    type: "application",
    icon: "CheckCircle2",
    timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/dashboard/applications",
    priority: "medium"
  },
  {
    id: "notif5",
    userId: "student1",
    title: "Certificate Earned",
    description: "You've successfully completed the Advanced Pilot Training course.",
    type: "achievement",
    icon: "Award",
    timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/dashboard/courses",
    priority: "low"
  },
  {
    id: "notif6",
    userId: "student1",
    title: "Job Alert",
    description: "New A320 First Officer position posted by Qatar Airways.",
    type: "job",
    icon: "Briefcase",
    timestamp: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/jobs/2",
    priority: "high"
  }
];

const MOCK_NOTIFICATION_PREFERENCES = {
  student1: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    jobAlerts: true,
    interviewReminders: true,
    applicationUpdates: true,
    courseUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    immediateAlerts: true
  }
};

const MOCK_ADMINS = [
  { 
    id: "admin1", 
    name: "Prime Admin", 
    email: "prime@admin.com", 
    role: "admin", 
    isPrime: true, 
    status: "Active", 
    permissions: ["all"],
    joinedAt: "2023-01-01"
  },
  { 
    id: "admin2", 
    name: "Support Admin", 
    email: "support@admin.com", 
    role: "admin", 
    isPrime: false, 
    status: "Active", 
    permissions: ["manage_jobs", "manage_students"],
    joinedAt: "2024-01-10"
  }
];

const MOCK_TRANSACTIONS = [
  {
    id: "TXN001",
    userId: "student1",
    userName: "John Doe",
    userEmail: "john@example.com",
    planId: "premium",
    planName: "Premium",
    amount: 17,
    amountFormatted: "₹14,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-20",
    orderId: "order_abc123",
    paymentId: "pay_abc123",
    createdAt: "2024-03-20T10:30:00Z"
  },
  {
    id: "TXN002",
    userId: "student2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    planId: "placement",
    planName: "Placement",
    amount: 99999,
    amountFormatted: "₹99,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-19",
    orderId: "order_def456",
    paymentId: "pay_def456",
    createdAt: "2024-03-19T14:45:00Z"
  },
  {
    id: "TXN003",
    userId: "student3",
    userName: "Raj Patel",
    userEmail: "raj@example.com",
    planId: "prime",
    planName: "Prime",
    amount: 4999,
    amountFormatted: "₹4,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-18",
    orderId: "order_ghi789",
    paymentId: "pay_ghi789",
    createdAt: "2024-03-18T08:15:00Z"
  },
  {
    id: "TXN004",
    userId: "student4",
    userName: "Priya Verma",
    userEmail: "priya@example.com",
    planId: "premium",
    planName: "Premium",
    amount: 14999,
    amountFormatted: "₹14,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Failed",
    transactionDate: "2024-03-17",
    orderId: "order_jkl012",
    paymentId: null,
    createdAt: "2024-03-17T16:20:00Z"
  },
  {
    id: "TXN005",
    userId: "student5",
    userName: "Amit Singh",
    userEmail: "amit@example.com",
    planId: "placement",
    planName: "Placement",
    amount: 99999,
    amountFormatted: "₹99,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-16",
    orderId: "order_mno345",
    paymentId: "pay_mno345",
    createdAt: "2024-03-16T12:00:00Z"
  },
  {
    id: "TXN006",
    userId: "student6",
    userName: "Sneha Kumar",
    userEmail: "sneha@example.com",
    planId: "prime",
    planName: "Prime",
    amount: 4999,
    amountFormatted: "₹4,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-15",
    orderId: "order_pqr678",
    paymentId: "pay_pqr678",
    createdAt: "2024-03-15T09:45:00Z"
  },
  {
    id: "TXN007",
    userId: "student7",
    userName: "Vikram Reddy",
    userEmail: "vikram@example.com",
    planId: "premium",
    planName: "Premium",
    amount: 14999,
    amountFormatted: "₹14,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-14",
    orderId: "order_stu901",
    paymentId: "pay_stu901",
    createdAt: "2024-03-14T15:30:00Z"
  },
  {
    id: "TXN008",
    userId: "student8",
    userName: "Meera Sharma",
    userEmail: "meera@example.com",
    planId: "prime",
    planName: "Prime",
    amount: 4999,
    amountFormatted: "₹4,999",
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "Success",
    transactionDate: "2024-03-13",
    orderId: "order_vwx234",
    paymentId: "pay_vwx234",
    createdAt: "2024-03-13T11:20:00Z"
  }
];

const MOCK_COURSES = [
  {
    id: "course-1",
    title: "Professional Cabin Crew Training",
    category: "Cabin Crew",
    instructor: "Capt. Priya Sharma",
    instructorImage: "https://ui-avatars.com/api/?name=Priya+Sharma&background=random",
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    progress: 68,
    totalModules: 12,
    completedModules: 8,
    duration: "3 months",
    nextLesson: "Emergency Procedures - Part 2",
    lastAccessed: "2 hours ago",
    status: "in-progress" as const,
    enrolledDate: "2024-01-15",
    rating: 4.8,
    students: 1243,
    description: "Comprehensive training for professional cabin crew with focus on safety, service excellence, and emergency procedures."
  },
  {
    id: "course-2",
    title: "Aviation Safety & Security",
    category: "Safety",
    instructor: "Capt. Rajesh Kumar",
    instructorImage: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random",
    thumbnail: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80",
    progress: 100,
    totalModules: 8,
    completedModules: 8,
    duration: "6 weeks",
    nextLesson: null,
    lastAccessed: "1 week ago",
    status: "completed" as const,
    enrolledDate: "2023-11-20",
    rating: 4.9,
    students: 2156,
    completionDate: "2024-01-10",
    description: "Master aviation safety protocols, security procedures, and compliance requirements."
  },
  {
    id: "course-3",
    title: "Customer Service Excellence",
    category: "Soft Skills",
    instructor: "Ms. Anjali Verma",
    instructorImage: "https://ui-avatars.com/api/?name=Anjali+Verma&background=random",
    thumbnail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    progress: 25,
    totalModules: 10,
    completedModules: 2,
    duration: "4 weeks",
    nextLesson: "Handling Difficult Passengers",
    lastAccessed: "3 days ago",
    status: "in-progress" as const,
    enrolledDate: "2024-02-01",
    rating: 4.7,
    students: 897,
    description: "Develop exceptional customer service skills for aviation industry professionals."
  },
  {
    id: "course-4",
    title: "Pilot Training - Fundamentals",
    category: "Pilot",
    instructor: "Capt. Michael O'Brien",
    instructorImage: "https://ui-avatars.com/api/?name=Michael+OBrien&background=random",
    thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65b?w=600&q=80",
    progress: 0,
    totalModules: 20,
    completedModules: 0,
    duration: "6 months",
    nextLesson: "Introduction to Flight Physics",
    lastAccessed: null,
    status: "available" as const,
    enrolledDate: "2024-03-01",
    rating: 4.6,
    students: 543,
    description: "Foundational course for aspiring pilots covering aerospace fundamentals."
  }
];

const MOCK_INTERVIEWS = [
  {
    id: "int-1",
    title: "Technical Interview",
    company: "Air India",
    position: "Cabin Crew",
    date: "2024-04-20",
    time: "10:00 AM",
    type: "Virtual",
    status: "scheduled" as const,
    interviewer: "Capt. Rajesh Kumar",
    interviewerImage: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random",
    meetingLink: "https://zoom.us/j/123456789",
    phone: "+91 98765 43210",
    description: "Interview covering technical knowledge and safety procedures",
    duration: 45,
    location: "Virtual - Zoom",
    reminderSet: true
  },
  {
    id: "int-2",
    title: "HR Round",
    company: "Indigo Airlines",
    position: "Ground Staff",
    date: "2024-04-22",
    time: "02:30 PM",
    type: "In-Person",
    status: "scheduled" as const,
    interviewer: "Ms. Anjali Verma",
    interviewerImage: "https://ui-avatars.com/api/?name=Anjali+Verma&background=random",
    location: "Gurgaon Office, Block-A",
    phone: "+91 87654 32109",
    description: "HR discussion on culture fit and career aspirations",
    duration: 30,
    reminderSet: true
  },
  {
    id: "int-3",
    title: "Final Round Discussion",
    company: "Emirates",
    position: "Flight Attendant",
    date: "2024-04-25",
    time: "09:00 AM",
    type: "Virtual",
    status: "completed" as const,
    interviewer: "Sarah Johnson",
    interviewerImage: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    meetingLink: "https://zoom.us/j/987654321",
    description: "Final assessment and offer discussion",
    duration: 60,
    completedDate: "2024-04-25",
    result: "Offer Extended",
    feedback: "Excellent performance in all areas"
  },
  {
    id: "int-4",
    title: "Technical Assessment",
    company: "Qatar Airways",
    position: "A320 Captain",
    date: "2024-05-05",
    time: "03:00 PM",
    type: "Virtual",
    status: "scheduled" as const,
    interviewer: "Capt. Ahmed Al-Mansouri",
    interviewerImage: "https://ui-avatars.com/api/?name=Ahmed+AlMansouri&background=random",
    meetingLink: "https://interview.qatarairways.com/session-123",
    description: "Technical knowledge assessment for captain position",
    duration: 90,
    location: "Virtual - Custom Platform"
  }
];

const MOCK_ASSESSMENTS = [
  {
    id: "assess-1",
    title: "Cabin Crew Safety Fundamentals",
    category: "Safety",
    questions: 25,
    duration: 30,
    passingScore: 70,
    status: "completed" as const,
    score: 88,
    completedAt: "2024-03-15",
    attempts: 1,
    maxAttempts: 3,
    certificateUrl: "/certificates/assess-1"
  },
  {
    id: "assess-2",
    title: "Emergency Evacuation Procedures",
    category: "Safety",
    questions: 20,
    duration: 25,
    passingScore: 80,
    status: "available" as const,
    score: null,
    completedAt: null,
    attempts: 0,
    maxAttempts: 3,
    certificateUrl: null
  },
  {
    id: "assess-3",
    title: "Customer Service Excellence Quiz",
    category: "Soft Skills",
    questions: 15,
    duration: 20,
    passingScore: 60,
    status: "in-progress" as const,
    score: null,
    completedAt: null,
    attempts: 1,
    maxAttempts: 3,
    savedProgress: 60,
    lastAttemptDate: "2024-03-18",
    certificateUrl: null
  },
  {
    id: "assess-4",
    title: "Aviation Regulations (ICAO Annex)",
    category: "Regulations",
    questions: 30,
    duration: 45,
    passingScore: 75,
    status: "available" as const,
    score: null,
    completedAt: null,
    attempts: 0,
    maxAttempts: 2,
    certificateUrl: null
  },
  {
    id: "assess-5",
    title: "Pilot Decision Making",
    category: "Pilot Skills",
    questions: 40,
    duration: 60,
    passingScore: 75,
    status: "completed" as const,
    score: 92,
    completedAt: "2024-02-28",
    attempts: 1,
    maxAttempts: 3,
    certificateUrl: "/certificates/assess-5"
  }
];

export const apiService = {
  getAdmins: async () => {
    return { data: MOCK_ADMINS };
  },

  createAdmin: async (data: any) => {
    const newAdmin = { 
      ...data, 
      id: "admin_" + Math.random().toString(36).substr(2, 5), 
      role: "admin", 
      isPrime: false, 
      status: "Active",
      joinedAt: new Date().toISOString().split('T')[0]
    };
    MOCK_ADMINS.push(newAdmin);
    toast.success("Admin created successfully!");
    return { data: newAdmin };
  },

  updateAdmin: async (id: string, data: any) => {
    const index = MOCK_ADMINS.findIndex(a => a.id === id);
    if (index !== -1) {
      MOCK_ADMINS[index] = { ...MOCK_ADMINS[index], ...data };
    }
    toast.success("Admin updated successfully!");
    return { data: MOCK_ADMINS[index] };
  },

  deleteAdmin: async (id: string) => {
    const index = MOCK_ADMINS.findIndex(a => a.id === id);
    if (index !== -1) {
      if (MOCK_ADMINS[index].isPrime) {
        toast.error("Cannot delete Prime Admin");
        throw new Error("Cannot delete Prime Admin");
      }
      MOCK_ADMINS.splice(index, 1);
    }
    toast.success("Admin removed successfully!");
    return { data: { success: true } };
  },

  adminLogin: async (email: string, password?: string) => {
    const admin = MOCK_ADMINS.find(a => a.email === email);
    if (!admin) {
      throw new Error("Invalid admin credentials");
    }
    if (admin.status === "Blocked") {
      throw new Error("Your account has been blocked. Contact Prime Admin.");
    }

    const user = {
      ...admin,
      role: admin.role as 'admin',
      photoURL: `https://ui-avatars.com/api/?name=${admin.name}&background=random`,
      subscription: "elite"
    };

    localStorage.setItem("access_token", "mock_admin_token");
    toast.success(`Welcome back, ${admin.name}!`);
    return { data: user };
  },
  getJobs: async () => {
    return { data: MOCK_JOBS };
  },

  createJob: async (data: any) => {
    const newJob = { ...data, id: Math.random().toString(36).substr(2, 9), postedAt: "Just now", status: "Active" };
    MOCK_JOBS.unshift(newJob);
    toast.success("Job posted successfully!");
    return { data: newJob };
  },

  updateJob: async (id: string, data: any) => {
    const index = MOCK_JOBS.findIndex(j => j.id === id);
    if (index !== -1) {
      MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...data };
    }
    return { data: MOCK_JOBS[index] };
  },

  deleteJob: async (id: string) => {
    const index = MOCK_JOBS.findIndex(j => j.id === id);
    if (index !== -1) {
      MOCK_JOBS.splice(index, 1);
    }
    return { data: { success: true } };
  },

  getJobById: async (id: string) => {
    const job = MOCK_JOBS.find(j => j.id === id);
    return { data: job };
  },

  getCompanies: async () => {
    return { data: ["Emirates", "Qatar Airways", "Lufthansa", "Delta", "Air India"] };
  },

  getDashboardStats: async () => {
    return {
      data: {
        totalJobs: MOCK_JOBS.length,
        totalApplications: MOCK_APPLICATIONS.length,
        totalHires: 12,
        activeUsers: MOCK_STUDENTS.length + 5,
        activeStudents: MOCK_STUDENTS.length,
        revenue: "$12,450",
        newLeads: 184,
        conversionRate: 18.9,
        platformScore: 92,
        avgResponseTime: "2.4d",
        offerRate: "18%",
        jobTrends: [
          { month: "Jan", count: 45 },
          { month: "Feb", count: 52 },
          { month: "Mar", count: 48 },
          { month: "Apr", count: 61 },
          { month: "May", count: 55 },
          { month: "Jun", count: 67 }
        ],
        userActivity: [
          { id: "log1", user: "John Doe", action: "applied for Senior Flight Attendant", time: "2 hours ago" },
          { id: "log2", user: "Jane Smith", action: "updated her profile", time: "4 hours ago" },
          { id: "log3", user: "Emirates HR", action: "posted a new job", time: "5 hours ago" },
          { id: "log4", user: "Rahul Sharma", action: "joined the platform", time: "1 day ago" }
        ],
        roadmap: [
          { id: 1, title: "Profile Completion", status: "completed", date: "2024-01-15" },
          { id: 2, title: "Resume Optimization", status: "completed", date: "2024-02-10" },
          { id: 3, title: "First Application", status: "completed", date: "2024-03-10" },
          { id: 4, title: "Interview Preparation", status: "in-progress", date: "2024-04-01" }
        ]
      }
    };
  },

  getApplications: async (userId?: string) => {
    if (!userId) {
      return { data: [] };
    }
    const filtered = MOCK_APPLICATIONS.filter((app) => app.userId === userId);
    return { data: filtered };
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    if (app) app.status = status;
    return { data: app };
  },

  applyForJob: async (jobId: string, userId: string) => {
    const job = MOCK_JOBS.find(j => String(j.id) === String(jobId));
    const existingApp = MOCK_APPLICATIONS.find(a => String(a.jobId) === String(jobId) && a.userId === userId);
    if (existingApp) {
      toast.success("You have already applied for this position.");
      return { data: existingApp };
    }

    const newApp = {
      id: "app" + Math.random().toString(36).substr(2, 5),
      jobId,
      userId,
      status: "Applied",
      appliedAt: new Date().toISOString().split('T')[0],
      name: "John Doe",
      experience: "2 years",
      score: 75,
      job,
      job_details: { title: job?.title || "", company: job?.company || "" }
    };
    MOCK_APPLICATIONS.push(newApp as any);
    toast.success("Application submitted successfully!");
    return { data: newApp };
  },

  saveJob: async (jobId: string, userId: string) => {
    if (!MOCK_SAVED_JOBS_BY_USER[userId]) {
      MOCK_SAVED_JOBS_BY_USER[userId] = [];
    }
    if (!MOCK_SAVED_JOBS_BY_USER[userId].includes(jobId)) {
      MOCK_SAVED_JOBS_BY_USER[userId].push(jobId);
    }
    toast.success("Job saved to your profile!");
    return { data: { success: true } };
  },

  removeSavedJob: async (jobId: string, userId: string) => {
    if (MOCK_SAVED_JOBS_BY_USER[userId]) {
      MOCK_SAVED_JOBS_BY_USER[userId] = MOCK_SAVED_JOBS_BY_USER[userId].filter((id) => id !== jobId);
    }
    toast.success("Job removed from saved list.");
    return { data: { success: true } };
  },

  getSavedJobs: async (userId: string) => {
    if (!userId) {
      return { data: [] };
    }
    const ids = MOCK_SAVED_JOBS_BY_USER[userId] || [];
    const jobs = MOCK_JOBS.filter((job) => ids.includes(String(job.id)));
    return { data: jobs };
  },

  getStudents: async () => {
    return { data: MOCK_STUDENTS };
  },

  getAllUsers: async () => {
    return { data: [...MOCK_STUDENTS, { id: "emp1", name: "Emirates HR", first_name: "Emirates", last_name: "HR", email: "hr@emirates.com", role: "employer", status: "Active", joinedAt: "2024-01-01", joined: "2024-01-01", createdAt: "2024-01-01", photoURL: "https://ui-avatars.com/api/?name=Emirates+HR&background=random" }] };
  },

  updateUser: async (id: string, data: any) => {
    return { data: { id, ...data } };
  },

  deleteUser: async (id: string) => {
    return { data: { success: true } };
  },

  getPlans: async () => {
    return { data: MOCK_PLANS };
  },

  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/admin/campaigns');
      return response;
    } catch (error) {
      return { data: MOCK_CAMPAIGNS };
    }
  },

  createCampaign: async (data: any) => {
    try {
      const response = await apiClient.post('/admin/campaigns', data);
      return response;
    } catch (error) {
      const newC = { ...data, id: "c" + Math.random() };
      MOCK_CAMPAIGNS.push(newC);
      return { data: newC };
    }
  },

  updateCampaign: async (id: string, data: any) => {
    try {
      const response = await apiClient.put(`/admin/campaigns/${id}`, data);
      return response;
    } catch (error) {
      const index = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CAMPAIGNS[index] = { ...MOCK_CAMPAIGNS[index], ...data };
      }
      return { data: MOCK_CAMPAIGNS[index] };
    }
  },

  deleteCampaign: async (id: string) => {
    try {
      const response = await apiClient.delete(`/admin/campaigns/${id}`);
      return response;
    } catch (error) {
      const index = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CAMPAIGNS.splice(index, 1);
      }
      return { data: { success: true } };
    }
  },

  getColleges: async () => {
    return { data: MOCK_COLLEGES };
  },

  createCollege: async (data: any) => {
    const newC = { ...data, id: "col" + Math.random(), status: "Active" };
    MOCK_COLLEGES.push(newC);
    return { data: newC };
  },

  updateCollege: async (id: string, data: any) => {
    const index = MOCK_COLLEGES.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_COLLEGES[index] = { ...MOCK_COLLEGES[index], ...data };
    }
    return { data: MOCK_COLLEGES[index] };
  },

  deleteCollege: async (id: string) => {
    const index = MOCK_COLLEGES.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_COLLEGES.splice(index, 1);
    }
    return { data: { success: true } };
  },

  getEvents: async () => {
    return { data: MOCK_EVENTS };
  },

  getLeads: async () => {
    return { data: MOCK_LEADS };
  },

  createLead: async (data: any) => {
    const newLead = {
      ...data,
      id: "lead_" + Math.random().toString(36).substr(2, 9),
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_LEADS.unshift(newLead);
    return { data: newLead };
  },

  updateLeadStatus: async (id: string, status: string) => {
    const index = MOCK_LEADS.findIndex(l => l.id === id);
    if (index !== -1) {
      (MOCK_LEADS[index] as any).status = status;
      (MOCK_LEADS[index] as any).updatedAt = new Date().toISOString();
    }
    return { data: MOCK_LEADS[index] };
  },

  deleteLead: async (id: string) => {
    const index = MOCK_LEADS.findIndex(l => l.id === id);
    if (index !== -1) {
      MOCK_LEADS.splice(index, 1);
    }
    return { data: { success: true } };
  },

  createEvent: async (data: any) => {
    const newE = { ...data, id: "e" + Math.random(), status: "Upcoming", attendees: 0 };
    MOCK_EVENTS.push(newE);
    return { data: newE };
  },

  updateEvent: async (id: string, data: any) => {
    const index = MOCK_EVENTS.findIndex(e => e.id === id);
    if (index !== -1) {
      MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], ...data };
    }
    return { data: MOCK_EVENTS[index] };
  },

  deleteEvent: async (id: string) => {
    const index = MOCK_EVENTS.findIndex(e => e.id === id);
    if (index !== -1) {
      MOCK_EVENTS.splice(index, 1);
    }
    return { data: { success: true } };
  },

  login: async (email: string, password?: string) => {
    // Simple mock login
    let role: 'student' | 'admin' | 'employer' = 'student';
    let name = "John Doe";
    
    if (email.includes('admin')) {
      role = 'admin';
      name = "Admin User";
    } else if (email.includes('employer')) {
      role = 'employer';
      name = "Emirates HR";
    }

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      first_name: name.split(' ')[0],
      last_name: name.split(' ')[1] || "",
      email,
      role,
      photoURL: `https://ui-avatars.com/api/?name=${name}&background=random`,
      status: "Active",
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      subscription: "elite"
    };

    localStorage.setItem("access_token", "mock_access_token");
    localStorage.setItem("refresh_token", "mock_refresh_token");
    
    toast.success(`Welcome back, ${name}!`);
    return { data: user };
  },

  register: async (data: any) => {
    toast.success("Account created successfully!");
    return { data: { ...data, id: "new_user", status: "Active" } };
  },

  createSubscription: async (planId: string) => {
    return { data: { id: "sub_" + Math.random(), status: "created" } };
  },

  createOrder: async (orderData: any) => {
    // Mock order creation
    const orderId = "order_" + Math.random().toString(36).substr(2, 9);
    return { 
      data: { 
        id: orderId, 
        amount: orderData.amount * 100, // Razorpay expects amount in paisa
        currency: orderData.currency || 'INR',
        status: 'created'
      } 
    };
  },

  verifyPayment: async (paymentData: any) => {
    // Mock payment verification
    toast.success("Payment verified successfully!");
    return { data: { success: true, status: "captured" } };
  },

  getAdminPlans: async () => {
    const mockPlans = [
      {
        id: "starter",
        name: "Starter",
        price: 0,
        period: "month",
        description: "Basic access to job listings and applications",
        features: ["Job Search", "Basic Resume", "Email Support"],
        permissions: ["job_search", "public_profile", "email_alerts"],
        razorpay_plan_id: null,
        isActive: true,
        subscriberCount: 45,
        revenueGenerated: 0,
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "professional",
        name: "Professional",
        price: 2999,
        period: "month",
        description: "Advanced features for serious job seekers",
        features: ["Priority Applications", "Resume Builder", "AI Career Coach", "Direct Messaging"],
        permissions: ["job_search", "public_profile", "email_alerts", "priority_apps", "resume_builder", "ai_coach", "messaging"],
        razorpay_plan_id: "plan_professional_001",
        isActive: true,
        subscriberCount: 120,
        revenueGenerated: 358800,
        createdAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "elite",
        name: "Elite",
        price: 4999,
        period: "month",
        description: "Premium experience with all features unlocked",
        features: ["All Professional Features", "LinkedIn Support", "Webinar Access", "Personal Mentorship"],
        permissions: ["job_search", "public_profile", "email_alerts", "priority_apps", "resume_builder", "ai_coach", "messaging", "linkedin_support", "webinars", "mentorship"],
        razorpay_plan_id: "plan_elite_001",
        isActive: true,
        subscriberCount: 35,
        revenueGenerated: 174650,
        createdAt: "2024-02-01T00:00:00Z"
      }
    ];

    const mockStats = {
      totalPlans: 3,
      activePlans: 3,
      totalSubscribers: 200,
      totalRevenue: 533450,
      totalRevenueFormatted: "₹5,33,450",
      averageRevenuePerUser: 2667,
      averageRevenuePerUserFormatted: "₹2,667",
      mostPopularPlan: "Professional",
      planDistribution: [
        { name: 'Starter', value: 45, color: '#64748b' },
        { name: 'Professional', value: 120, color: '#8b5cf6' },
        { name: 'Elite', value: 35, color: '#06b6d4' }
      ]
    };

    if (ENV.USE_MOCK) {
      return { data: { plans: mockPlans, stats: mockStats } };
    }

    try {
      const response = await apiClient.get('/admin/plans');
      return response;
    } catch (error) {
      return { data: { plans: mockPlans, stats: mockStats } };
    }
  },

  createAdminPlan: async (planData: any) => {
    try {
      const response = await apiClient.post('/admin/plans', planData);
      return response;
    } catch (error) {
      // Mock create
      const newPlan = { ...planData, id: "plan_" + Math.random().toString(36).substr(2, 9) };
      return { data: newPlan };
    }
  },

  updateAdminPlan: async (id: string, data: any) => {
    try {
      const response = await apiClient.put(`/admin/plans/${id}`, data);
      return response;
    } catch (error) {
      // Mock update
      return { data: data };
    }
  },

  deleteAdminPlan: async (id: string) => {
    try {
      const response = await apiClient.delete(`/admin/plans/${id}`);
      return response;
    } catch (error) {
      // Mock delete
      return { data: { success: true } };
    }
  },

  toggleAdminPlanStatus: async (id: string, isActive: boolean) => {
    try {
      const response = await apiClient.put(`/admin/plans/${id}/status`, { isActive });
      return response;
    } catch (error) {
      // Mock toggle
      return { data: { success: true } };
    }
  },

  syncAdminPlan: async (id: string) => {
    try {
      const response = await apiClient.post(`/admin/plans/${id}/sync`);
      return response;
    } catch (error) {
      // Mock sync
      return { data: { razorpay_plan_id: "rzp_plan_" + Math.random().toString(36).substr(2, 9) } };
    }
  },

  // Job Methods
  getAdminJobs: async () => {
    if (ENV.USE_MOCK) {
      const stats = { totalJobs: MOCK_JOBS.length, activeJobs: MOCK_JOBS.filter(j => j.status === "Active").length, totalApplications: 156, averageApplicationsPerJob: Math.round(156 / MOCK_JOBS.length), totalViews: 3420, jobsByCategory: [{ name: "Engineering", value: 2, color: "#3b82f6" }, { name: "Pilot", value: 1, color: "#06b6d4" }, { name: "Operations", value: 2, color: "#f59e0b" }], applicationsByStatus: [{ status: "Under Review", count: 45 }, { status: "Shortlisted", count: 38 }, { status: "Rejected", count: 73 }] };
      return { data: { jobs: MOCK_JOBS, stats } };
    }

    try {
      const response = await apiClient.get('/admin/jobs');
      return response;
    } catch (error) {
      const stats = { totalJobs: MOCK_JOBS.length, activeJobs: MOCK_JOBS.filter(j => j.status === "Active").length, totalApplications: 156, averageApplicationsPerJob: Math.round(156 / MOCK_JOBS.length), totalViews: 3420, jobsByCategory: [{ name: "Engineering", value: 2, color: "#3b82f6" }, { name: "Pilot", value: 1, color: "#06b6d4" }, { name: "Operations", value: 2, color: "#f59e0b" }], applicationsByStatus: [{ status: "Under Review", count: 45 }, { status: "Shortlisted", count: 38 }, { status: "Rejected", count: 73 }] };
      return { data: { jobs: MOCK_JOBS, stats } };
    }
  },

  createAdminJob: async (data: any) => {
    try {
      const response = await apiClient.post('/admin/jobs', data);
      return response;
    } catch (error) {
      const newJob = { id: "job_" + Math.random().toString(36).substr(2, 5), ...data, applications: 0, views: 0, postedAt: new Date().toISOString() };
      MOCK_JOBS.push(newJob);
      return { data: newJob };
    }
  },

  updateAdminJob: async (id: string, data: any) => {
    try {
      const response = await apiClient.put(`/admin/jobs/${id}`, data);
      return response;
    } catch (error) {
      const job = MOCK_JOBS.find(j => j.id === id);
      if (job) Object.assign(job, data);
      return { data: { success: true } };
    }
  },

  deleteAdminJob: async (id: string) => {
    try {
      const response = await apiClient.delete(`/admin/jobs/${id}`);
      return response;
    } catch (error) {
      const index = MOCK_JOBS.findIndex(j => j.id === id);
      if (index > -1) MOCK_JOBS.splice(index, 1);
      return { data: { success: true } };
    }
  },

  // Internship Methods
  getAdminInternships: async () => {
    try {
      const response = await apiClient.get('/admin/internships');
      return response;
    } catch (error) {
      const mockInternships = [
        { id: "int1", title: "Software Engineering Intern", company: "Microsoft", location: "Seattle, USA", duration: "3-6 months", stipend: "$2,000/month", department: "Engineering", skills: ["Python", "C++"], requirements: ["2+ years coding"], applications: 28, views: 450, status: "Active", postedAt: "5 days ago", description: "Contribute to cutting-edge cloud solutions and AI projects." },
        { id: "int2", title: "Operations Intern", company: "Emirates", location: "Dubai, UAE", duration: "2-4 months", stipend: "Paid", department: "Operations", skills: ["Logistics", "Planning"], requirements: ["Problem-solving"], applications: 15, views: 320, status: "Active", postedAt: "3 days ago", description: "Learn airport and flight operations from experts." },
        { id: "int3", title: "Finance Intern", company: "Goldman Sachs", location: "New York, USA", duration: "3-6 months", stipend: "$2,500/month", department: "Finance", skills: ["Excel", "Analysis"], requirements: ["Finance major"], applications: 42, views: 680, status: "Active", postedAt: "1 week ago", description: "Analyze financial markets and support trading teams." }
      ];
      const stats = { totalInternships: mockInternships.length, activeInternships: mockInternships.length, totalApplications: 85, averageApplicationsPerInternship: Math.round(85 / mockInternships.length), totalViews: 1450, internshipsByDepartment: [{ name: "Engineering", value: 1, color: "#3b82f6" }, { name: "Operations", value: 1, color: "#06b6d4" }, { name: "Finance", value: 1, color: "#f59e0b" }] };
      return { data: { internships: mockInternships, stats } };
    }
  },

  createAdminInternship: async (data: any) => {
    try {
      const response = await apiClient.post('/admin/internships', data);
      return response;
    } catch (error) {
      const newInternship = { id: "int_" + Math.random().toString(36).substr(2, 5), ...data, applications: 0, views: 0, postedAt: new Date().toISOString() };
      return { data: newInternship };
    }
  },

  updateAdminInternship: async (id: string, data: any) => {
    try {
      const response = await apiClient.put(`/admin/internships/${id}`, data);
      return response;
    } catch (error) {
      return { data: { success: true } };
    }
  },

  deleteAdminInternship: async (id: string) => {
    try {
      const response = await apiClient.delete(`/admin/internships/${id}`);
      return response;
    } catch (error) {
      return { data: { success: true } };
    }
  },

  getAdminPayments: async () => {
    try {
      const response = await apiClient.get('/admin/payments');
      return response;
    } catch (error) {
      const successTransactions = MOCK_TRANSACTIONS.filter(t => t.status === 'Success');
      const totalRevenue = successTransactions.reduce((sum, t) => sum + t.amount, 0);
      const activeSubscriptions = successTransactions.length;
      const pendingAmount = MOCK_TRANSACTIONS.filter(t => t.status === 'Failed').reduce((sum, t) => sum + t.amount, 0);

      return {
        data: {
          transactions: MOCK_TRANSACTIONS,
          summary: {
            totalRevenue,
            totalRevenueFormatted: `₹${totalRevenue.toLocaleString('en-IN')}`,
            activeSubscriptions,
            pendingPayments: MOCK_TRANSACTIONS.filter(t => t.status === 'Failed').length,
            pendingAmount,
            pendingAmountFormatted: `₹${pendingAmount.toLocaleString('en-IN')}`
          }
        }
      };
    }
  },

  getPaymentHistory: async (userId?: string) => {
    const filtered = userId 
      ? MOCK_TRANSACTIONS.filter(t => t.userId === userId) 
      : MOCK_TRANSACTIONS;
    return { data: filtered };
  },

  getSubscriptionStatus: async (userId: string) => {
    const latestTransaction = MOCK_TRANSACTIONS
      .filter(t => t.userId === userId && t.status === 'Success')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      [0];

    return {
      data: {
        hasActiveSubscription: !!latestTransaction,
        currentPlan: latestTransaction?.planId,
        currentPlanName: latestTransaction?.planName,
        subscriptionDate: latestTransaction?.transactionDate,
        nextBillingDate: latestTransaction ? new Date(new Date(latestTransaction.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
      }
    };
  },

  getAdminSubscriptions: async () => {
    if (ENV.USE_MOCK) {
      const mockSubscriptions = [
        {
          id: "sub1",
          userId: "user1",
          userName: "John Doe",
          userEmail: "john@example.com",
          planId: "plan1",
          planName: "Professional",
          status: "active" as const,
          startDate: "2024-01-15",
          endDate: "2025-01-15",
          renewalDate: "2025-01-15",
          amount: 2999,
          amountFormatted: "₹2,999",
          paymentMethod: "Credit Card",
          autoRenew: true,
          createdAt: "2024-01-15T10:00:00Z"
        },
        {
          id: "sub2",
          userId: "user2",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          planId: "plan2",
          planName: "Elite",
          status: "active" as const,
          startDate: "2024-02-20",
          endDate: "2025-02-20",
          renewalDate: "2025-02-20",
          amount: 4999,
          amountFormatted: "₹4,999",
          paymentMethod: "UPI",
          autoRenew: true,
          createdAt: "2024-02-20T14:30:00Z"
        },
        {
          id: "sub3",
          userId: "user3",
          userName: "Mike Johnson",
          userEmail: "mike@example.com",
          planId: "plan1",
          planName: "Professional",
          status: "expired" as const,
          startDate: "2023-12-01",
          endDate: "2024-12-01",
          renewalDate: "2024-12-01",
          amount: 2999,
          amountFormatted: "₹2,999",
          paymentMethod: "Debit Card",
          autoRenew: false,
          createdAt: "2023-12-01T09:15:00Z"
        }
      ];

      const mockStats = {
        totalSubscriptions: 156,
        activeSubscriptions: 142,
        expiredSubscriptions: 8,
        cancelledSubscriptions: 4,
        pendingSubscriptions: 2,
        totalRevenue: 450000,
        totalRevenueFormatted: "₹4,50,000",
        monthlyRecurringRevenue: 42500,
        monthlyRecurringRevenueFormatted: "₹42,500",
        churnRate: 3.2,
        averageSubscriptionValue: 2884,
        averageSubscriptionValueFormatted: "₹2,884"
      };

      return { data: { subscriptions: mockSubscriptions, stats: mockStats } };
    }
  },

  updateSubscriptionStatus: async (subscriptionId: string, status: string) => {
    try {
      const response = await apiClient.put(`/admin/subscriptions/${subscriptionId}/status`, { status });
      return response;
    } catch (error) {
      // Mock update
      return { data: { success: true } };
    }
  },

  deleteSubscription: async (subscriptionId: string) => {
    try {
      const response = await apiClient.delete(`/admin/subscriptions/${subscriptionId}`);
      return response;
    } catch (error) {
      // Mock delete
      return { data: { success: true } };
    }
  },

  // Notification Methods
  getNotifications: async (userId: string) => {
    const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return {
      data: {
        notifications: userNotifications,
        unreadCount: userNotifications.filter(n => !n.read).length,
        summary: {
          total: userNotifications.length,
          unread: userNotifications.filter(n => !n.read).length,
          byType: {
            job: userNotifications.filter(n => n.type === 'job').length,
            course: userNotifications.filter(n => n.type === 'course').length,
            event: userNotifications.filter(n => n.type === 'event').length,
            application: userNotifications.filter(n => n.type === 'application').length,
            achievement: userNotifications.filter(n => n.type === 'achievement').length
          }
        }
      }
    };
  },

  markNotificationAsRead: async (notificationId: string) => {
    const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return { data: { success: true } };
  },

  markAllNotificationsAsRead: async (userId: string) => {
    const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
    userNotifications.forEach(n => n.read = true);
    return { data: { success: true, updated: userNotifications.length } };
  },

  deleteNotification: async (notificationId: string) => {
    const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      MOCK_NOTIFICATIONS.splice(index, 1);
    }
    return { data: { success: true } };
  },

  getNotificationPreferences: async (userId: string) => {
    const prefs = MOCK_NOTIFICATION_PREFERENCES[userId as keyof typeof MOCK_NOTIFICATION_PREFERENCES] || MOCK_NOTIFICATION_PREFERENCES['student1'];
    return { data: prefs };
  },

  updateNotificationPreferences: async (userId: string, preferences: any) => {
    (MOCK_NOTIFICATION_PREFERENCES as any)[userId] = preferences;
    toast.success("Notification preferences updated!");
    return { data: preferences };
  },

  // Webinar Methods
  getWebinars: async (userId?: string) => {
    const userRegistrations = userId ? (MOCK_WEBINAR_REGISTRATIONS[userId] || []) : [];
    const webinarsWithStatus = MOCK_WEBINARS.map(w => ({
      ...w,
      isRegistered: userRegistrations.includes(w.id),
      availableSeats: w.maxAttendees - w.registeredCount
    }));
    
    return {
      data: {
        webinars: webinarsWithStatus,
        categories: [...new Set(MOCK_WEBINARS.map(w => w.category))],
        totalWebinars: MOCK_WEBINARS.length,
        stats: {
          upcoming: MOCK_WEBINARS.filter(w => w.status === 'upcoming').length,
          registered: userRegistrations.length
        }
      }
    };
  },

  registerForWebinar: async (webinarId: string, userId: string) => {
    if (!MOCK_WEBINAR_REGISTRATIONS[userId]) {
      MOCK_WEBINAR_REGISTRATIONS[userId] = [];
    }
    
    if (!MOCK_WEBINAR_REGISTRATIONS[userId].includes(webinarId)) {
      MOCK_WEBINAR_REGISTRATIONS[userId].push(webinarId);
      
      // Also increment the registered count
      const webinar = MOCK_WEBINARS.find(w => w.id === webinarId);
      if (webinar) {
        webinar.registeredCount += 1;
      }
      
      toast.success("Successfully registered for webinar!");
    }
    
    return { data: { success: true, registered: true } };
  },

  unregisterFromWebinar: async (webinarId: string, userId: string) => {
    if (MOCK_WEBINAR_REGISTRATIONS[userId]) {
      const index = MOCK_WEBINAR_REGISTRATIONS[userId].indexOf(webinarId);
      if (index !== -1) {
        MOCK_WEBINAR_REGISTRATIONS[userId].splice(index, 1);
        
        // Decrement the registered count
        const webinar = MOCK_WEBINARS.find(w => w.id === webinarId);
        if (webinar && webinar.registeredCount > 0) {
          webinar.registeredCount -= 1;
        }
        
        toast.success("Unregistered from webinar");
      }
    }
    
    return { data: { success: true, registered: false } };
  },

  getWebinarRegistrations: async (userId: string) => {
    const registrationIds = MOCK_WEBINAR_REGISTRATIONS[userId] || [];
    const registeredWebinars = MOCK_WEBINARS.filter(w => registrationIds.includes(w.id));
    
    return {
      data: {
        registrations: registeredWebinars,
        totalRegistrations: registeredWebinars.length
      }
    };
  },

  getWebinarPreferences: async (userId: string) => {
    return {
      data: {
        emailReminders: true,
        autoRegisterCategory: false,
        notifyBeforeStart: true,
        recordingAccess: true,
        calendarSync: false,
        preferredCategories: ["Career Development", "Technical Training"],
        timezone: "IST"
      }
    };
  },

  updateWebinarPreferences: async (userId: string, preferences: any) => {
    toast.success("Webinar preferences updated!");
    return { data: preferences };
  },

  // Course Methods
  getCourses: async () => {
    return {
      data: {
        courses: MOCK_COURSES,
        totalCourses: MOCK_COURSES.length,
        categories: [...new Set(MOCK_COURSES.map(c => c.category))],
        stats: {
          totalEnrolled: MOCK_COURSES.length,
          inProgress: MOCK_COURSES.filter(c => c.status === 'in-progress').length,
          completed: MOCK_COURSES.filter(c => c.status === 'completed').length,
          available: MOCK_COURSES.filter(c => c.status === 'available').length
        }
      }
    };
  },

  getEnrolledCourses: async (userId?: string) => {
    const enrolled = MOCK_COURSES.filter(c => c.status !== 'available');
    return {
      data: {
        courses: enrolled,
        totalEnrolled: enrolled.length,
        inProgress: enrolled.filter(c => c.status === 'in-progress').length,
        completed: enrolled.filter(c => c.status === 'completed').length,
        avgProgress: Math.round(enrolled.reduce((sum, c) => sum + c.progress, 0) / enrolled.length)
      }
    };
  },

  updateCourseProgress: async (courseId: string, progress: number) => {
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (course) {
      course.progress = progress;
      if (progress === 100) {
        course.status = 'completed';
        course.completionDate = new Date().toISOString().split('T')[0];
      }
    }
    toast.success("Course progress updated!");
    return { data: { success: true } };
  },

  // Interview Methods
  getInterviews: async (userId?: string) => {
    const allInterviews = MOCK_INTERVIEWS;
    const upcoming = allInterviews.filter(i => i.status === 'scheduled');
    const completed = allInterviews.filter(i => i.status === 'completed');

    return {
      data: {
        interviews: allInterviews,
        upcoming: upcoming,
        completed: completed,
        stats: {
          total: allInterviews.length,
          scheduled: upcoming.length,
          completed: completed.length,
          offersReceived: completed.filter(i => i.result === 'Offer Extended').length
        }
      }
    };
  },

  rescheduleInterview: async (interviewId: string, newDate: string, newTime: string) => {
    const interview = MOCK_INTERVIEWS.find(i => i.id === interviewId);
    if (interview) {
      interview.date = newDate;
      interview.time = newTime;
    }
    toast.success("Interview rescheduled successfully!");
    return { data: { success: true } };
  },

  cancelInterview: async (interviewId: string) => {
    const index = MOCK_INTERVIEWS.findIndex(i => i.id === interviewId);
    if (index !== -1) {
      MOCK_INTERVIEWS.splice(index, 1);
    }
    toast.success("Interview cancelled");
    return { data: { success: true } };
  },

  // Assessment Methods
  getAssessments: async (userId?: string) => {
    const completed = MOCK_ASSESSMENTS.filter(a => a.status === 'completed');
    const available = MOCK_ASSESSMENTS.filter(a => a.status === 'available');
    const inProgress = MOCK_ASSESSMENTS.filter(a => a.status === 'in-progress');

    return {
      data: {
        assessments: MOCK_ASSESSMENTS,
        completed: completed,
        available: available,
        inProgress: inProgress,
        stats: {
          total: MOCK_ASSESSMENTS.length,
          completed: completed.length,
          available: available.length,
          avgScore: Math.round(completed.reduce((sum, a) => sum + (a.score || 0), 0) / (completed.length || 1)),
          passRate: Math.round((completed.filter(a => (a.score || 0) >= a.passingScore).length / completed.length) * 100) || 0
        },
        categories: [...new Set(MOCK_ASSESSMENTS.map(a => a.category))]
      }
    };
  },

  startAssessment: async (assessmentId: string) => {
    const assessment = MOCK_ASSESSMENTS.find(a => a.id === assessmentId) as any;
    if (assessment && assessment.status === 'available') {
      assessment.status = 'in-progress';
      assessment.attempts += 1;
    }
    toast.success("Assessment started!");
    return { data: { success: true, assessmentId } };
  },

  submitAssessment: async (assessmentId: string, answers: Record<string, string>) => {
    const assessment = MOCK_ASSESSMENTS.find(a => a.id === assessmentId) as any;
    if (assessment) {
      const score = Math.round(Math.random() * 30 + 60); // Random score between 60-90
      assessment.status = 'completed';
      assessment.score = score;
      assessment.completedAt = new Date().toISOString().split('T')[0];

      if (score >= assessment.passingScore) {
        assessment.certificateUrl = `/certificates/${assessmentId}`;
        toast.success(`Assessment passed with score ${score}!`);
      } else {
        toast.error(`Assessment failed. Score: ${score}. Need at least ${assessment.passingScore}`);
      }
    }
    return { data: { success: true, score: assessment?.score } };
  },

  getAssessmentResult: async (assessmentId: string) => {
    const assessment = MOCK_ASSESSMENTS.find(a => a.id === assessmentId);
    if (!assessment) {
      return { data: null };
    }

    return {
      data: {
        id: assessment.id,
        title: assessment.title,
        score: assessment.score,
        passingScore: assessment.passingScore,
        passed: assessment.score !== null && assessment.score >= assessment.passingScore,
        completedAt: assessment.completedAt,
        certificateUrl: assessment.certificateUrl,
        feedback: assessment.score && assessment.score >= assessment.passingScore 
          ? "Great job! You've successfully completed this assessment."
          : "Please review the material and try again."
      }
    };
  }
};

export default apiService;
