import React, { useState, useEffect } from "react";
import { Check, Zap, Shield, Crown, Loader2, Star, Sparkles, Rocket, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { usePlanStore } from "@/src/store/planStore";
import { usePayment } from "@/src/hooks/usePayment";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Subscriptions() {
  const { user } = useAuthStore();
  const { plans, fetchPlans, isLoading: plansLoading } = usePlanStore();
  const { openPayment } = usePayment();

  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, []);

  const handleUpgrade = (planId: string, planName: string) => {
    if (!user) {
      toast.error("Please login to upgrade");
      return;
    }
    openPayment(planId, planName);
  };

  const getPlanIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case "prime": return Shield;
      case "premium": return Zap;
      case "placement": return Crown;
      default: return Shield;
    }
  };

  const getPlanGradient = (id: string) => {
    switch (id.toLowerCase()) {
      case "prime": return "from-blue-500 to-cyan-500";
      case "premium": return "from-purple-500 to-pink-500";
      case "placement": return "from-amber-500 to-orange-500";
      default: return "from-slate-500 to-slate-600";
    }
  };

  const isPlacement = (id: string) => id.toLowerCase() === "placement";

  if (plansLoading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-display font-bold text-slate-900">Choose Your Plan</h1>
          <p className="text-slate-500 text-lg font-medium mt-4">Unlock premium features and accelerate your aviation career with our specialized plans.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => {
          const isCurrent = user?.subscription?.toLowerCase() === plan.id.toLowerCase() || (!user?.subscription && plan.id === 'prime');
          const Icon = getPlanIcon(plan.id);
          const gradient = getPlanGradient(plan.id);
          const isPlacementPlan = isPlacement(plan.id);
          
          return (
            <motion.div 
              key={plan.id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-8 rounded-4xl! border-2 transition-all relative overflow-hidden flex flex-col ${
                isPlacementPlan 
                  ? 'border-amber-400/50 shadow-2xl shadow-amber-100/30 scale-[1.02] lg:-mt-4' 
                  : isCurrent 
                    ? 'border-purple-600/50 shadow-xl shadow-purple-100/20' 
                    : 'border-white/20 hover:border-purple-200/50'
              }`}
            >
              {isPlacementPlan && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 via-orange-500 to-amber-400" />
              )}
              
              {isCurrent && (
                <div className="absolute top-6 -right-8.75 bg-purple-600 text-white text-[10px] font-bold py-1 px-12 rotate-45 uppercase tracking-widest">
                  Current
                </div>
              )}

              {isPlacementPlan && !isCurrent && (
                <div className="absolute top-6 -right-7.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold py-1 px-10 rotate-45 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Best Value
                </div>
              )}
              
              <div className="space-y-6 grow">
                <div className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${gradient} text-white shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                  <div className="flex items-baseline mt-4">
                    <span className="text-4xl font-display font-bold text-slate-900">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-400 font-medium ml-2">
                      /{plan.period === 'month' ? 'month' : 'one-time'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-100">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-slate-600 font-medium text-sm">
                      <Check className={`h-4 w-4 mr-3 shrink-0 mt-0.5 ${
                        isPlacementPlan ? 'text-amber-500' : 'text-purple-600'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleUpgrade(plan.id, plan.name)}
                disabled={isCurrent}
                className={`w-full py-4 mt-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? 'bg-slate-100/50 text-slate-400 cursor-default' 
                    : isPlacementPlan
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200/50 hover:scale-105'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 hover:scale-105'
                }`}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : isPlacementPlan ? (
                  <>
                    <Rocket className="h-4 w-4" />
                    Get Placement Guarantee
                  </>
                ) : (
                  <>
                    Upgrade Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Value Proposition Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-8 rounded-4xl! border-amber-100 bg-linear-to-br from-amber-50/50 to-orange-50/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 text-white">
            <Crown className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Why Choose Placement Plan?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Star, title: "Guaranteed Interviews", desc: "Get direct interview opportunities with top aviation companies" },
            { icon: Sparkles, title: "1-on-1 Mentorship", desc: "Personal guidance from industry veterans throughout your journey" },
            { icon: Rocket, title: "Placement Support", desc: "Dedicated assistance until you land your dream aviation job" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/80 text-amber-600 shadow-sm">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
