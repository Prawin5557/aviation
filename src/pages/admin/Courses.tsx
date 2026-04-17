import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Edit2, Trash2, Eye, 
  Clock, Users, Star, Filter, MoreHorizontal,
  X, Save, Loader2, GraduationCap, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  price: number;
  students: number;
  rating: number;
  status: 'draft' | 'published' | 'archived';
  modules: number;
  thumbnail: string;
  createdAt: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Professional Cabin Crew Training',
    category: 'Cabin Crew',
    instructor: 'Capt. Priya Sharma',
    duration: '3 months',
    price: 85000,
    students: 5600,
    rating: 4.9,
    status: 'published',
    modules: 12,
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    createdAt: '2024-01-15'
  },
  {
    id: 'c2',
    title: 'Aviation Safety & Security',
    category: 'Safety',
    instructor: 'Capt. Rajesh Kumar',
    duration: '6 weeks',
    price: 45000,
    students: 3200,
    rating: 4.8,
    status: 'published',
    modules: 8,
    thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80',
    createdAt: '2024-02-20'
  },
  {
    id: 'c3',
    title: 'Customer Service Excellence',
    category: 'Soft Skills',
    instructor: 'Ms. Anjali Verma',
    duration: '4 weeks',
    price: 25000,
    students: 4100,
    rating: 4.7,
    status: 'published',
    modules: 10,
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    createdAt: '2024-03-05'
  },
  {
    id: 'c4',
    title: 'Aircraft Systems Overview',
    category: 'Technical',
    instructor: 'Eng. Vikram Singh',
    duration: '8 weeks',
    price: 75000,
    students: 1800,
    rating: 4.6,
    status: 'draft',
    modules: 15,
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    createdAt: '2024-03-10'
  }
];

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    instructor: '',
    duration: '',
    price: '',
    modules: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    totalStudents: courses.reduce((acc, c) => acc + c.students, 0),
    avgRating: (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1)
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      instructor: course.instructor,
      duration: course.duration,
      price: course.price.toString(),
      modules: course.modules.toString(),
      status: course.status
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Course deleted successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, ...formData, price: parseInt(formData.price), modules: parseInt(formData.modules) }
          : c
      ));
      toast.success('Course updated successfully');
    } else {
      const newCourse: Course = {
        id: 'c' + Math.random().toString(36).substr(2, 9),
        ...formData,
        price: parseInt(formData.price),
        modules: parseInt(formData.modules),
        students: 0,
        rating: 0,
        thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCourses([newCourse, ...courses]);
      toast.success('Course created successfully');
    }

    setIsSubmitting(false);
    setShowModal(false);
    setEditingCourse(null);
    setFormData({ title: '', category: '', instructor: '', duration: '', price: '', modules: '', status: 'draft' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Published</span>;
      case 'draft':
        return <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Draft</span>;
      case 'archived':
        return <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-500 rounded-full">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-lg p-8 rounded-4xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingCourse ? 'Edit Course' : 'Create Course'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full" aria-label="Close modal">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-600">Course Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="e.g., Professional Cabin Crew Training"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="course-category" className="text-xs font-medium text-slate-600">Category</label>
                    <select
                      id="course-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      <option value="Cabin Crew">Cabin Crew</option>
                      <option value="Pilot Training">Pilot Training</option>
                      <option value="Safety">Safety</option>
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Ground Operations">Ground Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="e.g., 3 months"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Instructor</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="e.g., Capt. Priya Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Price (INR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="e.g., 85000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Modules</label>
                    <input
                      type="number"
                      value={formData.modules}
                      onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                      required
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="e.g., 12"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="course-status" className="text-xs font-medium text-slate-600">Status</label>
                  <select
                    id="course-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-500 mt-1">Create and manage training courses</p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({ title: '', category: '', instructor: '', duration: '', price: '', modules: '', status: 'draft' });
            setShowModal(true);
          }}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200/50 flex items-center gap-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
          { label: 'Published', value: stats.published, icon: Eye, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'from-purple-500 to-pink-500' },
          { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'from-amber-500 to-orange-500' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className={`inline-flex p-2.5 rounded-xl bg-linear-to-br ${stat.color} text-white mb-3`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                statusFilter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="relative h-40">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(course.status)}
              </div>
            </div>
            
            <div className="p-5">
              <span className="text-xs font-medium text-purple-600">{course.category}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">by {course.instructor}</p>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </span>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <span className="text-lg font-bold text-slate-900">
                  ₹{course.price.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(course)}
                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                    aria-label="Edit course"
                  >
                    <Edit2 className="h-4 w-4 text-purple-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete course"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500">Try adjusting your search or create a new course</p>
        </div>
      )}
    </div>
  );
}

