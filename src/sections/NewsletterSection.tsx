import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLeadCapture } from "@/src/hooks/useLeadCapture";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { captureLead } = useLeadCapture();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Capture as lead
    await captureLead(
      'newsletter',
      'Newsletter Subscription',
      'Subscription Confirmed',
      'You will receive weekly updates on aviation opportunities'
    );
    
    toast.success("You've been subscribed to our newsletter!");
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="bg-white rounded-[40px] md:rounded-[48px] p-6 sm:p-10 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-8 sm:space-y-12 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />

          {/* Badge */}
          <div className="flex justify-center relative z-10">
            <div 
              className="inline-flex items-center space-x-3 px-8 py-3 rounded-2xl border border-purple-100 text-purple-600 font-bold text-[10px] uppercase tracking-[0.3em] bg-purple-50/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
            >
              <Mail className="h-4 w-4" />
              <span>Stay Updated</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
              Join a Thriving Community of <br className="hidden md:block" />
              <span className="text-purple-600">400,000 Aviation Experts</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Get hiring trends, job alerts, regulatory updates, salary intelligence, and global talent insights straight to your inbox.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto relative z-10">
            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-3 text-green-600 py-6">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg font-bold">Thanks for subscribing! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="grow relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your professional email" 
                    className="w-full h-14 sm:h-16 rounded-2xl px-5 sm:px-8 bg-slate-50 border border-slate-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-base sm:text-lg font-medium transition-all"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-600 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none" />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 shrink-0 group" disabled={isSubmitting}>
                  <span className="flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </form>
            )}
          </div>

          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] relative z-10">
            No spam. Only high-value aviation intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}
