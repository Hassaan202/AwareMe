"use client"
import React, { useState } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
export default function ParentChildProgress() {
  const [children] = useState([
    {
      id: 1,
      name: "Ali Khan",
      age: 10,
      progress: 85,
      chatSafety: 92,
      lessonsCompleted: 8,
      totalLessons: 10,
      emotionalStatus: "Happy 😊",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      age: 12,
      progress: 65,
      chatSafety: 80,
      lessonsCompleted: 6,
      totalLessons: 10,
      emotionalStatus: "Neutral 😐",
    },
    {
      id: 3,
      name: "Hassan Malik",
      age: 9,
      progress: 45,
      chatSafety: 70,
      lessonsCompleted: 4,
      totalLessons: 10,
      emotionalStatus: "Sad 😔",
    },
  ]);

  return (<>
    <ParentNavbar />
    <div className="min-h-screen bg-off-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        👨‍👩‍👧 Child Progress Overview
      </h1>

      {/* Parent Info */}
      <div className="bg-peach border-2 border-blue rounded-2xl p-5 mb-10 shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back, Parent!</h2>
        <p className="text-gray-700 text-sm">
          Here you can view each child’s learning journey, chatbot safety
          behavior, and emotional insights.
        </p>
      </div>

      {/* Children Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-peach border-2 border-blue rounded-2xl p-6 shadow hover:shadow-black/30 transition"
          >
            <h3 className="text-xl font-semibold mb-1">{child.name}</h3>
            <p className="text-sm text-gray-500 mb-3">Age: {child.age}</p>

            {/* Progress Bar */}
            <div className="mb-3">
              <p className="text-sm mb-1">
                📘 Learning Progress: {child.progress}%
              </p>
              <div className="w-full bg-[#3a3a3a] rounded-full h-2">
                <div
                  className="bg-blue h-2 rounded-full"
                  style={{ width: `${child.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Chat Safety */}
            <div className="mb-3">
              <p className="text-sm mb-1">
                💬 Chat Safety Score: {child.chatSafety}%
              </p>
              <div className="w-full bg-[#3a3a3a] rounded-full h-2">
                <div
                  className="bg-teal h-2 rounded-full"
                  style={{ width: `${child.chatSafety}%` }}
                ></div>
              </div>
            </div>

            {/* Lessons */}
            <p className="text-sm mb-2">
              🎯 Lessons Completed:{" "}
              <span className="font-semibold">
                {child.lessonsCompleted}/{child.totalLessons}
              </span>
            </p>

            {/* Emotional Status */}
            <p className="text-sm mb-4">
              💖 Emotional Status:{" "}
              <span className="text-white">{child.emotionalStatus}</span>
            </p>

            {/* Status Badge */}
            <div className="mb-4">
              {child.progress >= 80 ? (
                <span className="px-3 py-1 bg-green-600/30 border border-green-500/50 rounded-full text-xs">
                  Excellent Progress 🌟
                </span>
              ) : child.progress >= 60 ? (
                <span className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded-full text-xs">
                  Keep Improving 💪
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full text-xs">
                  Needs Attention 🚨
                </span>
              )}
            </div>

            {/* Button */}
            <button
              onClick={() =>
                alert(`${child.name}'s detailed progress is under review.`)
              }
              className="bg-blue text-off-white font-semibold px-5 py-2 rounded-full hover:bg-blue-400 transition cursor-pointer"
            >
              📊 View Details
            </button>
          </div>
        ))}
      </div>

      {/* Add Child Section */}
      <div className="mt-10 bg-peach border-2 border-blue rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Add New Child</h2>
        <p className="text-sm text-gray-700 mb-4">
          You can register another child to monitor their safety learning and
          chatbot interactions.
        </p>
        <Link href='/parent/dashborad'>
          <button

            className="bg-teal text-off-white px-6 py-2 rounded-full font-semibold hover:bg-[#28c0a0] transition cursor-pointer"
          >
            ➕ Add Child
          </button>
        </Link>
      </div>
    </div>
  </>
  );
}
