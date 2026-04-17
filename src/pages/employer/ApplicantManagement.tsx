import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Mail, 
  MoreVertical,
  ChevronRight,
  FileText,
  Briefcase,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  Phone,
  ExternalLink,
  ArrowUpRight,
  Calendar,
  Loader2
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "@/src/components/ui/Skeleton";

import { useApplications, useApplicationManagement } from "@/src/hooks/useQueries";

export default function ApplicantManagement() {
  const [filter, setFilter] = useState("All");
  const { data: applicants = [], isLoading } = useApplications();
  const { updateStatus } = useApplicationManagement();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = async (id: string, name: string, action: string) => {
    try {
      await updateStatus({ id, status: action });
    } catch (error) {
      // Handled by mutation
    }
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesFilter = filter === "All" || a.status === filter;
    const matchesSearch = (a.name || a.job_details?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Applicant Management</h1>
          <p className="text-slate-500 mt-1">Review and manage candidates for your active job postings.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            className="pl-12 h-14 rounded-2xl" 
            placeholder="Search by name, role or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {["All", "Pending", "Shortlisted", "Interviewed", "Hired", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-100" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-purple-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      <div className="glass-card overflow-hidden rounded-4xl border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role & Exp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">AI Match</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-10 w-32 rounded-xl" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-16 mx-auto rounded-xl" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-24 rounded-xl" /></td>
                    <td className="px-8 py-6"></td>
                  </tr>
                ))
              ) : filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {applicant.name?.[0] || applicant.job_details?.title?.[0] || "A"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{applicant.name || "Anonymous Candidate"}</h4>
                        <p className="text-xs text-slate-500">Applied {new Date(applicant.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">{applicant.job_details?.title || "Aviation Role"}</h4>
                      <p className="text-xs text-slate-500">{applicant.experience || "5+"} Years Exp</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "text-sm font-bold",
                        (applicant.score || 85) >= 80 ? "text-green-600" : (applicant.score || 85) >= 60 ? "text-orange-600" : "text-red-600"
                      )}>
                        {applicant.score || 85}%
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            (applicant.score || 85) >= 80 ? "bg-green-500" : (applicant.score || 85) >= 60 ? "bg-orange-500" : "bg-red-500"
                          )}
                          style={{ width: `${applicant.score || 85}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                      applicant.status === "Hired" ? "bg-emerald-100 text-emerald-700" :
                      applicant.status === "Shortlisted" ? "bg-green-100 text-green-700" :
                      applicant.status === "Rejected" ? "bg-red-100 text-red-700" :
                      applicant.status === "Interviewed" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {applicant.status !== "Hired" && (
                        <button 
                          onClick={() => handleAction(applicant.id, applicant.name || "Candidate", "Hired")}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title="Hire Candidate"
                        >
                          <TrendingUp className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleAction(applicant.id, applicant.name || "Candidate", "Shortlisted")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                        title="Shortlist"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(applicant.id, applicant.name || "Candidate", "Rejected")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="View Resume">
                        <FileText className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

