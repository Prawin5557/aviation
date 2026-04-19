import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Lightbulb, RefreshCw, Lock } from "lucide-react";
import { useResumeStore } from "@/src/store/resumeStore";
import { GoogleGenAI } from "@google/genai";
import { useAuthStore } from "@/src/store/authStore";
import { usePlanStore } from "@/src/store/planStore";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { GlassCard } from "@/src/components/common/GlassCard";
import { cn } from "@/src/lib/utils";
import { ENV } from "@/src/config/env";

const ai = new GoogleGenAI({ apiKey: ENV.PUBLIC_GEMINI_API_KEY || "" });
const blurClass = "backdrop-blur-xs";
const maxWidthClass = "max-w-50";
const gradientClass = "bg-linear-to-br";
const minHeightClass = "min-h-25";

export default function AICareerCoach() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: resumeData } = useResumeStore();
  const { user } = useAuthStore();
  const { hasPermission, plans, fetchPlans } = usePlanStore();

  const isPremium = hasPermission(user?.subscription, "ai_coach");

  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, []);

  const fetchAdvice = async () => {
    if (!isPremium) return;
    setIsLoading(true);
    try {
      const prompt = `As an expert aviation career coach, provide one powerful, actionable piece of career advice for a candidate with the following profile:
      
      Summary: ${resumeData.personalInfo.summary}
      Skills: ${resumeData.skills.join(", ")}
      
      Keep it to 2-3 sentences. Focus on the aviation industry. Return only the advice text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a world-class aviation career consultant with 20 years of experience in pilot recruitment and airline operations.",
        }
      });
      
      const text = response.text;
      setAdvice(text || "Focus on obtaining specialized certifications like Flight Safety or Ground Handling to stand out in the competitive aviation market.");
    } catch (error) {
      console.error("Coach Error:", error);
      setAdvice("Focus on obtaining specialized certifications like Flight Safety or Ground Handling to stand out in the competitive aviation market.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium && !advice) {
      fetchAdvice();
    }
  }, [isPremium]);

  if (!isPremium) {
    return (
      <GlassCard 
        className="relative overflow-hidden group border-slate-100 bg-slate-50/50"
        hoverEffect={false}
      >
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 p-6 text-center ${blurClass}`}>
          <div className="h-14 w-14 bg-white rounded-2xl shadow-premium flex items-center justify-center mb-4 text-slate-400 group-hover:text-purple-600 transition-all duration-500 group-hover:scale-110">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-slate-900 mb-2">AI Career Coach</h3>
          <p className={`mb-6 ${maxWidthClass} text-sm text-slate-500`}>Unlock personalized AI career coaching with a Professional plan.</p>
          <Link to="/dashboard/subscription">
            <Button variant="primary" size="sm" className="rounded-full px-8">
              Upgrade Now
            </Button>
          </Link>
        </div>
        
        <div className="opacity-20 blur-[2px] pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-slate-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-display font-bold">AI Career Coach</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-2 bg-slate-100 rounded-xl text-slate-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "Upgrade to see personalized career advice based on your profile and skills."
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      className={`border-purple-100 ${gradientClass} from-white/90 to-purple-50/40`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900">AI Career Coach</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-purple-100 text-purple-400 hover:text-purple-600 transition-all duration-300 disabled:opacity-50"
          title="Refresh Advice"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className={`relative flex ${minHeightClass} items-center`}>
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-4 space-y-3">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest animate-pulse">Analyzing Profile...</p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl border border-white/50">
              <div className="mt-1 p-2 bg-purple-100 rounded-xl text-purple-600">
                <Lightbulb className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                "{advice}"
              </p>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
