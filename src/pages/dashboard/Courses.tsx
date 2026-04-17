import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Play, Clock, CheckCircle2, Lock, Star, 
  Trophy, ArrowRight, Filter, Search, BarChart3,
  Users, Calendar, Award, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/src/store/authStore';

const ENROLLED_COURSES = [
  {
    id: 'course-1',
    title: 'Professional Cabin Crew Training',
    category: 'Cabin Crew',
    instructor: 'Capt. Priya Sharma',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    progress: 68,
    totalModules: 12,
    completedModules: 8,
    duration: '3 months',
    nextLesson: 'Emergency Procedures - Part 2',
    lastAccessed: '2 hours ago',
    status: 'in-progress' as const
  },
  {
    id: 'course-2',
    title: 'Aviation Safety & Security',
    category: 'Safety',
    instructor: 'Capt. Rajesh Kumar',
    thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80',
    progress: 100,
    totalModules: 8,
    completedModules: 8,
    duration: '6 weeks',
    nextLesson: null,
    lastAccessed: '1 week ago',
    status: 'completed' as const
  },
  {
    id: 'course-3',
    title: 'Customer Service Excellence',
    category: 'Soft Skills',
    instructor: 'Ms. Anjali Verma',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    progress: 25,
    totalModules: 10,
    completedModules: 2,
    duration: '4 weeks',
    nextLesson: 'Handling Difficult Passengers',
    lastAccessed: '3 days ago',
    status: 'in-progress' as const
  }
];

const RECOMMENDED_COURSES = [
  {
    id: 'rec-1',
    title: 'First Aid & Medical Emergency Response',
    category: 'Safety',
    instructor: 'Dr. Meera Patel',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    duration: '2 weeks',
    modules: 6,
    rating: 4.9,
    students: 3200,
    isPremium: false
  },
  {
    id: 'rec-2',
    title: 'Aviation English Proficiency',
    category: 'Language',
    instructor: 'Prof. Sarah Collins',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    duration: '8 weeks',
    modules: 16,
    rating: 4.8,
    students: 4500,
    isPremium: true
  },
  {
    id: 'rec-3',
    title: 'Aircraft Systems Overview',
    category: 'Technical',
    instructor: 'Eng. Vikram Singh',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    duration: '6 weeks',
    modules: 12,
    rating: 4.7,
    students: 2100,
    isPremium: true
  }
];

const progressWidthClasses: Record<number, string> = {
  0: 'w-[0%]',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-[25%]',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-[40%]',
  45: 'w-[45%]',
  50: 'w-[50%]',
  55: 'w-[55%]',
  60: 'w-[60%]',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-[75%]',
  80: 'w-[80%]',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full'
};

const getProgressWidthClass = (progress: number) => {
  const step = Math.min(100, Math.max(0, Math.round(progress / 5) * 5));
  return progressWidthClasses[step] ?? 'w-[0%]';
};

export default function Courses() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const isPremium = user?.subscription === 'premium' || user?.subscription === 'placement';

  const filteredCourses = ENROLLED_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalProgress = Math.round(
    ENROLLED_COURSES.reduce((acc, course) => acc + course.progress, 0) / ENROLLED_COURSES.length
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">Continue learning and track your progress</p>
        </div>
        <button
          onClick={() => navigate('/programs')}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200/50 flex items-center gap-2 w-fit"
        >
          <BookOpen className="h-5 w-5" />
          Browse All Programs
        </button>
      </div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {[
          { label: 'Enrolled Courses', value: ENROLLED_COURSES.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
          { label: 'Completed', value: ENROLLED_COURSES.filter(c => c.status === 'completed').length, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
          { label: 'Overall Progress', value: `${totalProgress}%`, icon: BarChart3, color: 'from-purple-500 to-pink-500' },
          { label: 'Certificates Earned', value: 1, icon: Award, color: 'from-amber-500 to-orange-500' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${stat.color} text-white mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'in-progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.status === 'completed' && (
                    <div className="absolute inset-0 bg-green-600/80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Trophy className="h-8 w-8 mx-auto mb-1" />
                        <span className="text-sm font-bold">Completed</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">by {course.instructor}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500">
                        {course.completedModules}/{course.totalModules} modules
                      </span>
                      <span className="font-semibold text-slate-900">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          course.progress === 100 
                            ? 'bg-green-500' 
                            : 'bg-linear-to-r from-purple-500 to-indigo-500'
                        } ${getProgressWidthClass(course.progress)}`}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    {course.nextLesson ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Play className="h-4 w-4 text-purple-600" />
                        <span className="line-clamp-1">{course.nextLesson}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Award className="h-4 w-4" />
                        <span>Certificate Available</span>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      {course.status === 'completed' ? 'Review' : 'Continue'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Recommended Courses */}
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
          <button 
            onClick={() => navigate('/programs')}
            className="text-purple-600 font-medium text-sm hover:text-purple-700 flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECOMMENDED_COURSES.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
            >
              <div className="relative h-36">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {course.isPremium && !isPremium && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Premium Only</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>

              <div className="p-5">
                <span className="text-xs font-medium text-slate-500">{course.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">by {course.instructor}</p>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course.students.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (course.isPremium && !isPremium) {
                      navigate('/dashboard/subscription');
                    } else {
                      navigate('/programs');
                    }
                  }}
                  className={`w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    course.isPremium && !isPremium
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {course.isPremium && !isPremium ? 'Upgrade to Access' : 'Enroll Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
