import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Award, MapPin, Users, GraduationCap } from "lucide-react";

// 1. Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest)) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const statsData = [
  { id: 1, label: "Years Expertise", value: 20, suffix: "+", icon: Award },
  { id: 2, label: "Cities Covered", value: 60, suffix: "+", icon: MapPin },
  { id: 3, label: "Professionals Placed", value: 20000, suffix: "+", icon: Users },
  { id: 4, label: "Partnered Colleges", value: 150, suffix: "+", icon: GraduationCap },
];

export default function Stats() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 text-center">
                <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-2 tracking-tight">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
