'use client';
import Link from 'next/link';
import ChildNavbar from '../Navbar/Navbar';
import EmergencyButton from '@/app/components/EmergencyButton';
import { useState } from 'react';

export default function ChildLearnPage() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [learnedZones, setLearnedZones] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Body zones data
  const bodyZones = {
    head: {
      type: 'good',
      title: 'Head',
      icon: '✅',
      color: 'bg-teal-400',
      message: "It's okay when trusted adults pat your head!",
      tip: "But remember: You can always say NO if you don't want it!",
      emoji: '💚',
    },
    shoulders: {
      type: 'good',
      title: 'Shoulders',
      icon: '✅',
      color: 'bg-teal-400',
      message: "Friendly pats on the shoulder are usually okay!",
      tip: "From people you know and trust, like family and teachers.",
      emoji: '💚',
    },
    arms: {
      type: 'good',
      title: 'Arms & Hands',
      icon: '✅',
      color: 'bg-teal-400',
      message: "Handshakes and helping hands are good touches!",
      tip: "These are friendly and helpful touches.",
      emoji: '💚',
    },
    chest: {
      type: 'bad',
      title: 'Chest (Private)',
      icon: '❌',
      color: 'bg-red-400',
      message: "This is a PRIVATE zone! Nobody should touch here!",
      tip: "If anyone tries, say NO loudly and tell a trusted adult RIGHT AWAY!",
      emoji: '🛡️',
    },
    privateBottom: {
      type: 'bad',
      title: 'Private Parts',
      icon: '❌',
      color: 'bg-red-400',
      message: "This is YOUR private area covered by your swimsuit!",
      tip: "You are the BOSS of your body! Nobody should touch these areas!",
      emoji: '🛡️',
    },
    back: {
      type: 'warning',
      title: 'Back',
      icon: '⚠️',
      color: 'bg-yellow-400',
      message: "Upper back pats are usually okay from trusted people.",
      tip: "But lower back touches can be inappropriate. Trust your feelings!",
      emoji: '💛',
    },
    legs: {
      type: 'warning',
      title: 'Legs',
      icon: '⚠️',
      color: 'bg-yellow-400',
      message: "Knees and feet are okay, but inner thighs are private!",
      tip: "If any touch feels wrong or makes you uncomfortable, say NO!",
      emoji: '💛',
    },
  };

  const handleZoneClick = (zoneName) => {
    setSelectedZone(zoneName);
    setShowPopup(true);

    if (!learnedZones.includes(zoneName)) {
      setLearnedZones([...learnedZones, zoneName]);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const progress = (learnedZones.length / Object.keys(bodyZones).length) * 100;

  return (
    <>
      <ChildNavbar />
      <EmergencyButton />
      <div className="min-h-screen bg-gradient-to-b from-friendly to-white p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-primary-600">Learn About Safety!</h1>
          <Link href="/child">
            <button className="bg-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-600 transition flex items-center space-x-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-800 text-lg">
              Your Progress:
            </span>
            <span className="text-blue font-bold text-lg">
              {learnedZones.length}/{Object.keys(bodyZones).length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-white font-bold text-sm">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Child Image with Click Zones */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue relative">
            <h2 className="text-2xl font-bold text-center text-blue mb-6">
              Click on the Body Parts!
            </h2>


            <div className="relative flex justify-center items-center">
              <img
                src="https://www.kindpng.com/picc/m/93-932302_clip-art-transparent-cartoon-png-for-boy-body.png"
                alt="Child illustration"
                className="max-w-full h-screen block"
              />


              {/* Transparent clickable zones (tweak positions if needed in your layout) */}
              <div
                className="absolute cursor-pointer hover:bg-blue-200/40 rounded-full"
                style={{ top: '6%', left: '43%', width: '14%', height: '10%' }}
                onClick={() => handleZoneClick('head')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-blue-200/40 rounded-xl"
                style={{ top: '17%', left: '38%', width: '24%', height: '10%' }}
                onClick={() => handleZoneClick('shoulders')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-blue-200/40 rounded-xl"
                style={{ top: '25%', left: '28%', width: '44%', height: '15%' }}
                onClick={() => handleZoneClick('arms')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-red-300/40 rounded-xl"
                style={{ top: '38%', left: '40%', width: '20%', height: '10%' }}
                onClick={() => handleZoneClick('chest')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-yellow-300/40 rounded-xl"
                style={{ top: '48%', left: '40%', width: '20%', height: '8%' }}
                onClick={() => handleZoneClick('back')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-red-300/40 rounded-full"
                style={{ top: '55%', left: '42%', width: '16%', height: '10%' }}
                onClick={() => handleZoneClick('privateBottom')}
              ></div>

              <div
                className="absolute cursor-pointer hover:bg-yellow-200/40 rounded-xl"
                style={{ top: '65%', left: '44%', width: '12%', height: '25%' }}
                onClick={() => handleZoneClick('legs')}
              ></div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className=" rounded-3xl bg-teal-100 p-6 shadow-xl border-2 border-teal">
              <h3 className="text-2xl font-bold text-teal-600 mb-4">
                Color Guide:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Green = Good Touch</p>
                    <p className="text-sm text-gray-600">Usually safe and okay</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-2xl">
                    ❌
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Red = Private Zone</p>
                    <p className="text-sm text-gray-600">
                      Nobody should touch here!
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                    ⚠️
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Yellow = Depends</p>
                    <p className="text-sm text-gray-600">Trust your feelings!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 rounded-3xl p-6 shadow-xl border-2 border-blue-400">
              <h3 className="text-2xl font-bold text-blue mb-4">
                💪 Remember:
              </h3>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start space-x-2">
                  <span className="text-xl">🛡️</span>
                  <span className="font-semibold">Your body belongs to YOU!</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl">🗣️</span>
                  <span className="font-semibold">You can say NO to anyone!</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl">👨‍👩‍👧</span>
                  <span className="font-semibold">
                    Tell a trusted adult if something feels wrong!
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl">💙</span>
                  <span className="font-semibold">It's NEVER your fault!</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-100 rounded-3xl p-6 shadow-xl border-2 border-peach">
              <h3 className="text-2xl font-bold text-peach mb-3">🆘 Need Help?</h3>
              <p className="text-gray-800 mb-4 font-semibold">
                If someone touched you in a way that felt wrong, tell someone NOW!
              </p>
              <Link href='chat/'>
              <button className="cursor-pointer w-full bg-peach hover:bg-orange-300 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105">
                Get Help Right Now
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Popup */}
        {showPopup && selectedZone && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-blue-300 transform scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div
                  className={`${bodyZones[selectedZone].color} w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl`}
                >
                  {bodyZones[selectedZone].emoji}
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">
                  {bodyZones[selectedZone].icon} {bodyZones[selectedZone].title}
                </h3>
                <p className="text-xl text-gray-800 font-semibold mb-3">
                  {bodyZones[selectedZone].message}
                </p>
                <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                  <p className="text-lg text-blue-400 font-semibold">
                    💡 {bodyZones[selectedZone].tip}
                  </p>
                </div>
                <button
                  onClick={closePopup}
                  className="bg-blue hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105"
                >
                  Got It! ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-8 bg-teal rounded-3xl p-8 text-center shadow-2xl border-2 border-green-500">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-4xl font-black text-gray-800 mb-3">
              Amazing Job! You're a Safety Expert!
            </h2>
            <p className="text-xl text-gray-800 font-semibold mb-4">
              You've learned all about safe touches! 🌟
            </p>
            <div className="flex justify-center space-x-2 text-4xl">
              ⭐⭐⭐⭐⭐⭐⭐
            </div>
          </div>
        )}
      </div>
    </>
  );
}
