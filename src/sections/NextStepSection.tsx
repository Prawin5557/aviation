import React from "react";
import { Button } from "@/src/components/ui/Button";
import { Briefcase, Plane, ArrowRight } from "lucide-react";

export default function NextStepSection() {
  return (
    <section className="py-12 bg-transparent relative overflow-hidden">
      {/* Subtle Dot Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#6b21a8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Your Next Step <span className="text-purple-600">Starts Here</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Whether you're building aviation teams or exploring new roles, we support your growth worldwide.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Employer Card */}
          <div className="bg-white rounded-[48px] p-10 lg:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group transition-all duration-500 relative overflow-hidden hover:-translate-y-2">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50" />

            <div className="space-y-10 relative z-10">
              <div className="bg-purple-50 w-20 h-20 rounded-4xl flex items-center justify-center shadow-sm group-hover:bg-purple-600 transition-colors duration-500">
                <Briefcase className="h-10 w-10 text-purple-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">For Employers</span>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                  Hire Aviation Talent
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Access verified global aviation professionals — pilots, AMEs, cabin crew, airport staff, MRO engineers — backed by world-class compliance processes.
                </p>
              </div>
            </div>
            <div className="mt-12 relative z-10">
              <Button size="lg" className="px-12 group">
                <span className="flex items-center space-x-3">
                  <span>Continue as Employer</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

          {/* Candidate Card */}
          <div className="bg-white rounded-[48px] p-10 lg:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group transition-all duration-500 relative overflow-hidden hover:-translate-y-2">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50" />

            <div className="space-y-10 relative z-10">
              <div className="bg-purple-50 w-20 h-20 rounded-4xl flex items-center justify-center shadow-sm group-hover:bg-purple-600 transition-colors duration-500">
                <Plane className="h-10 w-10 text-purple-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">For Candidates</span>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                  Find Aviation Jobs
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Discover global opportunities across airlines, airports, MROs, aerospace organizations, and aviation technology companies.
                </p>
              </div>
            </div>
            <div className="mt-12 relative z-10">
              <Button variant="outline" size="lg" className="px-12 group">
                <span className="flex items-center space-x-3">
                  <span>Continue as Candidate</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

