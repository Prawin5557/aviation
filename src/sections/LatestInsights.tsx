import React, { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  id: string;
  title: string;
  description: string;
  date?: string;
  type: "featured" | "side";
}

const categories = [
  "Aviation Insights",
  "HR Insights",
  "Global Trends",
  "Case Studies",
  "Career Growth"
];

const insightsData: Record<string, Insight[]> = {
  "Aviation Insights": [
    {
      id: "f1",
      type: "featured",
      title: "Airport Expansion in India: What It Means for Aviation Jobs",
      description: "How India's rapid airport expansion is reshaping aviation hiring, manpower demand, and long-term career opportunities across airports, cargo, and ground operations.",
      date: "January 5, 2026"
    },
    {
      id: "s1",
      type: "side",
      title: "The Aviation Hiring Landscape in India: 2026 Outlook",
      description: "A data-driven look at aviation hiring in India for 2026 — examining demand vs supply across airlines, airports, and MROs, and what it means for employers and professionals."
    },
    {
      id: "s2",
      type: "side",
      title: "The Rise of Multi Skilled Aviation Employees: Why Companies Prefer Hybrid Roles Now",
      description: "Why multi-skilled hybrid aviation roles are becoming the new hiring trend across airlines, airports and MROs — and how candidates can prepare."
    }
  ],
  "HR Insights": [
    {
      id: "f2",
      type: "featured",
      title: "Retention Strategies for the Modern Aviation Workforce",
      description: "Discover the latest trends in employee retention and how aviation companies are adapting their HR policies to keep top talent in a competitive market.",
      date: "February 12, 2026"
    },
    {
      id: "s3",
      type: "side",
      title: "Digital Transformation in Aviation HR",
      description: "How AI and automation are streamlining the recruitment and onboarding processes in major airlines."
    },
    {
      id: "s4",
      type: "side",
      title: "Diversity and Inclusion in the Cockpit",
      description: "Examining the progress and challenges of diversity initiatives within flight operations."
    }
  ]
};

export default function LatestInsights() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const currentInsights = insightsData[activeCategory] || insightsData["Aviation Insights"];
  const featured = currentInsights.find(i => i.type === "featured");
  const sides = currentInsights.filter(i => i.type === "side");

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Latest <span className="text-purple-600">Insights</span>
          </h2>
          <p className="text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Premium aviation intelligence across 5 editorial categories.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                activeCategory === cat
                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white border-slate-200 text-slate-500 hover:border-purple-200 hover:text-purple-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 min-h-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-featured`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-lg shadow-slate-200/40 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50" />

              <div className="space-y-8 relative z-10">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-[0.15em]">Featured Insight</span>
                  <span className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.15em]">{featured?.date}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-purple-600 transition-colors">
                  {featured?.title}
                </h3>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                  {featured?.description}
                </p>
              </div>
              <div className="mt-10 relative z-10">
                <Button size="md" className="px-8 group">
                  <span className="flex items-center space-x-2">
                    <span>Read Full Insight</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-sides`}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="space-y-6"
              >
                {sides.map((side) => (
                  <motion.div
                    key={side.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md shadow-slate-200/40 hover:shadow-lg transition-all group cursor-pointer hover:translate-x-1.5"
                  >
                    <div className="flex items-start space-x-5">
                      <div className="bg-purple-50 p-3 rounded-xl shrink-0 group-hover:bg-purple-600 transition-colors">
                        <BarChart3 className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight tracking-tight">
                          {side.title}
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-sm font-medium line-clamp-2">
                          {side.description}
                        </p>
                        <div className="text-purple-600 font-bold text-[9px] flex items-center space-x-1 uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="md" className="px-10 group">
            <span className="flex items-center space-x-2">
              <span>Explore All Insights</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

      </div>
    </section>
  );
}