import React, { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Globe, Users, Check, Zap, Crown } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { SmartSearch } from "@/src/components/common/SmartSearch";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePlanStore } from "@/src/store/planStore";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { cn } from "@/src/lib/utils";

export default function Hero() {
  const navigate = useNavigate();
  const { plans, fetchPlans, isLoading } = usePlanStore();

  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, []);

  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleSearch = (query: string, filters: any) => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (filters.type !== "all") params.append("type", filters.type);
    if (filters.location !== "all") params.append("location", filters.location);
    if (filters.experience !== "all") params.append("experience", filters.experience);
    
    navigate(`/jobs?${params.toString()}`);
  };

  const getPlanIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case "prime": return Globe;
      case "premium": return Zap;
      case "elite": return Crown;
      default: return Zap;
    }
  };

  const getPlanColors = (id: string) => {
    switch (id.toLowerCase()) {
      case "prime": return { color: "text-blue-500", bg: "bg-blue-50" };
      case "premium": return { color: "text-purple-600", bg: "bg-purple-50" };
      case "elite": return { color: "text-amber-600", bg: "bg-amber-50" };
      default: return { color: "text-purple-600", bg: "bg-purple-50" };
    }
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col pt-24 pb-20 bg-slate-50/30 overflow-hidden"
    >
      {/* Premium background elements */}
      <motion.div
        style={{ x: useTransform(mouseX, (v) => v / -20), y: useTransform(mouseY, (v) => v / -20) }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-250 h-250 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(mouseX, (v) => v / 20), y: useTransform(mouseY, (v) => v / 20) }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-200 h-200 bg-fuchsia-500/10 rounded-full blur-[150px] pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grow flex flex-col items-center">
        <div className="text-center space-y-6 mb-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-premium border border-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles size={14} className="mr-2 animate-pulse" />
              Aviation Career Acceleration
            </span>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight">
              Your Flight Path to <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-fuchsia-600 to-pink-600">
                Professional Excellence
              </span>
            </h1>

            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Stop searching, start soaring. Choose the membership that matches your ambition and join <span className="text-slate-900 font-bold">400,000+</span> aviation leaders.
            </p>
          </motion.div>
        </div>

        {/* Subscription Plans Grid - The Primary Focus */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-150 rounded-[40px]" />)
          ) : (
            plans.map((plan, i) => {
              return (
                <InteractivePlanCard
                  key={plan.id}
                  plan={plan}
                  Icon={getPlanIcon(plan.id)}
                  colors={getPlanColors(plan.id)}
                  isPopular={plan.id === "premium"}
                  index={i}
                />
              );
            })
          )}
        </div>

        {/* Secondary Search Focus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 w-full max-w-3xl text-center"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Or search our global database</p>
          <SmartSearch onSearch={handleSearch} />
        </motion.div>
      </div>
    </section>
  );
}

const InteractivePlanCard = ({ plan, isPopular, Icon, colors, index }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      className="flex w-full"
    >
      <div
        className={cn(
          "glass-card flex-1 flex flex-col p-8 relative group transition-all duration-500 rounded-[48px]",
          isPopular
            ? 'border-purple-200 shadow-premium-hover ring-4 ring-purple-500/5 scale-105 z-10 bg-white/90'
            : 'border-white/60 hover:border-purple-100 bg-white/40'
        )}
      >
        {isPopular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-fuchsia-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
            Recommended for Professionals
          </div>
        )}

        <div className="mb-10 transform-[translateZ(50px)]">
          <div className={`w-16 h-16 rounded-3xl ${colors.bg} ${colors.color} flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500 shadow-sm`}>
            <Icon size={32} />
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">{plan.name}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.description}</p>
        </div>

        <div className="mb-10 transform-[translateZ(40px)]">
          <div className="flex items-baseline">
            <span className="text-4xl font-display font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
            <span className="text-slate-400 font-bold ml-2 text-lg">/{plan.period === 'month' ? 'mo' : 'one-time'}</span>
          </div>
          <div className="mt-2 h-1 w-12 bg-purple-100 rounded-full" />
        </div>

        <div className="space-y-6 mb-12 grow transform-[translateZ(30px)]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Benefits</p>
          <ul className="space-y-4">
            {plan.features.map((feature: string, i: number) => (
              <li key={feature}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start text-sm text-slate-700 font-medium leading-tight"
                >
                  <div className={`mt-0.5 mr-4 p-1 rounded-full ${colors.bg} ${colors.color} shrink-0`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {feature}
                </motion.div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 transform-[translateZ(20px)]">
          <Link to="/register" className="block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isPopular ? "primary" : "outline"}
                className={`w-full h-12 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 ${isPopular ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                Select {plan.name} Plan
              </Button>
            </motion.div>
          </Link>
          <Link to="/jobs" className="block text-center">
            <span className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors cursor-pointer">
              Preview Available Jobs
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
