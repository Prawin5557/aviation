import React from "react";
import { Button } from "@/src/components/ui/Button";
import { Users, Globe, ArrowRight, MessageSquare } from "lucide-react";

export default function StrategicPartner() {
  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 
                className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
              >
                Your Strategic <span className="text-purple-600">Talent Partner</span> <br />
                for Aviation & Aerospace
              </h2>
              <div 
                className="h-1 w-full max-w-75 rounded-full bg-linear-to-r from-purple-600 to-indigo-600"
              />
              <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                The workforce engine trusted by airlines, MROs and advanced aviation companies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div 
                className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-200 flex items-center space-x-4 flex-1 hover:-translate-y-1 transition-transform"
              >
                <div className="bg-purple-50 p-2.5 rounded-xl">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Trusted By</p>
                  <p className="text-base font-bold text-slate-900">200+ aviation partners</p>
                </div>
              </div>
              <div 
                className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-200 flex items-center space-x-4 flex-1 hover:-translate-y-1 transition-transform"
              >
                <div className="bg-purple-50 p-2.5 rounded-xl">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Global Network</p>
                  <p className="text-base font-bold text-slate-900">400,000+ Experts</p>
                </div>
              </div>
            </div>

            <Button size="md" className="group px-8">
              <span className="flex items-center">
                Talk to an expert <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          <div 
            className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-200"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-widest">
                  <MessageSquare className="h-3 w-3" />
                  <span>Speak to an expert</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Response within 24 hours</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Name</label>
                  <input type="text" placeholder="Your full name" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Business Email</label>
                  <input type="email" placeholder="you@company.com" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                  <input type="text" placeholder="+91 98765 43210" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Company Name</label>
                  <input type="text" placeholder="Aviation Corp Pvt Ltd" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Designation</label>
                  <input type="text" placeholder="HR Manager / Director" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Employee Strength</label>
                  <input type="text" placeholder="Ex: 250" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all font-medium" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="serviceRequirement" className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-4">Need your service in</label>
                  <select id="serviceRequirement" title="Need your service in" className="w-full h-10 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-4 text-sm text-slate-700 appearance-none cursor-pointer transition-all font-medium">
                    <option value="">Select</option>
                    <option value="hiring">Hiring Solutions</option>
                    <option value="rtd">Recruit Train Deploy</option>
                    <option value="hr">Managed HR Services</option>
                    <option value="vcc">Virtual Captive Centre</option>
                    <option value="campus">Campus Hiring</option>
                    <option value="marketing">Digital Marketing</option>
                  </select>
                </div>
              </div>

                <button className="premium-button-primary w-full h-11 text-sm font-bold">
                  <span className="flex items-center justify-center">
                    Request hiring proposal <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}