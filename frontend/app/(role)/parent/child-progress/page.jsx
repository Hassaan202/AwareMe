"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
import { profileAPI } from "@/app/utils/api";

export default function ParentChildProgress() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch children on component mount
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getChildren();
      if (response.success) {
        setChildren(response.children);
      }
    } catch (err) {
      console.error('Error fetching children:', err);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <ParentNavbar />
    <div className="min-h-screen bg-off-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Child Progress Overview
      </h1>

      {/* Parent Info */}
      <div className="bg-peach border-2 border-blue rounded-2xl p-5 mb-10 shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back, Parent!</h2>
        <p className="text-gray-700 text-sm">
          Here you can view all your linked children. Learning progress tracking will be available soon.
        </p>
      </div>

      {/* Children Cards */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
          <p className="mt-4 text-lg">Loading children...</p>
        </div>
      ) : children.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-4">No children linked yet.</p>
          <p className="text-gray-600">Click "Add New Child" below to link a child account</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-peach border-2 border-blue rounded-2xl p-6 shadow hover:shadow-black/30 transition"
            >
              <div className="text-center mb-4">
                <div className="flex justify-center mb-2">
                  <svg className="w-20 h-20 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-1">{child.name}</h3>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Age:</span> {child.age}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span> {child.email}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-4 text-center">
                <span className="px-3 py-1 bg-teal/30 border border-teal/50 rounded-full text-xs flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Active Account</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Child Section */}
      <div className="mt-10 bg-peach border-2 border-blue rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Add New Child</h2>
        <p className="text-sm text-gray-700 mb-4">
          Link another child account to monitor their safety learning and chatbot interactions.
        </p>
        <Link href='/parent/dashborad'>
          <button
            className="bg-teal text-black px-6 py-2 rounded-full font-semibold hover:bg-[#28c0a0] transition cursor-pointer flex items-center space-x-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Child</span>
          </button>
        </Link>
      </div>
    </div>
  </>
  );
}
