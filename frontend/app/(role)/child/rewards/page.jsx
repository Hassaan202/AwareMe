'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChildNavbar from '../Navbar/Navbar';
import EmergencyButton from '@/app/components/EmergencyButton';
import { learningAPI } from '@/app/utils/api';
import {
  Trophy,
  Star,
  Sparkles,
  Sprout,
  Crown,
  CheckCircle2,
  Zap,
  HelpCircle,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ChildRewardsPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_lessons: 0,
    completed_lessons: 0,
    completion_percentage: 0,
    total_correct_answers: 0,
    total_questions_attempted: 0,
    accuracy_percentage: 0
  });
  const [progressRecords, setProgressRecords] = useState([]);

  useEffect(() => {
    document.title = "Learning Progress | SafeKids";
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await learningAPI.getProgress();
      if (response.success) {
        setStatistics(response.statistics);
        setProgressRecords(response.progress);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementLevel = (percentage) => {
    if (percentage >= 90) return {
      title: 'Master Learner',
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      icon: Crown,
      iconColor: 'text-yellow-600'
    };
    if (percentage >= 70) return {
      title: 'Advanced Learner',
      color: 'bg-gradient-to-r from-purple-400 to-purple-600',
      icon: Star,
      iconColor: 'text-purple-600'
    };
    if (percentage >= 50) return {
      title: 'Growing Learner',
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      icon: Sparkles,
      iconColor: 'text-blue-600'
    };
    if (percentage >= 30) return {
      title: 'Rising Learner',
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      icon: TrendingUp,
      iconColor: 'text-green-600'
    };
    return {
      title: 'Beginning Learner',
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      icon: Sprout,
      iconColor: 'text-gray-600'
    };
  };

  const achievement = getAchievementLevel(statistics.completion_percentage);
  const AchievementIcon = achievement.icon;

  if (loading) {
    return (
      <>
        <ChildNavbar />
        <EmergencyButton />
        <div className="min-h-screen bg-gradient-to-br from-child via-friendly to-primary-200 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading your progress...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ChildNavbar />
      <EmergencyButton />
      <div className="min-h-screen bg-gradient-to-br from-child via-friendly to-primary-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10 text-primary-700" strokeWidth={2.5} />
            <h1 className="text-4xl font-black text-primary-700 drop-shadow-lg">
              Learning Progress
            </h1>
          </div>
          <Link href="/child">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition flex items-center space-x-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </Link>
        </div>

        {/* Achievement Badge */}
        <div className={`${achievement.color} text-white shadow-2xl rounded-3xl p-8 mb-8 text-center transform hover:scale-105 transition-all`}>
          <div className="flex justify-center mb-4">
            <AchievementIcon className="w-20 h-20" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-black mb-2">{achievement.title}</h2>
          <p className="text-lg opacity-90">Keep up the amazing work!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Lessons Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-teal-600" strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black text-teal-600">{statistics.completed_lessons}/{statistics.total_lessons}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700">Lessons Completed</h3>
            <div className="mt-3 bg-gray-200 rounded-full h-3">
              <div
                className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${statistics.completion_percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-right">{statistics.completion_percentage}% Complete</p>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Zap className="w-8 h-8 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black text-purple-600">{statistics.accuracy_percentage}%</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700">Answer Accuracy</h3>
            <p className="text-sm text-gray-600 mt-2">
              {statistics.total_correct_answers} correct out of {statistics.total_questions_attempted} questions
            </p>
          </div>

          {/* Total Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <HelpCircle className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black text-blue-600">{statistics.total_questions_attempted}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700">Questions Answered</h3>
            <p className="text-sm text-gray-600 mt-2">Great job practicing!</p>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-teal-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-full">
              <BookOpen className="w-6 h-6 text-teal-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Learning Journey</h2>
          </div>

          {progressRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" strokeWidth={2} />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No lessons completed yet!</p>
              <p className="text-gray-500 mb-6">Start learning to see your progress here</p>
              <Link href="/child/learn">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition cursor-pointer">
                  Start Learning
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progressRecords.map((record, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${record.passed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'} p-5 rounded-r-xl hover:shadow-md transition`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {record.passed ? (
                          <div className="bg-green-500 text-white p-1.5 rounded-full">
                            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <div className="bg-orange-500 text-white p-1.5 rounded-full">
                            <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-800">
                          {record.lesson_title || `Lesson ${record.lesson_id}`}
                        </h3>
                      </div>
                      <div className="ml-10">
                        <p className="text-sm text-gray-600 mb-2">
                          {record.lesson_description}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-gray-700 font-semibold flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-600" strokeWidth={2.5} />
                            Score: {record.score} / {record.total_questions} ({Math.round((record.score / record.total_questions) * 100)}%)
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" strokeWidth={2} />
                            {new Date(record.completed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {record.passed ? (
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                          Passed
                        </span>
                      ) : (
                        <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          Try Again
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Section */}
        {statistics.completion_percentage < 100 && (
          <div className="mt-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-3xl p-8 text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <Target className="w-16 h-16" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-black mb-3">Keep Going!</h2>
            <p className="text-lg mb-4">
              You're doing amazing! Complete more lessons to become a safety expert.
            </p>
            <Link href="/child/learn">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition cursor-pointer">
                Continue Learning
              </button>
            </Link>
          </div>
        )}

        {statistics.completion_percentage === 100 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-3xl p-8 text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-black mb-3">Congratulations!</h2>
            <p className="text-xl mb-4">
              You've completed all safety lessons! You're a Safety Champion!
            </p>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-white" strokeWidth={2} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
