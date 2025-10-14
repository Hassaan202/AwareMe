'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChildNavbar from '../Navbar/Navbar';

export default function ChildRewardsPage() {
  const [points, setPoints] = useState(120);
  const [streak, setStreak] = useState(5);
  const [badges, setBadges] = useState([
    { id: 1, name: 'Safety Starter 🛡️', description: 'Completed your first safety lesson!', earned: true },
    { id: 2, name: 'Kind Communicator 💬', description: 'Chatted with your virtual friend 10 times!', earned: true },
    { id: 3, name: 'Brave Learner 🌈', description: 'Answered 5 quiz questions correctly!', earned: false },
    { id: 4, name: 'Daily Hero 🔥', description: 'Maintained a 3-day streak!', earned: true },
  ]);

  useEffect(() => {
    document.title = "Child Rewards | SafeKids";
  }, []);

  return (
    <>
    <ChildNavbar />
    <div className="min-h-screen bg-off-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-teal-600">🏆 Your Rewards</h1>
        <Link href="/child" className="text-lg bg-teal hover:bg-teal-400 text-white px-5 py-2 rounded-xl shadow-lg">
          ⬅️ Back
        </Link>
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow-xl rounded-3xl p-6 mb-8 border-2 border-teal-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-teal-500">Total Points: <span className="text-3xl text-yellow-500">{points}</span></h2>
            <p className="text-gray-600 mt-2">Earn points by learning lessons, chatting, and staying safe!</p>
          </div>

          {/* Streak Info */}
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 text-center">
            <h3 className="text-xl font-bold text-yellow-700">🔥 {streak}-Day Streak!</h3>
            <p className="text-sm text-yellow-600">Keep learning every day to maintain your streak!</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-teal-600 mb-3">Learning Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div className="bg-teal-400 h-5 rounded-full transition-all" style={{ width: '65%' }}></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">65% completed</p>
      </div>

      {/* Badges Section */}
      <h2 className="text-2xl font-bold text-teal-600 mb-4">Your Badges 🎖️</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map(badge => (
          <div key={badge.id} className={`rounded-3xl p-5 border-2 shadow-md transition-all hover:scale-105 ${badge.earned ? 'bg-orange-100 border-peach' : 'bg-gray-100 border-gray-300 opacity-70'}`}>
            <h3 className="text-xl font-semibold">{badge.name}</h3>
            <p className="text-gray-600 mt-2">{badge.description}</p>
            {badge.earned ? (
              <p className="text-green-600 font-bold mt-3">✅ Earned</p>
            ) : (
              <p className="text-gray-500 mt-3">🔒 Not yet earned</p>
            )}
          </div>
        ))}
      </div>

      {/* Redeem Section */}
      <div className="mt-12 bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-lg">
        <h2 className="text-2xl font-bold text-teal-700 mb-3">🎁 Redeem Rewards</h2>
        <p className="text-gray-600 mb-4">Use your points to unlock fun items and badges!</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-teal-400 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl shadow-lg">🎨 Unlock Avatar Outfit - 100 pts</button>
          <button className="bg-teal-400 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl shadow-lg">🎵 Unlock New Background Music - 50 pts</button>
          <button className="bg-teal-400 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl shadow-lg">🌈 Claim Achievement Frame - 75 pts</button>
        </div>
      </div>
    </div>
    </>
  );
}
