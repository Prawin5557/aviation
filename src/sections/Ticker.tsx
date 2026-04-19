import React, { useEffect, useState } from "react";
import { Plane, GraduationCap, Building2, ArrowRight } from "lucide-react";
import { apiService } from "@/src/services/api";

export default function Ticker() {
  const [latestJob, setLatestJob] = useState<any>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await apiService.getJobs();
        if (res.data && res.data.length > 0) {
          setLatestJob(res.data[0]);
        }
      } catch (error) {
        // Keep fallback ticker text without polluting the console in frontend-only mode.
      }
    };
    fetchLatest();
  }, []);

  const tickerItems = [
    {
      icon: <Plane className="h-4 w-4 text-purple-100" />,
      badge: "Latest Job",
      text: latestJob ? `${latestJob.title} - ${latestJob.company}` : "Chief Manager - IOCC - Apply Now",
      link: latestJob ? `/jobs/${latestJob.id}` : "/jobs"
    },
    {
      icon: <GraduationCap className="h-4 w-4 text-purple-100" />,
      badge: "Live Session",
      text: "Live Aviation Masterclass on 24th April - Register Now",
      link: "/programs"
    },
    {
      icon: <Building2 className="h-4 w-4 text-purple-100" />,
      badge: "For Employers",
      text: "Hire Aviation Talent Faster with Our Premium Solutions",
      link: "/contact"
    }
  ];

  return (
    <div className="bg-purple-900 border-t-2 border-yellow-400 h-11 flex items-center overflow-hidden relative z-60">
      <div className="flex whitespace-nowrap items-center animate-marquee">
        {/* Duplicate items for seamless loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="flex items-center mx-12 text-white">
            <span className="mr-3">{item.icon}</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mr-3 backdrop-blur-sm">
              {item.badge}
            </span>
            <span className="text-sm font-bold tracking-tight flex items-center font-display">
              {item.text} <ArrowRight className="ml-2 h-3 w-3 opacity-70" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
