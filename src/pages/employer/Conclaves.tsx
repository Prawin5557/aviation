import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, QrCode, CheckCircle2, 
  ArrowRight, Building2, Star, Download, X, Ticket, Share2,
  ExternalLink, User, Mail, Phone, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useLeadCapture } from '@/src/hooks/useLeadCapture';
import { getSubscriptionRouteForRole, hasActiveSubscription } from '@/src/lib/subscription';

interface Conclave {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  type: 'career-fair' | 'networking' | 'workshop' | 'conclave';
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  highlights: string[];
  isRegistered?: boolean;
  registrationId?: string;
}

const MOCK_CONCLAVES: Conclave[] = [
  {
    id: 'con-1',
    title: 'Aviation Career Conclave 2024',
    date: '2024-05-15',
    time: '09:00 AM - 05:00 PM',
    location: 'Mumbai, Maharashtra',
    venue: 'JW Marriott Mumbai Sahar',
    description: 'Connect with top aviation talent at India\'s premier aviation career conclave. Meet 500+ pre-screened candidates from across the country.',
    attendees: 45,
    maxAttendees: 50,
    type: 'conclave',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    highlights: ['500+ Pre-screened Candidates', 'Direct Interview Slots', 'Networking Lunch', 'Panel Discussions'],
    isRegistered: true,
    registrationId: 'REG-2024-ACC-0045'
  },
  {
    id: 'con-2',
    title: 'Ground Staff Recruitment Drive',
    date: '2024-06-20',
    time: '10:00 AM - 04:00 PM',
    location: 'Delhi NCR',
    venue: 'The Leela Ambience, Gurugram',
    description: 'Exclusive recruitment drive for ground handling and airport operations staff. Walk-in interviews available.',
    attendees: 28,
    maxAttendees: 40,
    type: 'career-fair',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80',
    highlights: ['300+ Candidates Expected', 'On-spot Offers', 'Multiple Airlines', 'Technical Assessment'],
    isRegistered: false
  },
  {
    id: 'con-3',
    title: 'Cabin Crew Excellence Workshop',
    date: '2024-07-10',
    time: '09:00 AM - 01:00 PM',
    location: 'Bangalore, Karnataka',
    venue: 'ITC Gardenia',
    description: 'Interactive workshop on cabin crew recruitment best practices and industry trends.',
    attendees: 18,
    maxAttendees: 25,
    type: 'workshop',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    highlights: ['Expert Speakers', 'Case Studies', 'Q&A Session', 'Certificate of Participation'],
    isRegistered: false
  },
  {
    id: 'con-4',
    title: 'Aviation HR Networking Evening',
    date: '2024-04-25',
    time: '06:00 PM - 09:00 PM',
    location: 'Hyderabad, Telangana',
    venue: 'Park Hyatt Hyderabad',
    description: 'Exclusive networking event for aviation HR professionals. Build connections that matter.',
    attendees: 35,
    maxAttendees: 35,
    type: 'networking',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
    highlights: ['Industry Leaders', 'Cocktails & Dinner', 'Partnership Opportunities', 'HR Tech Showcase'],
    isRegistered: true,
    registrationId: 'REG-2024-NET-0012'
  }
];

export default function Conclaves() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { captureConclaveRegistration } = useLeadCapture();
  const [conclaves, setConclaves] = useState<Conclave[]>(MOCK_CONCLAVES);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered' | 'completed'>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedConclave, setSelectedConclave] = useState<Conclave | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const filteredConclaves = conclaves.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'registered') return c.isRegistered;
    if (filter === 'upcoming') return c.status === 'upcoming';
    if (filter === 'completed') return c.status === 'completed';
    return true;
  });

  const handleRegister = async (conclave: Conclave) => {
    if (!hasActiveSubscription(user as any)) {
      toast.error('Event slot booking requires an active employer plan.');
      navigate(getSubscriptionRouteForRole('employer'));
      return;
    }

    captureConclaveRegistration(conclave.title);
    setSelectedConclave(conclave);
    setShowRegisterModal(true);
  };

  const submitRegistration = async () => {
    if (!selectedConclave) return;
    
    setIsRegistering(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const registrationId = `REG-2024-${selectedConclave.type.toUpperCase().slice(0, 3)}-${Math.random().toString().slice(2, 6)}`;
    
    setConclaves(conclaves.map(c => 
      c.id === selectedConclave.id 
        ? { ...c, isRegistered: true, registrationId, attendees: c.attendees + 1 }
        : c
    ));

    setIsRegistering(false);
    setShowRegisterModal(false);
    toast.success('Successfully registered! Check your email for confirmation.');
    
    // Show QR code
    setSelectedConclave({ ...selectedConclave, isRegistered: true, registrationId });
    setShowQRModal(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conclave': return 'bg-purple-100 text-purple-700';
      case 'career-fair': return 'bg-blue-100 text-blue-700';
      case 'workshop': return 'bg-amber-100 text-amber-700';
      case 'networking': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Upcoming</span>;
      case 'ongoing':
        return <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full animate-pulse">Ongoing</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-500 rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && selectedConclave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-md p-8 rounded-4xl text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-green-500 to-emerald-500 rounded-t-4xl" />
              
              <button 
                onClick={() => setShowQRModal(false)}
                title="Close registration confirmation"
                aria-label="Close registration confirmation"
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>

              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Confirmed!</h2>
              <p className="text-slate-500 mb-6">{selectedConclave.title}</p>

              {/* QR Code Placeholder */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 inline-block mb-6">
                <div className="h-48 w-48 bg-slate-100 rounded-xl flex items-center justify-center relative">
                  <QrCode className="h-32 w-32 text-slate-800" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-xs text-slate-500 mb-1">Registration ID</div>
                <div className="font-mono font-bold text-slate-900">{selectedConclave.registrationId}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedConclave.registrationId || '');
                    toast.success('Registration ID copied!');
                  }}
                  title="Copy registration ID"
                  aria-label="Copy registration ID"
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Copy ID
                </button>
                <button
                  onClick={() => toast.success('QR Code downloaded!')}
                  title="Download QR code"
                  aria-label="Download QR code"
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegisterModal && selectedConclave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRegisterModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-lg p-8 rounded-4xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-t-4xl" />
              
              <button 
                onClick={() => setShowRegisterModal(false)}
                title="Close event registration"
                aria-label="Close event registration"
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Register for Event</h2>
              <p className="text-slate-500 mb-6">{selectedConclave.title}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500">Date & Time</div>
                    <div className="font-medium text-slate-900">
                      {new Date(selectedConclave.date).toLocaleDateString('en-IN', { 
                        weekday: 'long',
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })} | {selectedConclave.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500">Venue</div>
                    <div className="font-medium text-slate-900">{selectedConclave.venue}, {selectedConclave.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Users className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500">Availability</div>
                    <div className="font-medium text-slate-900">
                      {selectedConclave.maxAttendees - selectedConclave.attendees} spots remaining
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <div className="mb-3 flex items-center justify-between rounded-lg border border-purple-100 bg-white px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Interview Slot Fee</span>
                  <span className="text-sm font-bold text-purple-700">INR 499</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Registration includes:</h4>
                <ul className="space-y-1.5">
                  {selectedConclave.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={submitRegistration}
                disabled={isRegistering}
                className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Ticket className="h-5 w-5" />
                    Confirm Registration
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Conclaves & Events</h1>
        <p className="text-slate-500 mt-1">Connect with aviation talent at exclusive recruitment events</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'upcoming', 'registered', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConclaves.map((conclave, idx) => (
          <motion.div
            key={conclave.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="relative h-48">
              <img 
                src={conclave.image} 
                alt={conclave.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(conclave.type)}`}>
                  {conclave.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
                {getStatusBadge(conclave.status)}
              </div>
              {conclave.isRegistered && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Registered
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white line-clamp-2">{conclave.title}</h3>
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(conclave.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {conclave.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {conclave.location}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{conclave.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {conclave.highlights.slice(0, 3).map((h, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {h}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {conclave.attendees}/{conclave.maxAttendees} employers
                  </span>
                  {conclave.attendees >= conclave.maxAttendees && (
                    <span className="text-xs text-red-600 font-medium">Full</span>
                  )}
                </div>
                
                {conclave.isRegistered ? (
                  <button
                    onClick={() => {
                      setSelectedConclave(conclave);
                      setShowQRModal(true);
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    View Pass
                  </button>
                ) : conclave.status === 'completed' ? (
                  <span className="text-sm text-slate-400">Event ended</span>
                ) : conclave.attendees >= conclave.maxAttendees ? (
                  <span className="text-sm text-red-600 font-medium">Sold Out</span>
                ) : (
                  <button
                    onClick={() => handleRegister(conclave)}
                    className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    Register <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredConclaves.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No events found</h3>
          <p className="text-slate-500">Check back later for upcoming conclaves and events</p>
        </div>
      )}
    </div>
  );
}

