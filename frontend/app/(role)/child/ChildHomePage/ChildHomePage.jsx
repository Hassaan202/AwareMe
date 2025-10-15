'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ChildHomePage() {
  const [activeCard, setActiveCard] = useState(0);

  // Auto-rotate fun facts
  const funFacts = [
    { icon: '🛡️', text: 'Your body belongs to YOU!' },
    { icon: '💪', text: 'Saying NO is brave and okay!' },
    { icon: '🗣️', text: 'Your voice matters! Speak up!' },
    { icon: '🤗', text: 'Hugs should always feel good!' },
  ];
  const borderColors = ['border-peach', 'border-blue', 'border-offwhite', 'border-teal'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % funFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-child">
      {/* Hero Section with Solid Peach Background - Reduced Height */}
      <section className="relative min-h-[450px] flex items-center justify-center overflow-hidden bg-peach">
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-12 text-center">
          {/* Mascot/Character */}
          <div className="mb-4">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#80CBC4" opacity="0.3"/>
              <path d="M50 20 L35 35 L35 65 L50 80 L65 65 L65 35 Z" fill="#80CBC4" stroke="#2C7A7B" strokeWidth="2"/>
              <circle cx="42" cy="45" r="3" fill="#2C7A7B"/>
              <circle cx="58" cy="45" r="3" fill="#2C7A7B"/>
              <path d="M40 55 Q50 60 60 55" stroke="#2C7A7B" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-blue mb-4 leading-tight">
            You Are Brave!
            <br />
            <span className="text-teal">You Are Safe!</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-800 font-bold mb-3">
            We're Here for You!
          </p>

          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Learn about safety, play fun games, and chat with your friendly guide anytime!
          </p>

          {/* CTA Buttons - Removed Games */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/child/chat">
              <button className="bg-white text-primary-600 px-8 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:scale-110 transition-all flex items-center space-x-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Chat with Friend</span>
              </button>
            </Link>

            <Link href="/child/learn">
              <button className="bg-blue text-white px-8 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:scale-110 transition-all flex items-center space-x-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Start Learning</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Safety Tips Section */}
      <section className="py-16 bg-gradient-to-b from-child to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl text-blue md:text-5xl font-black text-center text-primary-600 mb-12">
            Did You Know?
          </h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {funFacts.map((fact, index) => {
              const borderClass = borderColors[index % borderColors.length];
              const isActive = activeCard === index;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-8 shadow-xl border-4 transition-all duration-500
          ${isActive ? `scale-105 shadow-2xl ${borderClass}` : `${borderClass} hover:border-primary-300`}
        `}
                >
                  <div className="text-6xl mb-4 text-center">{fact.icon}</div>
                  <p className="text-lg font-bold text-gray-800 text-center leading-tight">
                    {fact.text}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-blue mb-12">
            What Can You Do Here?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Chat */}
            <div className="bg-orange-50 rounded-3xl p-8 border-4 border-orange-100 hover:border-orange-400 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-20 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-orange-600 mb-3 text-center">
                Chat Anytime
              </h3>
              <p className="text-gray-700 text-center text-lg">
                Talk to your friendly guide whenever you need someone to listen!
              </p>
              <Link href="/child/chat">
                <button className="mt-6 w-full bg-orange-300 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer">
                  Start Chat
                </button>
              </Link>
            </div>

            {/* Feature 2 - Learn */}
            <div className="bg-teal-50 rounded-3xl p-8 border-4 border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-20 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-teal-700 mb-3 text-center">
                Learn & Grow
              </h3>
              <p className="text-gray-700 text-center text-lg">
                Fun lessons about staying safe and being strong!
              </p>
              <Link href="/child/learn">
                <button className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer">
                  Start Learning
                </button>
              </Link>
            </div>

            {/* Feature 3 - Emergency */}
            <div className="bg-red-50 rounded-3xl p-8 border-4 border-red-200 hover:border-red-400 hover:shadow-xl transition-all">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-3 text-center">
                Get Help Now
              </h3>
              <p className="text-gray-700 text-center text-lg">
                Need help right now? Click the red button to send an emergency alert!
              </p>
              <button
                onClick={() => {
                  // Trigger the emergency button click
                  const emergencyBtn = document.querySelector('[title="Emergency Alert"]');
                  if (emergencyBtn) emergencyBtn.click();
                }}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer"
              >
                Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}