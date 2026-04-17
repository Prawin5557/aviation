import React from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Global Aviation Summit 2024",
    date: "May 15-17, 2024",
    location: "Dubai, UAE",
    type: "Conference",
    image: "https://images.unsplash.com/photo-1540575861501-7ad058df3283?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Campus Recruitment Drive",
    date: "June 10, 2024",
    location: "New Delhi, India",
    type: "Hiring",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Aviation Tech Workshop",
    date: "July 05, 2024",
    location: "Singapore",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Events() {
  return (
    <div className="pt-20">
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Upcoming <span className="text-purple-600">Events</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join us at our global summits, campus drives, and specialized workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, idx) => (
              <div 
                key={idx}
                className="glass-card overflow-hidden group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-purple-600 uppercase tracking-widest">
                    {event.type}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600 font-medium">
                      <Calendar className="h-4 w-4 text-purple-600 mr-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-slate-600 font-medium">
                      <MapPin className="h-4 w-4 text-purple-600 mr-3" />
                      {event.location}
                    </div>
                  </div>
                  <button className="premium-button-outline w-full py-4 flex items-center justify-center space-x-2">
                    <span>Register Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
