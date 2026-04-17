import React from "react";
import { Award, Users, Globe, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="pt-12">
      {/* Hero Section */}
      <section className="py-12 bg-transparent text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Pioneering Aviation <span className="text-purple-600">Excellence</span>
          </h1>
          <p 
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            ARMZ Aviation is a global leader in aviation talent solutions, training, and strategic consulting.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div 
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To bridge the gap between aviation industry demands and talent supply through innovative recruitment, 
                world-class training, and strategic partnerships. We empower professionals to reach new heights 
                and help organizations build high-performance teams.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-purple-600">15+</h4>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Countries</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-purple-600">400k+</h4>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Experts</p>
                </div>
              </div>
            </div>
            <div 
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109c055?auto=format&fit=crop&q=80&w=800" 
                alt="Aviation Excellence" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Integrity", desc: "Unwavering commitment to ethical practices and transparency." },
              { icon: Award, title: "Excellence", desc: "Striving for the highest standards in everything we do." },
              { icon: Users, title: "Collaboration", desc: "Building strong partnerships to achieve shared goals." },
              { icon: Globe, title: "Innovation", desc: "Embracing new technologies and forward-thinking solutions." }
            ].map((value, idx) => (
              <div 
                key={idx}
                className="glass-card p-8 text-center space-y-4"
              >
                <div className="inline-flex p-3 bg-purple-50 rounded-xl text-purple-600">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
