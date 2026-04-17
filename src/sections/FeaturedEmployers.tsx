import React from "react";
import { motion, Variants } from "framer-motion";

const partners = [
  { name: "Emirates", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/512px-Emirates_logo.svg.png" },
  { name: "Qatar Airways", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/512px-Qatar_Airways_Logo.svg.png" },
  { name: "Singapore Airlines", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Singapore_Airlines_Logo.svg/512px-Singapore_Airlines_Logo.svg.png" },
  { name: "Lufthansa", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/512px-Lufthansa_Logo_2018.svg.png" },
  { name: "Boeing", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Boeing_full_logo.svg/512px-Boeing_full_logo.svg.png" },
  { name: "Airbus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Airbus_Logo_2017.svg/512px-Airbus_Logo_2017.svg.png" },
  { name: "IndiGo", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/IndiGo_logo.svg/512px-IndiGo_logo.svg.png" },
  { name: "Vistara", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Vistara_logo.svg/512px-Vistara_logo.svg.png" },
  { name: "GMR", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/GMR_Group_logo.svg/512px-GMR_Group_logo.svg.png" },
  { name: "Rolls-Royce", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Rolls-Royce_Motor_Cars_logo.svg/512px-Rolls-Royce_Motor_Cars_logo.svg.png" },
];

const marqueeVariants: Variants = {
  animate: {
    x: [0, "-50%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 40, // Adjust duration for speed
        ease: "linear",
      },
    },
  },
};

export default function FeaturedEmployers() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
            Powering Careers at Top Aviation Companies
          </h3>
        </div>
        <div className="relative h-24 overflow-x-hidden">
          <motion.div
            className="absolute left-0 flex gap-16"
            variants={marqueeVariants}
            animate="animate"
          >
            {[...partners, ...partners].map((partner, i) => (
              <div key={i} className="shrink-0 w-48 h-24 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}