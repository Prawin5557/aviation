import React from "react";
import { Button } from "@/src/components/ui/Button";
import { Plane, Quote, ArrowRight } from "lucide-react";

interface Testimonial {
  quote: string;
  outcome: string;
  region: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Scaled contract engineers during peak overhaul season with zero downtime across North American operations.",
    outcome: "Zero-delay turnarounds",
    region: "North America"
  },
  {
    quote: "Aviation Indeed delivered 120+ licensed AMEs for rapid maintenance expansion across Middle East operations. Their aviation-first approach made onboarding seamless.",
    outcome: "120+ AMEs hired",
    region: "Middle East"
  },
  {
    quote: "Sourced FAA/EASA-compliant engineers in record time, enabling two maintenance bays launch ahead of schedule in Europe.",
    outcome: "Launch accelerated by 6 months",
    region: "Europe"
  },
  {
    quote: "Built complete aviation tech division — software, QA, avionics integration — within 40 days across APAC markets.",
    outcome: "42-member tech team built",
    region: "APAC"
  }
];

export default function VoicesFromFlightDeck() {
  return (
    <section className="py-12 bg-transparent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#9333ea" strokeWidth="1" />
              <line x1="0" y1="0" x2="40" y2="0" stroke="#9333ea" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Voices From the <span className="text-purple-600">Flight Deck</span>
          </h2>
          <p className="text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Real stories from global aviation leaders, MRO hubs and tech innovators.
          </p>
        </div>

        {/* Floating Loop Container */}
        <div className="relative mt-6 overflow-hidden py-8">
          <div className="flex gap-8 w-max animate-marquee">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-[280px] md:w-[400px] bg-white rounded-[30px] p-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col justify-between shrink-0 group transition-all hover:-translate-y-2"
              >
                <div className="space-y-8">
                  {/* Card Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.18em]">
                      <Plane className="h-3 w-3 text-purple-600" />
                      <span>Client Report</span>
                    </div>
                    <div className="px-3 py-1 rounded-lg border border-purple-100 text-purple-600 text-[9px] font-bold uppercase tracking-widest bg-purple-50">
                      Verified
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex space-x-4">
                    <Quote className="h-8 w-8 text-purple-100 shrink-0" />
                    <p className="text-slate-900 font-display font-bold leading-relaxed text-lg tracking-tight">
                      "{t.quote}"
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Outcome</span>
                    <p className="text-purple-600 font-bold text-base tracking-tight">{t.outcome}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Region</span>
                    <p className="text-slate-900 font-bold text-base tracking-tight">{t.region}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button size="md" className="px-10 group">
            <span className="flex items-center space-x-2">
              <span>Explore Case Studies</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>

      </div>
    </section>
  );
}