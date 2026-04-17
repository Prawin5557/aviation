import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Briefcase, Clock, DollarSign, Building2, ArrowUpRight, Bookmark, Loader2, CheckCircle2, X, Sparkles, Target } from "lucide-react";
import { Job } from "@/src/types";
import { Button } from "@/src/components/ui/Button";
import { Link } from "react-router-dom";
import { apiService } from "@/src/services/api";
import { useAuthStore } from "@/src/store/authStore";
import { useJobStore } from "@/src/store/jobStore";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";

interface JobCardProps {
  job: Job;
  onQuickView: (job: Job) => void;
  hasApplied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onQuickView, hasApplied: hasAppliedProp }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { saveJob, removeJob, isJobSaved } = useJobStore();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState<boolean>(hasAppliedProp ?? false);
  
  const isSaved = isJobSaved(String(job.id));

  useEffect(() => {
    if (hasAppliedProp !== undefined) {
      setHasApplied(hasAppliedProp);
      return;
    }

    const initializeApplication = async () => {
      if (!user) return;
      const existing = await apiService.getApplications(user.id);
      const applied = existing.data.some((app: any) => String(app.jobId) === String(job.id));
      setHasApplied(applied);
    };
    initializeApplication();
  }, [job.id, user, hasAppliedProp]);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      return;
    }

    setIsApplying(true);
    const loadingToast = toast.loading("Submitting application...");
    try {
      await apiService.applyForJob(String(job.id), user?.id || "1");
      setHasApplied(true);
      toast.success("Applied successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Apply failed:", error);
      toast.error("Failed to apply.", { id: loadingToast });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      return;
    }

    setIsSaving(true);
    const userId = user?.id || "1";
    try {
      if (isSaved) {
        await apiService.removeSavedJob(String(job.id), userId);
        removeJob(String(job.id));
      } else {
        await apiService.saveJob(String(job.id), userId);
        saveJob(String(job.id));
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to update saved jobs.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.01 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onQuickView(job)}
      className="glass-card p-8 group relative overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(124,58,237,0.12)] cursor-pointer border-white/40"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-purple-500/10 transition-colors duration-700"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-700"></div>

      <div className="flex flex-col h-full">
        {/* Top Section: Logo & Title */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white p-3 border border-slate-100 shadow-sm group-hover:border-purple-200 group-hover:shadow-md transition-all duration-500">
              <img 
                src={job.logo || `https://picsum.photos/seed/${job.company}/120/120`} 
                alt={job.company} 
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-widest border border-purple-100/50">
                  {job.category.split(' ')[0]}
                </span>
                {job.postedAt?.includes('h') && (
                  <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest border border-green-100/50 flex items-center">
                    <Sparkles className="h-2 w-2 mr-1" /> New
                  </span>
                )}
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                {job.title}
              </h3>
              <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                <Building2 className="h-3 w-3 mr-1.5 text-purple-400" />
                {job.company}
              </div>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "p-3 rounded-2xl transition-all duration-500",
              isSaved 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
                : "bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-100"
            )}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />}
          </motion.button>
        </div>

        {/* Middle Section: Details Grid */}
        <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-8">
          <div className="flex items-center text-slate-600 text-xs font-semibold">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-purple-50 transition-colors">
              <MapPin className="h-4 w-4 text-purple-500" />
            </div>
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center text-slate-600 text-xs font-semibold">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-purple-50 transition-colors">
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
            <span className="truncate">{job.salary || "Competitive"}</span>
          </div>
          <div className="flex items-center text-slate-600 text-xs font-semibold">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-purple-50 transition-colors">
              <Briefcase className="h-4 w-4 text-purple-500" />
            </div>
            <span className="truncate">{job.type}</span>
          </div>
          <div className="flex items-center text-slate-600 text-xs font-semibold">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-purple-50 transition-colors">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <span className="truncate">{job.postedAt || "Recently"}</span>
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="mt-auto pt-6 border-t border-slate-100/60 flex items-center justify-between">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(job);
            }}
            className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-purple-600 transition-all flex items-center group/btn"
          >
            Quick View <ArrowUpRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleApply}
            disabled={isApplying || hasApplied}
            className={cn(
              "px-7 py-3 rounded-2xl text-[10px] font-bold transition-all duration-500 flex items-center space-x-2 uppercase tracking-widest",
              hasApplied 
                ? "bg-green-500 text-white shadow-lg shadow-green-100" 
                : "premium-button-primary"
            )}
          >
            {isApplying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Applied</span>
              </>
            ) : (
              <span>Apply Now</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
