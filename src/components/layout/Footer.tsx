import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

const socialLinks = [
  { Icon: Linkedin, href: "https://linkedin.com/company/armz-aviation", label: "LinkedIn" },
  { Icon: Twitter, href: "https://twitter.com/armzaviation", label: "Twitter" },
  { Icon: Facebook, href: "https://facebook.com/armzaviation", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/armzaviation", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@armzaviation", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.success("Successfully subscribed to our newsletter!");
    setIsSubscribed(true);
    setIsSubscribing(false);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="bg-transparent pt-12 pb-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10">
          
          {/* Left: Brand & Certifications */}
          <div className="lg:max-w-md space-y-8">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">ARMZ</span>
              <div className="mx-2 w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">AVIATION</span>
            </Link>
            
            <p className="text-slate-600 font-medium leading-relaxed">
              Global aviation talent partner connecting engineers, technicians, pilots, managers & professionals across 50+ countries.
            </p>
            
            {/* Certification Badges */}
            <div className="flex flex-wrap items-center gap-4">
              {["ISO 9001", "MSME", "DPIIT", "ISF"].map((cert) => (
                <span 
                  key={cert}
                  className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Newsletter & Social */}
          <div className="w-full lg:max-w-xl space-y-8">
            {/* Newsletter Box */}
            <div className="glass-card p-8">
              <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-6">Stay Updated</p>
              {isSubscribed ? (
                <div className="flex items-center space-x-3 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="grow h-12 rounded-lg px-6 bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={isSubscribing}
                    className="premium-button-primary h-12 px-8 text-sm disabled:opacity-70"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {isSubscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm bg-white/50"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 w-full mb-10" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Events', path: '/events' },
                { name: 'College Collaboration', path: '/collaboration' },
                { name: 'Blog & Insights', path: '/blog' },
                { name: 'Careers', path: '/jobs' },
                { name: 'Contact Us', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 font-medium text-sm hover:text-purple-600 transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div className="space-y-6">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Employers</h4>
            <ul className="space-y-4">
              {[
                { name: 'Hiring Solutions', path: '/collaboration' },
                { name: 'Post a Job', path: '/login' },
                { name: 'Employer Dashboard', path: '/login' },
                { name: 'Campus Hiring', path: '/events' },
                { name: 'Partner With Us', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 font-medium text-sm hover:text-purple-600 transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidates */}
          <div className="space-y-6">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Candidates</h4>
            <ul className="space-y-4">
              {[
                { name: 'Find Jobs', path: '/jobs' },
                { name: 'Upcoming Events', path: '/events' },
                { name: 'Build Resume', path: '/dashboard/resume' },
                { name: 'My Dashboard', path: '/dashboard' },
                { name: 'Join Community', path: '/register' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 font-medium text-sm hover:text-purple-600 transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-6">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' },
                { name: 'Help Center', path: '/contact' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 font-medium text-sm hover:text-purple-600 transition-colors">{link.name}</Link>
                </li>
              ))}
              <li className="pt-4">
                <Link to="/admin-login" className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-colors opacity-50 hover:opacity-100">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 font-medium text-sm">
            © {new Date().getFullYear()} ARMZ Aviation Pvt Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <Link to="/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-purple-600 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-purple-600 transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

