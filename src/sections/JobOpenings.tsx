import React, { useState, useEffect } from "react";
import {
  Plane,
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { apiService } from "@/src/services/api";
import { Job } from "@/src/types";
import { Link } from "react-router-dom";
import { motion, Variants, TargetAndTransition, Transition, Easing } from "framer-motion";

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiService.getJobs();
        setJobs(response.data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const jobRowVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, duration: 0.7, ease: "easeOut" },
    }),
  };

  const ctaVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 py-16">
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 bg-purple-300/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ y: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-300/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ y: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mb-12 text-center"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-100/70 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple-700 shadow-md">
            <Sparkles size={14} className="mr-2 text-purple-500 animate-pulse" />
            Discover Your Next Aviation Role
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Latest Aviation <span className="bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">Job Openings</span>
          </h2>
          <p className="text-base lg:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Updated in real-time - explore the newest global opportunities across airlines, MROs, airports, and private aviation.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/60"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          <div className="hidden grid-cols-12 items-center gap-4 rounded-t-3xl bg-linear-to-br from-slate-800 to-slate-900 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white md:grid">
            <div className="col-span-5 flex items-center space-x-3">
              <Plane className="h-3 w-3 text-purple-400" />
              <span>Role</span>
            </div>
            <div className="col-span-3 flex items-center space-x-3">
              <MapPin className="h-3 w-3 text-purple-400" />
              <span>Location</span>
            </div>
            <div className="col-span-2 flex items-center space-x-3">
              <Clock className="h-3 w-3 text-purple-400" />
              <span>Type</span>
            </div>
            <div className="col-span-2 flex items-center space-x-3">
              <Briefcase className="h-3 w-3 text-purple-400" />
              <span>Category</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center animate-pulse"
                  variants={jobRowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  <div className="md:col-span-5 h-5 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="md:col-span-3 h-4 bg-slate-200 rounded-md w-1/2"></div>
                  <div className="md:col-span-2 h-4 bg-slate-200 rounded-md w-1/2"></div>
                  <div className="md:col-span-2 h-4 bg-slate-200 rounded-md w-1/2"></div>
                </motion.div>
              ))
            ) : (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  variants={jobRowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className="group transition-all duration-300"
                >
                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-grid w-full cursor-pointer grid-cols-1 items-center gap-3 px-4 py-4 transition-colors hover:bg-linear-to-br hover:from-purple-50 hover:to-white md:grid-cols-12 md:gap-4 md:px-6"
                  >
                    <div className="md:col-span-5 flex items-center space-x-4">
                      <Plane className="h-5 w-5 text-purple-600 shrink-0" />
                      <span className="text-slate-900 font-semibold text-base leading-tight group-hover:text-purple-700 transition-colors">
                        {job.title}
                      </span>
                    </div>
                    <div className="md:col-span-3 flex items-center space-x-3 text-slate-500 font-medium">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-3 text-slate-500 font-medium">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{job.type}</span>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-slate-500 font-medium">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-1">{job.category}</span>
                      </div>
                      <motion.div
                        className="flex items-center space-x-1 text-purple-600 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mt-16"
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 px-10 py-3 text-base font-bold text-white no-underline shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400/40"
          >
            <span className="flex items-center space-x-2">
              <span>View All Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}