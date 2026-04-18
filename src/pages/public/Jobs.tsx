import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { apiService } from "@/src/services/api";
import { Job } from "@/src/types";
import JobCard from "@/src/components/common/JobCard";
import { Search, ChevronDown, MapPin, Plane, Filter, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Skeleton } from "@/src/components/ui/Skeleton";
import SEO from "@/src/components/common/SEO";
import EmptyState from "@/src/components/common/EmptyState";
import { JobQuickView } from "@/src/components/jobs/JobQuickView";
import { useJobStore } from "@/src/store/jobStore";
import { useAuthStore } from "@/src/store/authStore";
import { useApplications, useSavedJobs } from "@/src/hooks/useQueries";
import { useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [experience, setExperience] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [isLoading, setIsLoading] = useState(true);
  
  // Quick View State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: savedJobs = [], isLoading: isSavedLoading } = useSavedJobs(user?.id);
  const { data: applications = [], isLoading: isAppsLoading } = useApplications(user?.id);
  const { saveJob, removeJob, isJobSaved, setSavedJobs, clearSavedJobs } = useJobStore();
  const isLoadingAll = isLoading || isSavedLoading || isAppsLoading;

  useEffect(() => {
    if (!user) {
      clearSavedJobs();
      return;
    }
    setSavedJobs(savedJobs.map((job) => String(job.id)));
  }, [savedJobs, user, setSavedJobs, clearSavedJobs]);

  const categories = [
    "All", 
    "Commercial Aviation", 
    "Business & Private Aviation", 
    "MRO & Technical Services", 
    "Aerospace Manufacturing", 
    "Defense, Military & Drones", 
    "Airport Operations", 
    "Aviation Technology & Digital", 
    "Aircraft Manufacturers"
  ];
  const locations = ["All", "Global", "Mumbai", "Delhi", "Gurugram", "Ahmedabad"];
  const experienceLevels = ["All", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"];
  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship"];

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                         job.company.toLowerCase().includes(search.toLowerCase()) ||
                         job.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || job.category === category;
    const matchesLocation = location === "All" || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = jobType === "All" || job.type === jobType;
    const matchesExperience = experience === "All" || (job.experience || "").toLowerCase().includes(experience.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesExperience;
  }).sort((a, b) => {
    if (sortBy === "Salary") return b.salary.localeCompare(a.salary);
    return 0;
  });

  const handleQuickView = (job: Job) => {
    setSelectedJob(job);
    setHasApplied(applications.some((app: any) => String(app.jobId) === String(job.id)));
    setIsQuickViewOpen(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedJob || !user) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      return;
    }

    setIsSaving(true);
    const jobId = String(selectedJob.id);
    try {
      if (isJobSaved(jobId)) {
        await apiService.removeSavedJob(jobId, user.id);
        removeJob(jobId);
        toast.success("Job removed from saved");
      } else {
        await apiService.saveJob(jobId, user.id);
        saveJob(jobId);
        toast.success("Job saved successfully");
      }
      queryClient.invalidateQueries({ queryKey: ['saved-jobs', user.id] });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedJob || !user) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      return;
    }

    setIsApplying(true);
    const loadingToast = toast.loading("Submitting application...");
    try {
      await apiService.applyForJob(String(selectedJob.id), user.id);
      setHasApplied(true);
      queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
      toast.success("Applied successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Apply failed:", error);
      toast.error("Failed to apply.", { id: loadingToast });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#fafafa]">
      <SEO title="Premium Aviation Careers" description="Discover elite career opportunities in the global aviation industry." />
      
      {/* Premium Hero Section */}
      <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-purple-50 border border-purple-100/50 text-purple-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Elite Aviation Career Network</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]"
            >
              Elevate Your <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">Aviation Legacy</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Access exclusive opportunities with world-class airlines, aerospace leaders, and innovative maintenance hubs globally.
            </motion.p>
          </div>

          {/* Advanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto mt-10 sm:mt-16"
          >
            <div className="bg-white p-3 sm:p-4 rounded-3xl sm:rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row items-center gap-3">
              <div className="flex-1 relative w-full group">
                <Search className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Job title, company, or expertise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 sm:h-16 pl-12 sm:pl-16 pr-4 sm:pr-8 bg-slate-50/50 rounded-2xl sm:rounded-4xl border-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-semibold placeholder:text-slate-400 transition-all text-sm sm:text-base"
                />
              </div>
              <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
              <div className="flex-1 relative w-full group">
                <MapPin className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Global locations..."
                  value={location === "All" ? "" : location}
                  onChange={(e) => setLocation(e.target.value || "All")}
                  className="w-full h-14 sm:h-16 pl-12 sm:pl-16 pr-4 sm:pr-8 bg-slate-50/50 rounded-2xl sm:rounded-4xl border-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-semibold placeholder:text-slate-400 transition-all text-sm sm:text-base"
                />
              </div>
              <button className="premium-button-primary h-14 sm:h-16 px-8 sm:px-12 rounded-2xl sm:rounded-4xl w-full lg:w-auto text-sm sm:text-base font-bold flex items-center justify-center space-x-3">
                <span>Search Careers</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 sm:mt-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Refined Sidebar Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[40px] border border-slate-100 shadow-sm lg:sticky top-32">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <SlidersHorizontal className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900">Refine</h3>
                </div>
                <button 
                  onClick={() => {
                    setSearch(""); 
                    setCategory("All"); 
                    setLocation("All");
                    setExperience("All");
                    setJobType("All");
                  }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-8 sm:space-y-10">
                {/* Industry Domain */}
                <div className="space-y-3 sm:space-y-5">
                  <label htmlFor="industryDomain" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Industry Domain</label>
                  <div className="relative">
                    <select
                      id="industryDomain"
                      aria-label="Industry domain filter"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-12 sm:h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 sm:px-5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer text-slate-700 transition-all truncate"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-3 sm:space-y-5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Experience Level</label>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setExperience(level)}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                          experience === level 
                            ? "bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-100" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-purple-200 hover:text-purple-600"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-3 sm:space-y-5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Employment Type</label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setJobType(type)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-widest ${
                          jobType === type 
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs Feed */}
          <div className="flex-1 space-y-6 sm:space-y-10 mt-8 lg:mt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">Available Positions</h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  Discovering <span className="text-purple-600 font-bold">{isLoadingAll ? "..." : filteredJobs.length}</span> curated aviation roles
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort:</span>
                  <select 
                    aria-label="Sort job listings"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-slate-900 uppercase tracking-widest"
                  >
                    <option value="Newest">Newest</option>
                    <option value="Salary">Salary</option>
                    <option value="Relevance">Relevance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {isLoadingAll ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 space-y-8">
                    <div className="flex items-center space-x-5">
                      <Skeleton className="h-16 w-16 rounded-2xl" />
                      <div className="space-y-3 grow">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Skeleton className="h-10 w-full rounded-xl" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="flex justify-between pt-6 border-t border-slate-50">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-32 rounded-2xl" />
                    </div>
                  </div>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    hasApplied={applications.some((app: any) => String(app.jobId) === String(job.id))}
                    onQuickView={handleQuickView}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState 
                    icon={Search}
                    title="No matching positions"
                    description="Refine your search parameters to explore more aviation career paths."
                    actionLabel="Reset All Filters"
                    onAction={() => {
                      setSearch(""); 
                      setCategory("All"); 
                      setLocation("All");
                      setExperience("All");
                      setJobType("All");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal Integration */}
      <JobQuickView 
        job={selectedJob}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        isSaved={selectedJob ? isJobSaved(String(selectedJob.id)) : false}
        isSaving={isSaving}
        onSave={handleSave}
        hasApplied={hasApplied}
        isApplying={isApplying}
        onApply={handleApply}
      />
    </div>
  );
}
