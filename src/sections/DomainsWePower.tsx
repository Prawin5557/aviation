import React from "react";
import { Button } from "@/src/components/ui/Button";
import { 
  Plane, 
  Building2, 
  Wrench, 
  Settings, 
  Shield, 
  Globe, 
  Cpu, 
  PlaneTakeoff,
  ArrowRight 
} from "lucide-react";

const domains = [
  {
    title: "Commercial Aviation",
    subtext: "Airlines • Airports • Passenger Operations",
    icon: Plane,
  },
  {
    title: "Business & Private Aviation",
    subtext: "Charters • VIP Operations",
    icon: Building2,
  },
  {
    title: "MRO & Technical Services",
    subtext: "Maintenance • Repair • Engineering",
    icon: Wrench,
  },
  {
    title: "Aerospace Manufacturing",
    subtext: "OEM • Components • Tooling",
    icon: Settings,
  },
  {
    title: "Defense, Military & Drones",
    subtext: "UAV • Tactical Ops • Military Aviation",
    icon: Shield,
  },
  {
    title: "Airport Operations",
    subtext: "Ramp • Ground Ops • Safety",
    icon: Globe,
  },
  {
    title: "Aviation Technology & Digital",
    subtext: "AI • Avionics • Software Systems",
    icon: Cpu,
  },
  {
    title: "Aircraft Manufacturers",
    subtext: "Production • Assembly • Structures",
    icon: PlaneTakeoff,
  }
];

export default function DomainsWePower() {
  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div 
          className="text-center mb-10 space-y-3"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Domains We <span className="text-purple-600">Power</span>
          </h2>
          <p className="text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Complete aviation ecosystem served with unmatched global workforce expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {domains.map((domain, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-200 hover:shadow-xl transition-all group hover:-translate-y-1.5 hover:scale-[1.01]"
            >
              <div className="bg-purple-50 w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mb-5 group-hover:bg-purple-600 transition-colors duration-500">
                <domain.icon className="h-7 w-7 text-purple-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-purple-600 transition-colors">
                {domain.title}
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
                {domain.subtext}
              </p>
            </div>
          ))}
        </div>

        <div 
          className="flex justify-center"
        >
          <Button size="md" className="px-10 group">
            <span className="flex items-center space-x-2">
              <span>Speak to an Expert</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

      </div>
    </section>
  );
}