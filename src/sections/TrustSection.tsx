import React from "react";
import { Shield, Globe, Users, ShieldCheck, Star } from "lucide-react";

const features = [
  {
    title: "Aviation DNA",
    description: "Built by aviation experts — every solution reflects real operational understanding, not assumptions.",
    icon: Shield,
  },
  {
    title: "Cost-Saving",
    description: "Smart, targeted hiring cuts waste and reduces effort while keeping quality consistently high.",
    icon: Globe,
  },
  {
    title: "Speed & Reliability",
    description: "Fast response, sharp coordination, and proactive follow-ups — we deliver before you ask.",
    icon: Users,
  },
  {
    title: "Extension of Your Team",
    description: "We align with your processes, culture, and KPIs — operating like your embedded hiring arm.",
    icon: ShieldCheck,
  },
];

export default function TrustSection() {
  return (
    <section className="py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          {/* Left: Trust Score Card */}
          <div 
            className="lg:w-1/3 bg-white rounded-4xl p-4 flex flex-col items-center justify-center text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-slate-50 relative"
          >
            <h3 className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-[0.2em] mb-4">Platform Trust Score</h3>
            
            <div className="flex space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
              ))}
            </div>
            
            <div className="text-3xl font-display font-bold text-purple-600 mb-1 tracking-tight">4.8<span className="text-xl text-slate-300">/5</span></div>
            <div className="text-[10px] font-mono font-medium text-slate-400 mb-4 uppercase tracking-widest">Glassdoor</div>
            
            <div className="text-[10px] font-mono font-medium text-slate-300 uppercase tracking-[0.3em]">
              Rotating Verified Ratings
            </div>
          </div>

          {/* Right: Features Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.04)] border border-slate-50 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-600 transition-colors">
                    <feature.icon className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-display font-bold text-purple-900">{feature.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
