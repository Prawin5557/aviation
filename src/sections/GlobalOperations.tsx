import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RegionData {
  id: string;
  name: string;
  title: string;
  countries: string[];
  description: string;
}

const regions: RegionData[] = [
  {
    id: "north-america",
    name: "North America",
    title: "North America Operations",
    countries: ["USA", "Canada", "Mexico"],
    description: "Our North American operations focus on connecting top-tier aviation talent with leading aerospace manufacturers and major airlines across the continent, ensuring a steady pipeline of skilled professionals for the evolving industry needs."
  },
  {
    id: "europe",
    name: "Europe",
    title: "Europe Operations",
    countries: [
      "Ireland", "United Kingdom", "Germany", "France", "Netherlands",
      "Belgium", "Sweden", "Norway", "Denmark", "Finland",
      "Spain", "Italy", "Poland", "Hungary", "Romania"
    ],
    description: "Through our Ireland based partnership, Aviation Indeed supports aviation, aerospace, and defence organisations across Europe, backed by a strong pool of compliant, type rated engineers and a proven track record of delivering ready to deploy talent to airlines and MROs."
  },
  {
    id: "middle-east",
    name: "Middle East",
    title: "Middle East Operations",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Israel"],
    description: "With an upcoming office in Dubai, Aviation Indeed supports Middle East aviation growth by preparing India based talent to meet regional standards, enabling airlines, MROs, and hangars to access scalable, cost effective, English speaking professionals."
  },
  {
    id: "asia-pacific",
    name: "Asia Pacific",
    title: "Asia Pacific Operations",
    countries: ["India", "Singapore", "Australia", "Malaysia", "Thailand", "Vietnam"],
    description: "As the fastest-growing aviation market, our Asia Pacific operations leverage our deep roots in India to provide comprehensive recruitment and training solutions, supporting the rapid expansion of regional carriers and infrastructure projects."
  }
];

export default function GlobalOperations() {
  const [activeRegion, setActiveRegion] = useState(regions[2]); // Default to Middle East as per image

  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Trusted Across <span className="text-purple-600">The Globe</span>
            </h2>
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
              We are an official placement partner of the Aerospace and Aviation Sector Skill Council, committed to bridging skill gaps and strengthening employability across aviation, aerospace, and defence.
            </p>
          </div>
          <div className="shrink-0 bg-white p-4 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200">
            <img 
              src="https://aassc.in/wp-content/uploads/2021/06/AASSC-Logo-1.png" 
              alt="AASSC Logo" 
              className="h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/aassc/200/100";
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-slate-200">
            <div className="grid grid-cols-2 gap-4 h-full">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setActiveRegion(region)}
                  className={`flex items-center justify-center p-5 rounded-2xl text-base font-bold transition-all duration-300 h-24 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.98] ${
                    activeRegion.id === region.id
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-slate-50 text-slate-400 hover:bg-white hover:text-purple-600 border border-transparent hover:border-slate-200"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-3xl p-6 lg:p-10 shadow-lg shadow-slate-200/40 border border-slate-200 h-full relative z-10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50" />

                <div className="space-y-6 relative z-10">
                  <div className="h-1 w-full max-w-50 rounded-full bg-linear-to-r from-purple-600 to-indigo-600" />
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {activeRegion.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {["Global Clients", "Active Hiring", "Aviation Expertise"].map((badge) => (
                        <span 
                          key={badge}
                          className="px-3 py-1 rounded-lg border border-purple-100 text-purple-600 text-[9px] font-bold uppercase tracking-widest bg-purple-50"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-5">
                    {activeRegion.countries.map((country, i) => (
                      <motion.div 
                        key={country} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center space-x-2 group"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-600 transition-colors shrink-0" />
                        <span className="text-slate-600 font-bold text-sm tracking-tight group-hover:text-purple-600 transition-colors">
                          {country}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium pt-6 border-t border-slate-200">
                    {activeRegion.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}