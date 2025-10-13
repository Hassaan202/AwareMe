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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200')",
            //  filter:  'brightness(0.7)',
          }}
        />

        {/* Colorful Overlay */}
        <div className="absolute inset-0 " />
        {/* bg-gradient-to-br from-primary-500/70 via-purple-500/60 to-friendly/70 */}
        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-bounce text-6xl">⭐</div>
          <div className="absolute top-40 right-20 animate-pulse text-6xl">🌈</div>
          <div className="absolute bottom-32 left-1/4 animate-bounce text-5xl" style={{ animationDelay: '0.5s' }}>💙</div>
          <div className="absolute bottom-20 right-1/3 animate-pulse text-5xl" style={{ animationDelay: '1s' }}>✨</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          {/* Mascot/Character */}
          <div className="mb-6 animate-bounce">
            <span className="text-5xl drop-shadow-2xl">🛡️</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
            You Are Brave!
            <br />
            <span className="text-friendly">You Are Safe!</span>
          </h1>

          {/* Subheading */}
          <p className="text-2xl md:text-3xl text-white font-bold mb-4 drop-shadow-lg">
            We're Here for You! 💙✨
          </p>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-lg">
            Learn about safety, play fun games, and chat with your friendly guide anytime!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/child/chat">
              <button className="bg-peach text-primary-600 px-8 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:scale-110 transition-all flex items-center space-x-3">
                <span className="text-3xl">💬</span>
                <span>Chat with Friend</span>
              </button>
            </Link>

            <Link href="/child/learn">
              <button className="bg-blue text-gray-800 px-8 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:scale-110 transition-all flex items-center space-x-3">
                <span className="text-3xl">📚</span>
                <span>Start Learning</span>
              </button>
            </Link>

            <Link href="/child/games">
              <button className="bg-teal text-white px-8 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:scale-110 transition-all flex items-center space-x-3">
                <span className="text-3xl">🎮</span>
                <span>Play Games</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Safety Tips Section */}
      <section className="py-16 bg-gradient-to-b from-child to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl text-blue md:text-5xl font-black text-center text-primary-600 mb-12">
            🌟 Did You Know?
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
            What Can You Do Here? 🚀
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-orange-50 rounded-3xl p-8 border-4 border-orange-100 hover:border-orange-400  hover:shadow-xl transition-all">
              <div className="text-7xl mb-4 text-center">💬</div>
              <h3 className="text-orange-300 text-2xl font-bold text-primary-700 mb-3 text-center">
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

            {/* Feature 2 */}
            <div className="bg-teal-50 rounded-3xl p-8 border-4 border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all">
              <div className="text-7xl mb-4 text-center">📚</div>
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

            {/* Feature 3 */}
            <div className="bg-blue-50 rounded-3xl p-8 border-4 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all">
              <div className="text-7xl mb-4 text-center">🎮</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-3 text-center">
                Play & Win
              </h3>
              <p className="text-gray-700 text-center text-lg">
                Play games and earn stars, badges, and rewards!
              </p>
              <Link href="/child/games">
                <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all cursor-pointer">
                  Play Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-gradient-to-br from-emergency-light to-emergency/30">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 shadow-2xl border-2 border-peach">
            <div className="text-8xl mb-6">🆘</div>
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              Need Help Right Now?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              If something doesn't feel right or you're scared, we're here for you!
            </p>
            <Link href="/child/help">
              <button className="bg-peach hover:bg-peach text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:scale-110 transition-all animate-pulse">
                Get Help Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}