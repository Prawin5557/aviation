import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Rocket,
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";

type UserType = "Employer" | "Candidate";

interface SubLink {
  label: string;
  href: string;
}

interface Category {
  id: string;
  label: string;
  icon: any;
  title: string;
  description: string;
  subLinks: SubLink[];
}

const employerCategories: Category[] = [
  {
    id: "managed-hr",
    label: "Managed HR Services",
    icon: ClipboardCheck,
    title: "Managed HR Services",
    description: "From onboarding and daily employee care to appraisals and smooth exits — we handle it all so you can focus on growing your business.",
    subLinks: [
      { label: "Onboarding & Background Verification", href: "#" },
      { label: "Daily HR Operations & Compliance", href: "#" },
      { label: "Payroll Management", href: "#" },
      { label: "Employee Performance & Engagement", href: "#" },
      { label: "Exit Management", href: "#" },
    ]
  },
  {
    id: "hiring",
    label: "Hiring Solutions",
    icon: Users,
    title: "Hiring Solutions",
    description: "Tailored recruitment strategies to find the perfect fit for your aviation and aerospace needs.",
    subLinks: [
      { label: "Executive Search", href: "#" },
      { label: "Bulk Recruitment", href: "#" },
      { label: "Contractual Staffing", href: "#" },
    ]
  },
  {
    id: "rtd",
    label: "Recruit – Train – Deploy (RTD)",
    icon: ShieldCheck,
    title: "Recruit – Train – Deploy (RTD)",
    description: "A comprehensive solution where we source, train, and deploy industry-ready talent specifically for your operational requirements.",
    subLinks: [
      { label: "Customized Training Programs", href: "#" },
      { label: "Skill Assessment", href: "#" },
      { label: "Deployment Management", href: "#" },
    ]
  },
  {
    id: "vcc",
    label: "Virtual Captive Centre",
    icon: Building2,
    title: "Virtual Captive Centre",
    description: "Establish your own dedicated team in India without the overhead of setting up a physical entity.",
    subLinks: [
      { label: "Infrastructure Setup", href: "#" },
      { label: "Operational Support", href: "#" },
    ]
  },
  {
    id: "campus",
    label: "Campus Hiring",
    icon: GraduationCap,
    title: "Campus Hiring",
    description: "Connecting you with the brightest fresh talent from top aviation and engineering institutes.",
    subLinks: [
      { label: "University Relations", href: "#" },
      { label: "Freshers Recruitment", href: "#" },
    ]
  },
  {
    id: "digital",
    label: "Digital Marketing",
    icon: Rocket,
    title: "Digital Marketing",
    description: "Specialized marketing solutions to boost your brand presence in the aviation sector.",
    subLinks: [
      { label: "Employer Branding", href: "#" },
      { label: "Social Media Management", href: "#" },
    ]
  }
];

const candidateCategories: Category[] = [
  {
    id: "find-jobs",
    label: "Find Jobs",
    icon: Search,
    title: "Find Jobs",
    description: "Search MRO, airline ops, cabin crew, engineering roles & more.",
    subLinks: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Upload your CV", href: "/dashboard/profile" },
    ]
  },
  {
    id: "community",
    label: "Talent Community",
    icon: Users,
    title: "Talent Community",
    description: "Join our exclusive network of aviation professionals and stay updated with industry trends.",
    subLinks: [
      { label: "Networking Events", href: "#" },
      { label: "Industry Insights", href: "#" },
    ]
  }
];

export default function SolutionsSection() {
  const [userType, setUserType] = useState<UserType>("Employer");
  const [activeCategory, setActiveCategory] = useState<Category>(employerCategories[0]);

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setActiveCategory(type === "Employer" ? employerCategories[0] : candidateCategories[0]);
  };

  const categories = userType === "Employer" ? employerCategories : candidateCategories;
  const isEmployer = userType === "Employer";

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">      
        <div 
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-5 tracking-tight leading-tight">
            What Are You Looking to <br />
            <span className="text-purple-600">Achieve Today?</span>
          </h2>
          
          <div className="mx-auto w-full sm:w-auto max-w-lg">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.35)] backdrop-blur-xl overflow-hidden">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-[1.1rem] bg-linear-to-r from-slate-900 to-purple-700 shadow-[0_10px_30px_-12px_rgba(88,28,135,0.65)]"
                style={{ left: isEmployer ? "0.375rem" : "calc(50% + 0.1875rem)" }}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange("Employer")}
                  className={`group relative flex items-center justify-center gap-2 rounded-[0.95rem] px-4 sm:px-8 py-3.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] transition-all duration-300 active:scale-[0.98] ${
                    isEmployer ? "text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Building2 className={`h-4 w-4 transition-transform duration-300 ${isEmployer ? "scale-110" : "group-hover:scale-105"}`} />
                  <span>Employer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUserTypeChange("Candidate")}
                  className={`group relative flex items-center justify-center gap-2 rounded-[0.95rem] px-4 sm:px-8 py-3.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] transition-all duration-300 active:scale-[0.98] ${
                    !isEmployer ? "text-white" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Users className={`h-4 w-4 transition-transform duration-300 ${!isEmployer ? "scale-110" : "group-hover:scale-105"}`} />
                  <span>Candidate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          <div className="w-full lg:w-1/3 space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className="w-full flex items-center p-5 rounded-2xl transition-colors duration-200 group active:scale-95 relative hover:bg-purple-50/30"
              >
                {activeCategory.id === cat.id && (
                  <motion.div
                    layoutId="active-solution-indicator"
                    className="absolute inset-0 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 p-2.5 rounded-xl mr-4 transition-colors duration-300 ${
                  activeCategory.id === cat.id ? 'bg-white/20' : 'bg-purple-50 group-hover:bg-white'
                }`}>
                  <cat.icon className={`h-5 w-5 transition-colors duration-300 ${
                    activeCategory.id === cat.id ? 'text-white' : 'text-purple-600'
                  }`} />
                </div>
                <span className={`relative z-10 text-base font-bold tracking-tight transition-colors duration-300 ${
                  activeCategory.id === cat.id ? 'text-white' : 'text-slate-700 group-hover:text-purple-700'
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-3xl p-6 lg:p-10 border border-slate-200 shadow-lg shadow-slate-200/40 min-h-88 sm:min-h-96 flex flex-col relative overflow-hidden"
              >
                <motion.div 
                  className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-purple-50 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5],
                    rotate: [0, 90, 0],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div className="space-y-8 grow relative z-10">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {activeCategory.title}
                    </h3>
                    <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
                      {activeCategory.description}
                    </p>
                  </div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={{
                      show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {activeCategory.subLinks.map((subLink, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                      >
                        <Link
                          to={subLink.href}
                          className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-purple-200 hover:bg-white hover:shadow-md hover:shadow-slate-200/40 transition-all group bg-slate-50/50 active:scale-95 no-underline"
                        >
                          <span className="text-slate-700 font-bold text-sm group-hover:text-purple-600 tracking-tight">
                            {subLink.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="mt-10 relative z-10">
                  <Button size="md" className="px-6 sm:px-10 group w-full sm:w-auto">
                    <span className="flex items-center space-x-2">
                      <span>Explore All Solutions</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}