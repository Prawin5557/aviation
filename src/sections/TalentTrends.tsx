import React from "react";
import { Button } from "@/src/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function TalentTrends() {
  return (
    <section className="py-10 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b21a8" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
          <div className="w-full lg:w-2/5">
            <div className="relative group">
              <div className="absolute -inset-6 bg-purple-500/8 blur-[80px] rounded-[40px] group-hover:bg-purple-500/15 transition-all duration-700" />
              
              <div className="relative hover:scale-[1.01] transition-transform duration-500">
                <img 
                  src="https://picsum.photos/seed/aviation-report/800/1000" 
                  alt="Aviation Talent Trends 2026 Report" 
                  className="w-full aspect-3/4 object-cover rounded-3xl shadow-xl border border-white/40"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-purple-900/30 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-200 md:block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 p-2 rounded-xl">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-base leading-tight">2026 Edition</p>
                      <p className="text-purple-600 font-bold text-[9px] uppercase tracking-[0.15em]">Available Now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-lg border border-purple-100 text-purple-600 font-bold text-[9px] uppercase tracking-[0.2em] bg-purple-50/50">
                <span>Industry Report</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Aviation Talent <br />
                <span className="text-purple-600">Trends 2026</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
                Explore how global hiring, digital skills, and cross-border talent movement are reshaping the aviation workforce. Understand where demand is rising, which roles are evolving, and how companies are preparing for the future.
              </p>
            </div>

            <div className="space-y-5">
              <Button size="md" className="px-10 h-14 text-base group">
                <span className="flex items-center space-x-2">
                  <span>Download the Report</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <div className="flex items-center space-x-4 text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span>Free download</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}