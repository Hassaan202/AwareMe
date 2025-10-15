"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
import { profileAPI, learningAPI } from "@/app/utils/api";
import { BarChart3, UserCircle, BookOpen, Plus, Check, X, ChevronDown, Baby, Hand } from "lucide-react";

export default function ParentChildProgress() {
  const [children, setChildren] = useState([]);
  const [childrenProgress, setChildrenProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedChild, setExpandedChild] = useState(null);

  // Fetch children on component mount
  useEffect(() => {
    fetchChildrenWithProgress();
  }, []);

  const fetchChildrenWithProgress = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getChildren();
      if (response.success) {
        setChildren(response.children);

        // Fetch progress for each child
        const progressData = {};
        for (const child of response.children) {
          try {
            const progressResponse = await learningAPI.getChildProgress(child.id);
            if (progressResponse.success) {
              progressData[child.id] = progressResponse;
            }
          } catch (err) {
            console.error(`Error fetching progress for child ${child.id}:`, err);
            progressData[child.id] = { success: false, progress: [], statistics: null };
          }
        }
        setChildrenProgress(progressData);
      }
    } catch (err) {
      console.error('Error fetching children:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (childId) => {
    setExpandedChild(expandedChild === childId ? null : childId);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-400";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (<>
    <ParentNavbar />
    <div className="min-h-screen bg-off-white text-black p-6">
      <div className="flex items-center justify-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-blue" strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-center">
          Child Progress Overview
        </h1>
      </div>

      {/* Parent Info */}
      <div className="bg-peach border-2 border-blue rounded-2xl p-5 mb-10 shadow">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          Welcome Back, Parent!
          <Hand className="w-6 h-6 text-blue inline-block animate-wave" strokeWidth={2} />
        </h2>
        <p className="text-gray-700 text-sm">
          Monitor your children's learning progress in safety education. Click on any child card to see detailed progress.
        </p>
      </div>

      {/* Children Cards */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
          <p className="mt-4 text-lg">Loading children and progress data...</p>
        </div>
      ) : children.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-4">No children linked yet.</p>
          <p className="text-gray-600">Click "Add New Child" below to link a child account</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const progress = childrenProgress[child.id];
            const stats = progress?.statistics;
            const isExpanded = expandedChild === child.id;

            return (
              <div
                key={child.id}
                className="bg-peach border-2 border-blue rounded-2xl p-6 shadow hover:shadow-black/30 transition"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    <div className="bg-blue/10 p-4 rounded-full">
                      <UserCircle className="w-12 h-12 text-blue" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{child.name}</h3>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Age:</span> {child.age}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span> {child.email}
                  </p>
                </div>

                {/* Progress Statistics */}
                {stats ? (
                  <div className="space-y-3 mb-4">
                    {/* Completion Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">Lessons Completed</span>
                        <span className="font-semibold">{stats.completed_lessons}/{stats.total_lessons}</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${getProgressBarColor(stats.completion_percentage)}`}
                          style={{ width: `${stats.completion_percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">
                        {stats.completion_percentage}% Complete
                      </p>
                    </div>

                    {/* Accuracy */}
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Quiz Accuracy:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getProgressColor(stats.accuracy_percentage)}`}>
                          {stats.accuracy_percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {stats.total_correct_answers} correct out of {stats.total_questions_attempted} questions
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-600">
                    No progress data yet. Child hasn't started any lessons.
                  </div>
                )}

                {/* Status Badge */}
                <div className="text-center mb-3">
                  <span className="px-3 py-1 bg-teal/30 border border-teal/50 rounded-full text-xs flex items-center justify-center space-x-1">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    <span>Active Account</span>
                  </span>
                </div>

                {/* View Details Button */}
                {progress?.progress && progress.progress.length > 0 && (
                  <button
                    onClick={() => toggleExpanded(child.id)}
                    className="w-full bg-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue/80 transition flex items-center justify-center space-x-2"
                  >
                    <span>{isExpanded ? 'Hide' : 'View'} Detailed Progress</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      strokeWidth={2.5}
                    />
                  </button>
                )}

                {/* Expanded Details */}
                {isExpanded && progress?.progress && (
                  <div className="mt-4 space-y-3 border-t-2 border-blue pt-4">
                    <h4 className="font-semibold text-center mb-2 flex items-center justify-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue" strokeWidth={2} />
                      Lesson Details
                    </h4>
                    {progress.progress.map((lesson, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-lg p-3 border-l-4 ${lesson.passed ? 'border-green-500' : 'border-red-500'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-sm flex-1">{lesson.lesson_title}</h5>
                          {lesson.passed ? (
                            <span className="text-green-600 text-xs flex items-center gap-1">
                              <Check className="w-4 h-4" strokeWidth={2.5} />
                              Passed
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs flex items-center gap-1">
                              <X className="w-4 h-4" strokeWidth={2.5} />
                              Failed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{lesson.lesson_description}</p>
                        <div className="flex justify-between text-xs">
                          <span>Score: <strong>{lesson.score}/{lesson.total_questions}</strong></span>
                          <span className="text-gray-500">
                            {new Date(lesson.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Child Section */}
      <div className="mt-10 bg-peach border-2 border-blue rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Baby className="w-7 h-7 text-blue" strokeWidth={2} />
          <h2 className="text-2xl font-semibold">Add New Child</h2>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Link another child account to monitor their safety learning and chatbot interactions.
        </p>
        <Link href='/parent/dashborad'>
          <button
            className="bg-teal text-black px-6 py-2 rounded-full font-semibold hover:bg-[#28c0a0] transition cursor-pointer flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Add Child</span>
          </button>
        </Link>
      </div>
    </div>
  </>
  );
}