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
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-md border border-purple-100/70 text-purple-700 text-xs font-bold uppercase tracking-[0.1em] mb-4">
            <Sparkles size={14} className="mr-2 text-purple-500 animate-pulse" />
            Discover Your Next Aviation Role
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Latest Aviation <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">Job Openings</span>
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white px-6 py-4 grid grid-cols-12 gap-4 items-center font-semibold text-xs uppercase tracking-widest rounded-t-3xl">
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
                  className="px-6 py-4 grid grid-cols-12 gap-4 items-center animate-pulse"
                  variants={jobRowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  <div className="col-span-5 h-5 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="col-span-3 h-4 bg-slate-200 rounded-md w-1/2"></div>
                  <div className="col-span-2 h-4 bg-slate-200 rounded-md w-1/2"></div>
                  <div className="col-span-2 h-4 bg-slate-200 rounded-md w-1/2"></div>
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
                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gradient-to-br hover:from-purple-50 hover:to-white transition-colors cursor-pointer block"
                  >
                    <div className="col-span-5 flex items-center space-x-4">
                      <Plane className="h-5 w-5 text-purple-600 shrink-0" />
                      <span className="text-slate-900 font-semibold text-base leading-tight group-hover:text-purple-700 transition-colors">
                        {job.title}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center space-x-3 text-slate-500 font-medium">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="col-span-2 flex items-center space-x-3 text-slate-500 font-medium">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{job.type}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
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
            className="inline-flex items-center justify-center px-10 py-3 text-base font-bold rounded-2xl shadow-lg text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/40 no-underline"
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