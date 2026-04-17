import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import SEO from "@/src/components/common/SEO";
import { useLeadCapture } from "@/src/hooks/useLeadCapture";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { captureContactLead } = useLeadCapture();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Capture lead from contact form
    captureContactLead();
    
    console.log("Contact form submitted:", data);
    toast.success("Message sent successfully! We'll get back to you soon.");
    setIsSubmitted(true);
    setIsSubmitting(false);
    reset();
    
    // Reset success state after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-12">
      <SEO title="Contact Us" description="Get in touch with ARMZ Aviation - Your trusted aviation career partner" />
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  Get in <span className="text-purple-600">Touch</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Have questions about our programs or services? Our team is here to help you navigate your aviation journey.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Mail, title: "Email Us", detail: "info@armzaviation.com", sub: "Response within 24 hours", href: "mailto:info@armzaviation.com" },
                  { icon: Phone, title: "Call Us", detail: "+91 98765 43210", sub: "Mon-Fri, 9am - 6pm", href: "tel:+919876543210" },
                  { icon: MapPin, title: "Visit Us", detail: "Aviation Hub, Sector 44, Gurgaon", sub: "Haryana, India - 122003", href: "https://maps.google.com" }
                ].map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.href}
                    target={item.icon === MapPin ? "_blank" : undefined}
                    rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                    className="flex items-start space-x-6 group"
                  >
                    <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{item.title}</h4>
                      <p className="text-purple-600 font-bold">{item.detail}</p>
                      <p className="text-slate-400 text-sm">{item.sub}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map Embed */}
              <div className="glass-card overflow-hidden !rounded-3xl h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.1234567890!2d77.0266!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDEnMzUuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ARMZ Aviation Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-6 lg:p-8 !rounded-[40px]">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                    <p className="text-slate-500">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className={cn(
                          "w-full h-12 bg-white/50 rounded-xl border-none ring-1 focus:ring-2 focus:ring-purple-600 px-6 text-slate-700 transition-all",
                          errors.fullName ? "ring-red-300 focus:ring-red-500" : "ring-slate-200"
                        )}
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 font-medium ml-4 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className={cn(
                          "w-full h-12 bg-white/50 rounded-xl border-none ring-1 focus:ring-2 focus:ring-purple-600 px-6 text-slate-700 transition-all",
                          errors.email ? "ring-red-300 focus:ring-red-500" : "ring-slate-200"
                        )}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 font-medium ml-4 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="w-full h-12 bg-white/50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 px-6 text-slate-700 transition-all"
                      {...register("phone")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="How can we help?" 
                      className={cn(
                        "w-full h-12 bg-white/50 rounded-xl border-none ring-1 focus:ring-2 focus:ring-purple-600 px-6 text-slate-700 transition-all",
                        errors.subject ? "ring-red-300 focus:ring-red-500" : "ring-slate-200"
                      )}
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 font-medium ml-4 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      rows={4} 
                      placeholder="Your message here..." 
                      className={cn(
                        "w-full bg-white/50 rounded-xl border-none ring-1 focus:ring-2 focus:ring-purple-600 p-6 text-slate-700 transition-all resize-none",
                        errors.message ? "ring-red-300 focus:ring-red-500" : "ring-slate-200"
                      )}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 font-medium ml-4 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="premium-button-primary w-full h-14 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    By submitting this form, you agree to our Privacy Policy.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
