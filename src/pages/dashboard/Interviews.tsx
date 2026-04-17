import React, { useState } from "react";
import { Calendar, Clock, Video, MapPin, User, Phone, MessageSquare, CheckCircle2, AlertCircle, GraduationCap, Zap, BookOpen, Eye, EyeOff, Send, FileText, Award, TrendingUp } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";

export default function Interviews() {
  const [rescheduling, setRescheduling] = useState<number | null>(null);
  const [joinLoading, setJoinLoading] = useState<number | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const upcomingInterviews = [
    {
      id: 1,
      title: "Technical Interview - Round 1",
      company: "Air India",
      companyLogo: "✈️",
      date: "Apr 20, 2026",
      time: "10:00 AM",
      daysLeft: 3,
      type: "Virtual",
      interviewer: "Capt. Rajesh Kumar",
      role: "Senior Pilot",
      meetingLink: "https://zoom.us/j/123456789",
      phone: "+91 98765 43210",
      status: "confirmed",
      description: "Assessment of technical knowledge and flight procedures",
      duration: "60 mins",
      difficulty: "Intermediate",
    },
    {
      id: 2,
      title: "HR Round - Final",
      company: "Indigo Airlines",
      companyLogo: "🛫",
      date: "Apr 22, 2026",
      time: "02:30 PM",
      daysLeft: 5,
      type: "In-Person",
      location: "Gurgaon Office, India",
      interviewer: "Ms. Anjali Verma",
      role: "HR Manager",
      phone: "+91 87654 32109",
      status: "confirmed",
      description: "Final round interview with HR and senior management",
      duration: "45 mins",
      difficulty: "Intermediate",
    },
  ];

  const completedInterviews = [
    {
      id: 3,
      title: "Initial Screening",
      company: "Emirates Airlines",
      date: "Apr 15, 2026",
      type: "Virtual",
      status: "completed",
      result: "Passed",
      feedback: "Great communication skills and relevant experience",
    },
  ];

  const stats = [
    { label: "Upcoming", value: "2", color: "from-blue-600 to-cyan-600", icon: Calendar },
    { label: "Completed", value: "1", color: "from-emerald-600 to-teal-600", icon: CheckCircle2 },
    { label: "Success Rate", value: "100%", color: "from-purple-600 to-pink-600", icon: TrendingUp },
  ];

  const handleJoinMeeting = async (interview: any) => {
    if (interview.type === "Virtual" && interview.meetingLink) {
      setJoinLoading(interview.id);
      setTimeout(() => {
        window.open(interview.meetingLink, "_blank");
        toast.success("Opening meeting link...");
        setJoinLoading(null);
      }, 800);
    } else {
      toast("Meeting details will be shared closer to the date");
    }
  };

  const handleReschedule = (interviewId: number) => {
    setRescheduling(interviewId);
    toast.success("Reschedule request sent to HR");
    setTimeout(() => setRescheduling(null), 2000);
  };

  const handleCallInterviewer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleSaveNotes = (interviewId: number) => {
    toast.success("Notes saved successfully!");
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Interview Schedule</h1>
          <p className="text-slate-500 mt-2 text-sm">Manage your upcoming interviews, preparation, and track your progress.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`glass-card p-6 rounded-2xl border border-slate-200 bg-linear-to-br ${stat.color}/10`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-linear-to-br ${stat.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Upcoming Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Zap className="h-6 w-6 text-amber-500" />
          Upcoming Interviews
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {upcomingInterviews.map((interview, idx) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="glass-card p-8 rounded-4xl border border-slate-200 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">{interview.companyLogo}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{interview.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{interview.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">{interview.daysLeft}</div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">days left</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {interview.status}
                </span>
                <span className={cn(
                  "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
                  interview.type === "Virtual"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-700"
                )}>
                  {interview.type}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Date & Time</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{interview.date} at {interview.time}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{interview.duration}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Interviewer</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{interview.interviewer}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Difficulty</p>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{interview.difficulty}</span>
                  </div>
                </div>
                {interview.type === "Virtual" && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Meeting Link</p>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-slate-400" />
                      <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-600 hover:text-purple-700 truncate">
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}
                {interview.type === "In-Person" && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-900">{interview.location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600">{interview.description}</p>

              {/* Interview Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preparation Notes</label>
                <textarea
                  placeholder="Add notes about this interview..."
                  title="Interview notes"
                  value={notes[interview.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [interview.id]: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-300 outline-none transition-all text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {interview.type === "Virtual" ? (
                  <Button
                    onClick={() => handleJoinMeeting(interview)}
                    disabled={joinLoading === interview.id}
                    className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {joinLoading === interview.id ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    View Location
                  </Button>
                )}
                <Button
                  onClick={() => handleReschedule(interview.id)}
                  disabled={rescheduling === interview.id}
                  className="px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm"
                >
                  {rescheduling === interview.id ? "Requesting..." : "Reschedule"}
                </Button>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handleCallInterviewer(interview.phone)}
                  className="px-3 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button
                  onClick={() => toast.success("Opening message app...")}
                  className="px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>

              {/* Save Notes */}
              <Button
                onClick={() => handleSaveNotes(interview.id)}
                className="w-full py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Save Interview Notes
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interview Preparation Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-10 rounded-4xl border border-slate-200"
      >
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-cyan-600" />
          Interview Preparation Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Technical Preparation
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Review core technical concepts relevant to the role</li>
              <li>Practice common aviation industry scenarios</li>
              <li>Study company-specific procedures and standards</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Behavioral Preparation
            </h4>
            <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
              <li>Prepare STAR method responses for common questions</li>
              <li>Research the company and interviewer background</li>
              <li>Prepare thoughtful questions to ask interviewers</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Completed Interviews */}
      {completedInterviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            Completed Interviews
          </h2>

          <div className="space-y-4">
            {completedInterviews.map((interview) => (
              <div key={interview.id} className="glass-card p-6 rounded-2xl border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{interview.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{interview.company} • {interview.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    {interview.result}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-4">Feedback: {interview.feedback}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
