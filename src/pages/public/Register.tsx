import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Plane, Loader2, AlertCircle, ShieldCheck, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import { paymentService } from "../../services/paymentService";
import { ENV } from "../../config/env";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import SEO from "../../components/common/SEO";
import OTPVerification from "../../components/auth/OTPVerification";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "employer"]),
  companyName: z.string().optional(),
  hrName: z.string().optional(),
  phone: z.string().optional(),
  companyDetails: z.string().optional(),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
}).refine((data) => {
  if (data.role === "employer") {
    return !!data.companyName && !!data.hrName && !!data.phone;
  }
  return true;
}, {
  message: "Company details are required for employers",
  path: ["companyName"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { login, isLoading, setLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<RegisterFormValues | null>(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
      agree: false,
    },
  });

  const selectedRole = watch("role");

  const onAccountSubmit = async (data: RegisterFormValues) => {
    setAccountData(data);
    setShowOTPVerification(true);
  };

  const handleOTPVerified = async () => {
    setShowOTPVerification(false);
    setStep(2);
  };


  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setStep(3);
  };

  const handlePayment = async () => {
    if (!accountData || !selectedPlan) return;

    const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan);
    const amount = selectedPlanDetails?.amount ?? 999;

    // Safety timeout - reset loading after 5 minutes
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      toast.error('Payment process took too long. Please try again.');
    }, 5 * 60 * 1000);

    const useMockData = ENV.USE_MOCK || ENV.DEMO_MODE;

    if (selectedPlan === "prime") {
      setLoading(true);
      try {
        const response = await authService.register({
          name: accountData.fullName,
          email: accountData.email,
          password: accountData.password,
          role: accountData.role,
          phone: accountData.phone,
          companyName: accountData.companyName,
          hrName: accountData.hrName,
          companyDetails: accountData.companyDetails,
        }, useMockData);

        clearTimeout(loadingTimeout);
        login(response.user);
        if (accountData.role === "employer") {
          navigate("/employer");
        } else {
          setStep(4);
        }
      } catch (err: any) {
        clearTimeout(loadingTimeout);
        toast.error(err.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await paymentService.loadRazorpay();
      const order = await paymentService.createOrder(selectedPlan, amount, 'INR', useMockData);
      setLoading(false);

      await paymentService.initiatePayment(
        order,
        {
          name: accountData.fullName,
          email: accountData.email,
          phone: accountData.phone || '',
        },
        async (response) => {
          setLoading(true);
          clearTimeout(loadingTimeout);
          try {
            const result = await paymentService.processPaymentCompletion(
              selectedPlan,
              response,
              'demo_user',
              useMockData
            );

            if (result.success) {
              const regResponse = await authService.register({
                name: accountData.fullName,
                email: accountData.email,
                password: accountData.password,
                role: accountData.role,
                phone: accountData.phone,
                companyName: accountData.companyName,
                hrName: accountData.hrName,
                companyDetails: accountData.companyDetails,
              }, useMockData);

              setLoading(false);
              login(regResponse.user);
              toast.success('Payment successful! Account created.');

              if (accountData.role === "employer") {
                navigate("/employer");
              } else {
                setStep(4);
              }
            } else {
              setLoading(false);
              toast.error("Payment verification failed. Please try again.");
            }
          } catch (error: any) {
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred after payment. Please try again.");
          }
        },
        (error) => {
          clearTimeout(loadingTimeout);
          setLoading(false);
          if (error?.reason === 'user_cancelled') {
            toast.error("Payment cancelled.");
          } else {
            toast.error(error?.description || error?.message || error?.reason || "Payment failed. Please try again.");
          }
        }
      );
    } catch (err: any) {
      clearTimeout(loadingTimeout);
      setLoading(false);
      toast.error(err.message || "Failed to initialize payment. Please try again.");
    }
  };

  if (showOTPVerification && accountData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <SEO title="Verify Email" description="Verify your email address" />
        <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border-white/50">
          <OTPVerification
            email={accountData.email}
            type="email"
            onSuccess={handleOTPVerified}
            onCancel={() => setShowOTPVerification(false)}
            title="Verify Your Email"
            description={`We've sent a 6-digit code to ${accountData.email}`}
          />
        </div>
      </div>
    );
  }

  const studentPlans = [
    { id: "prime", name: "Prime", price: "₹199/mo", amount: 199, features: ["Basic Job Search", "Public Profile", "Email Alerts"], color: "bg-slate-50 text-slate-600" },
    { id: "premium", name: "Premium", price: "₹499/mo", amount: 499, features: ["Priority Applications", "Resume Builder", "AI Career Coach", "Interview Prep"], color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "elite", name: "Elite", price: "₹99,999", amount: 99999, features: ["Direct Recruiter Access", "LinkedIn Support", "Webinar Access", "Personal Mentor"], color: "bg-indigo-50 text-indigo-600 border-indigo-100" }
  ];

  const employerPlans = [
    { id: "recruiter_starter", name: "Recruiter Starter", price: "₹19,999/mo", amount: 19999, features: ["5 Active Job Posts", "Basic Applicant Tracking", "Recruiter Dashboard", "Candidate Shortlisting", "Email Support"], color: "bg-sky-50 text-sky-600 border-sky-100" },
    { id: "recruiter_growth", name: "Recruiter Growth", price: "₹49,999/mo", amount: 49999, features: ["20 Active Job Posts", "Featured Employer Listing", "Advanced Match Scores", "Priority Support", "Talent Analytics"], color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
    { id: "recruiter_enterprise", name: "Recruiter Enterprise", price: "₹99,999/mo", amount: 99999, features: ["Unlimited Job Posts", "Enterprise ATS Integration", "Dedicated Hiring Partner", "Custom Recruitment Campaigns", "Executive Talent Search"], color: "bg-amber-50 text-amber-600 border-amber-100" }
  ];

  const plans = selectedRole === "employer" ? employerPlans : studentPlans;
  const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan) || null;

  return (
    <div className="min-h-screen pt-20 bg-transparent flex items-center justify-center px-4 pb-12">
      <SEO title="Register" description="Join the ARMZ Aviation community" />
      <div 
        className="max-w-2xl w-full glass-card p-10 rounded-[40px] shadow-2xl border-white/50"
      >
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                step >= s ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "bg-slate-100 text-slate-400"
              )}>
                {step > s ? <ShieldCheck className="h-5 w-5" /> : s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "h-1 w-12 sm:w-20 mx-2 rounded-full transition-all duration-500",
                  step > s ? "bg-purple-600" : "bg-slate-100"
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                <p className="text-slate-500">Enter your details to get started</p>
              </div>

              <form onSubmit={handleSubmit(onAccountSubmit)} className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">I am a...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setValue("role", "student")}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2",
                        selectedRole === "student" ? "border-purple-600 bg-purple-50" : "border-slate-100 bg-white"
                      )}
                    >
                      <User className={cn("h-6 w-6", selectedRole === "student" ? "text-purple-600" : "text-slate-400")} />
                      <span className="text-xs font-bold uppercase tracking-widest">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "employer")}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2",
                        selectedRole === "employer" ? "border-purple-600 bg-purple-50" : "border-slate-100 bg-white"
                      )}
                    >
                      <Building2 className={cn("h-6 w-6", selectedRole === "employer" ? "text-purple-600" : "text-slate-400")} />
                      <span className="text-xs font-bold uppercase tracking-widest">Employer</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input 
                      type="text" 
                      placeholder="John Doe" 
                      className={cn("pl-14 h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500", errors.fullName && "border-red-300 ring-1 ring-red-500")}
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 font-bold ml-4">{errors.fullName.message}</p>}
                </div>

                {selectedRole === "employer" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Company Name</label>
                      <Input 
                        type="text" 
                        placeholder="e.g. Emirates" 
                        className="h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500"
                        {...register("companyName")}
                      />
                      {errors.companyName && <p className="text-xs text-red-500 font-bold ml-4">{errors.companyName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">HR Name</label>
                      <Input 
                        type="text" 
                        placeholder="e.g. Sarah Smith" 
                        className="h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500"
                        {...register("hrName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                      <Input 
                        type="text" 
                        placeholder="e.g. +91 98765 43210" 
                        className="h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500"
                        {...register("phone")}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className={cn("pl-14 h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500", errors.email && "border-red-300 ring-1 ring-red-500")}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-bold ml-4">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className={cn("pl-14 h-14 rounded-2xl bg-white/50 border-slate-200/60 focus:ring-purple-500", errors.password && "border-red-300 ring-1 ring-red-500")}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-bold ml-4">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4">
                    <input type="checkbox" id="agree" className="h-5 w-5 rounded-md border-slate-300 text-purple-600" {...register("agree")} />
                    <label htmlFor="agree" className="text-sm text-slate-500 font-medium">I agree to the Terms & Conditions</label>
                  </div>
                  {errors.agree && <p className="text-xs text-red-500 font-bold ml-4">{errors.agree.message}</p>}
                </div>

                <Button type="submit" className="h-16 text-lg group">
                  Continue to Plans <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Select a {selectedRole === "employer" ? "Recruiter" : "Career"} Plan</h1>
                <p className="text-slate-500">
                  {selectedRole === "employer" ? "Choose the right hiring package for your company." : "Choose the best path for your aviation career."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col h-full hover:-translate-y-1",
                      selectedPlan === plan.id ? "border-purple-600 bg-purple-50/50" : "border-slate-100 bg-white hover:border-purple-200"
                    )}
                  >
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{plan.name}</span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">{plan.price}</h3>
                    </div>
                    <ul className="space-y-3 grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600 font-medium">
                          <ShieldCheck className="h-4 w-4 text-purple-600 mr-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant={selectedPlan === plan.id ? "primary" : "outline"} className="mt-8 w-full">
                      Select {plan.name}
                    </Button>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-400 hover:text-purple-600 transition-colors w-full text-center uppercase tracking-widest">
                Back to Account Details
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Secure Payment</h1>
                <p className="text-slate-500">Complete your subscription to {selectedPlan} plan</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">{selectedPlanDetails?.name || selectedPlan} Plan</h4>
                    <p className="text-xs text-slate-500 mt-1">Billed monthly</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {selectedPlanDetails?.price || plans.find(p => p.id === selectedPlan)?.price}
                  </span>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Razorpay Secure Payment</p>
                      <p className="text-xs text-slate-500">Auto-pay enabled for seamless renewal</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePayment} className="w-full h-16 text-lg group" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>Proceed to Payment <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                  Secure 256-bit SSL Encrypted Payment via Razorpay
                </p>
              </div>

              <button onClick={() => setStep(2)} className="text-sm font-bold text-slate-400 hover:text-purple-600 transition-colors w-full text-center uppercase tracking-widest">
                Change Plan
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="text-center space-y-8 py-10"
            >
              <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900">Welcome Aboard!</h1>
                <p className="text-slate-600 text-lg">Your account has been created and subscription is active.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-3xl inline-block">
                <p className="text-purple-700 font-bold uppercase tracking-widest text-xs">Plan Activated: {plans.find((plan) => plan.id === selectedPlan)?.name || selectedPlan}</p>
              </div>
              <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full h-16 text-lg">
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <div className="mt-10 text-center">
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
