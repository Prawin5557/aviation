import React from "react";

const partners = [
  { name: "Airbus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Airbus_Logo_2017.svg/512px-Airbus_Logo_2017.svg.png" },
  { name: "Air India Express", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Air_India_Express_logo.svg/512px-Air_India_Express_logo.svg.png" },
  { name: "Air Works", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23f8fafc'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23937bbd' font-family='Inter, sans-serif' font-size='18'%3EAir Works%3C/text%3E%3C/svg%3E" },
  { name: "Akasa Air", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/512px-Akasa_Air_logo.svg.png" },
  { name: "Alpha Design Technologies", logo: "https://www.adtl.co.in/images/logo.png" },
  { name: "ATC", logo: "https://www.atc-aero.com/wp-content/uploads/2021/04/atc-logo.png" }
];

export default function TrustedPartners() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Trusted Aviation <span className="text-purple-600">Partners</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto">
            Serving 150+ global airlines, MROs, airports and aerospace leaders.
          </p>
        </div>

        {/* Floating Logo Container */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {partners.map((partner, i) => (
              <div
                key={i}
                className="w-32 h-20 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${partner.name}/200/100?blur=2`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
