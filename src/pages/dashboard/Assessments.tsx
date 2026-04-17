import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle2, XCircle, Play, Trophy, 
  Target, Award, ChevronRight, BarChart3, Star, Lock,
  AlertCircle, ArrowRight, RefreshCw, BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';
import { useNavigate } from 'react-router-dom';

const ASSESSMENTS = [
  {
    id: 'assess-1',
    title: 'Cabin Crew Safety Fundamentals',
    category: 'Safety',
    questions: 25,
    duration: 30,
    passingScore: 70,
    status: 'completed' as const,
    score: 88,
    completedAt: '2024-03-15',
    attempts: 1,
    maxAttempts: 3
  },
  {
    id: 'assess-2',
    title: 'Emergency Evacuation Procedures',
    category: 'Safety',
    questions: 20,
    duration: 25,
    passingScore: 80,
    status: 'available' as const,
    score: null,
    completedAt: null,
    attempts: 0,
    maxAttempts: 3
  },
  {
    id: 'assess-3',
    title: 'Customer Service Excellence Quiz',
    category: 'Soft Skills',
    questions: 15,
    duration: 20,
    passingScore: 60,
    status: 'in-progress' as const,
    score: null,
    completedAt: null,
    attempts: 1,
    maxAttempts: 3,
    savedProgress: 60
  },
  {
    id: 'assess-4',
    title: 'Aviation Terminology Test',
    category: 'Knowledge',
    questions: 30,
    duration: 35,
    passingScore: 75,
    status: 'failed' as const,
    score: 62,
    completedAt: '2024-03-10',
    attempts: 2,
    maxAttempts: 3
  },
  {
    id: 'assess-5',
    title: 'Aircraft Systems Knowledge',
    category: 'Technical',
    questions: 40,
    duration: 45,
    passingScore: 70,
    status: 'locked' as const,
    score: null,
    completedAt: null,
    attempts: 0,
    maxAttempts: 2,
    prerequisite: 'Complete Aviation Safety course'
  }
];

const MOCK_QUIZ = [
  {
    id: 1,
    question: 'What is the primary purpose of a pre-flight safety demonstration?',
    options: [
      'To entertain passengers',
      'To ensure passengers know safety procedures in case of emergency',
      'To delay the flight',
      'To test the PA system'
    ],
    correct: 1
  },
  {
    id: 2,
    question: 'In case of cabin depressurization, what should passengers do first?',
    options: [
      'Call the flight attendant',
      'Put on their own oxygen mask before helping others',
      'Move to the back of the aircraft',
      'Open the emergency exit'
    ],
    correct: 1
  },
  {
    id: 3,
    question: 'What color are emergency exits typically marked with?',
    options: [
      'Blue',
      'Green',
      'Red',
      'Yellow'
    ],
    correct: 2
  }
];

export default function Assessments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const isPremium = user?.subscription === 'premium' || user?.subscription === 'placement';

  const filteredAssessments = ASSESSMENTS.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'available') return a.status === 'available' || a.status === 'in-progress';
    if (filter === 'completed') return a.status === 'completed' || a.status === 'failed';
    return true;
  });

  const completedCount = ASSESSMENTS.filter(a => a.status === 'completed').length;
  const averageScore = Math.round(
    ASSESSMENTS.filter(a => a.score !== null).reduce((acc, a) => acc + (a.score || 0), 0) / 
    ASSESSMENTS.filter(a => a.score !== null).length || 0
  );

  const getStatusBadge = (status: string, score?: number | null, passingScore?: number) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Passed ({score}%)
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-xs font-medium">
            <XCircle className="h-3.5 w-3.5" />
            Failed ({score}%)
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            In Progress
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium">
            <Lock className="h-3.5 w-3.5" />
            Locked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full text-xs font-medium">
            <Play className="h-3.5 w-3.5" />
            Ready
          </span>
        );
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < MOCK_QUIZ.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    MOCK_QUIZ.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return Math.round((correct / MOCK_QUIZ.length) * 100);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl p-8 rounded-4xl"
            >
              {showResults ? (
                <div className="text-center py-8">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    calculateScore() >= 70 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {calculateScore() >= 70 ? (
                      <Trophy className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {calculateScore() >= 70 ? 'Congratulations!' : 'Keep Practicing!'}
                  </h2>
                  <p className="text-slate-500 mb-6">You scored {calculateScore()}% on this assessment</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleStartQuiz}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm text-slate-500">
                      Question {currentQuestion + 1} of {MOCK_QUIZ.length}
                    </span>
                    <div className="flex gap-1.5">
                      {MOCK_QUIZ.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 w-8 rounded-full transition-colors ${
                            idx === currentQuestion
                              ? 'bg-purple-600'
                              : idx < currentQuestion
                              ? 'bg-green-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    {MOCK_QUIZ[currentQuestion].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {MOCK_QUIZ[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedAnswers[currentQuestion] === idx
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-slate-300'
                          }`}>
                            {selectedAnswers[currentQuestion] === idx && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-slate-700 font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="px-6 py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors"
                    >
                      Exit Quiz
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {currentQuestion === MOCK_QUIZ.length - 1 ? 'Submit' : 'Next'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Assessments</h1>
        <p className="text-slate-500 mt-1">Test your knowledge and earn certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Assessments', value: ASSESSMENTS.length, icon: FileText, color: 'from-blue-500 to-cyan-500' },
          { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
          { label: 'Average Score', value: `${averageScore}%`, icon: BarChart3, color: 'from-purple-500 to-pink-500' },
          { label: 'Certificates', value: completedCount, icon: Award, color: 'from-amber-500 to-orange-500' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${stat.color} text-white mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'available', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssessments.map((assessment, idx) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`glass-card rounded-2xl p-6 ${
              assessment.status === 'locked' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500">{assessment.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{assessment.title}</h3>
              </div>
              {getStatusBadge(assessment.status, assessment.score, assessment.passingScore)}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {assessment.questions} questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {assessment.duration} mins
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                Pass: {assessment.passingScore}%
              </span>
            </div>

            {assessment.status === 'locked' && assessment.prerequisite && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 mb-4">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                {assessment.prerequisite}
              </div>
            )}

            {assessment.status === 'in-progress' && assessment.savedProgress && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Progress saved</span>
                  <span className="font-semibold text-slate-900">{assessment.savedProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${assessment.savedProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Attempts: {assessment.attempts}/{assessment.maxAttempts}
              </span>
              <button
                onClick={handleStartQuiz}
                disabled={assessment.status === 'locked' || assessment.attempts >= assessment.maxAttempts}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 ${
                  assessment.status === 'locked' || assessment.attempts >= assessment.maxAttempts
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : assessment.status === 'completed'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : assessment.status === 'failed'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {assessment.status === 'completed' ? (
                  <>Review <ArrowRight className="h-4 w-4" /></>
                ) : assessment.status === 'in-progress' ? (
                  <>Continue <ArrowRight className="h-4 w-4" /></>
                ) : assessment.status === 'failed' ? (
                  <>Retry <RefreshCw className="h-4 w-4" /></>
                ) : assessment.status === 'locked' ? (
                  <>Locked <Lock className="h-4 w-4" /></>
                ) : (
                  <>Start <Play className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No assessments found</h3>
          <p className="text-slate-500">Complete more courses to unlock assessments</p>
        </div>
      )}
    </div>
  );
}
