'use client';
import Link from 'next/link';
import ChildNavbar from '../Navbar/Navbar';
import EmergencyButton from '@/app/components/EmergencyButton';
import { useState, useEffect } from 'react';
import { userUtils } from '@/app/utils/api';

export default function ChildLearnPage() {
  const [selectedMode, setSelectedMode] = useState(null); // 'game' or 'lessons'
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Body zones data for the game mode
  const [selectedZone, setSelectedZone] = useState(null);
  const [learnedZones, setLearnedZones] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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

  // Fetch lessons from API
  useEffect(() => {
    if (selectedMode === 'lessons') {
      fetchLessons();
    }
  }, [selectedMode]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const token = userUtils.getToken();
      const response = await fetch('http://localhost:8000/api/learning/lessons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedLesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      const token = userUtils.getToken();
      const response = await fetch('http://localhost:8000/api/learning/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          answers: answers
        })
      });
      const data = await response.json();
      if (data.success) {
        setQuizResult(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
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

  // Main selection screen
  if (!selectedMode) {
    return (
      <>
        <ChildNavbar />
        <EmergencyButton />
        <div className="min-h-screen bg-gradient-to-b from-peach to-white p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-black text-blue">Learn About Safety!</h1>
            <Link href="/child">
              <button className="bg-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-600 transition flex items-center space-x-2 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Go Back</span>
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
            {/* Interactive Body Game */}
            <div
              onClick={() => setSelectedMode('game')}
              className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-teal hover:border-blue hover:scale-105 transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="bg-teal w-32 h-32 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 group-hover:scale-110 transition-all">
                  🎮
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">
                  Interactive Body Game
                </h2>
                <p className="text-lg text-gray-700 font-semibold mb-4">
                  Click on different body parts to learn about good touch and bad touch!
                </p>
                <div className="bg-teal-100 rounded-2xl p-4 mt-4">
                  <p className="text-teal-700 font-bold">
                    ✨ Fun & Interactive Learning
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Lessons */}
            <div
              onClick={() => setSelectedMode('lessons')}
              className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue hover:border-teal hover:scale-105 transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="bg-blue w-32 h-32 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 group-hover:scale-110 transition-all">
                  📚
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">
                  Safety Lessons
                </h2>
                <p className="text-lg text-gray-700 font-semibold mb-4">
                  Complete interactive lessons and quizzes to learn about staying safe!
                </p>
                <div className="bg-blue-100 rounded-2xl p-4 mt-4">
                  <p className="text-blue font-bold">
                    📖 Learn & Test Your Knowledge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Game Mode - Body Zones
  if (selectedMode === 'game') {
    return (
      <>
        <ChildNavbar />
        <EmergencyButton />
        <div className="min-h-screen bg-gradient-to-b from-peach to-white p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black text-blue">Interactive Body Game</h1>
            <button
              onClick={() => setSelectedMode(null)}
              className="bg-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-600 transition flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Menu</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-800 text-lg">Your Progress:</span>
              <span className="text-blue font-bold text-lg">
                {learnedZones.length}/{Object.keys(bodyZones).length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue to-teal h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${progress}%` }}
              >
                {progress > 20 && (
                  <span className="text-white font-bold text-sm">{Math.round(progress)}%</span>
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

                {/* Transparent clickable zones */}
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
              <div className="rounded-3xl bg-teal-100 p-6 shadow-xl border-2 border-teal">
                <h3 className="text-2xl font-bold text-teal mb-4">Color Guide:</h3>
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
                    <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-2xl">
                      ❌
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Red = Private Zone</p>
                      <p className="text-sm text-gray-600">Nobody should touch here!</p>
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

              <div className="bg-blue-100 rounded-3xl p-6 shadow-xl border-2 border-blue">
                <h3 className="text-2xl font-bold text-blue mb-4">💪 Remember:</h3>
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
            </div>
          </div>

          {/* Popup */}
          {showPopup && selectedZone && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={closePopup}
            >
              <div
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-blue-300"
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
                    <p className="text-lg text-blue font-semibold">
                      💡 {bodyZones[selectedZone].tip}
                    </p>
                  </div>
                  <button
                    onClick={closePopup}
                    className="bg-teal hover:bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold transition cursor-pointer"
                  >
                    Got it! ✅
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Lessons Mode
  if (selectedMode === 'lessons') {
    // Lesson selection
    if (!selectedLesson) {
      return (
        <>
          <ChildNavbar />
          <EmergencyButton />
          <div className="min-h-screen bg-gradient-to-b from-peach to-white p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-black text-blue">Safety Lessons</h1>
              <button
                onClick={() => setSelectedMode(null)}
                className="bg-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-600 transition flex items-center space-x-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Menu</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-16 h-16 border-4 border-blue border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-xl font-bold text-gray-700">Loading lessons...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className="bg-white rounded-3xl p-6 shadow-xl border-2 border-blue hover:border-teal hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="bg-blue w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                        {index === 0 ? '🤗' : index === 1 ? '💪' : '👨‍👩‍👧'}
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 mb-3">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-700 font-semibold mb-4">
                        {lesson.description}
                      </p>
                      <div className="bg-blue-100 rounded-xl p-3">
                        <p className="text-blue font-bold text-sm">
                          {lesson.questions.length} Questions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    // Quiz view
    if (!showResults) {
      const currentQuestion = selectedLesson.questions[currentQuestionIndex];

      return (
        <>
          <ChildNavbar />
          <EmergencyButton />
          <div className="min-h-screen bg-gradient-to-b from-peach to-white p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-blue">{selectedLesson.title}</h1>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="bg-teal text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-600 transition cursor-pointer"
                >
                  Back to Lessons
                </button>
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">
                    Question {currentQuestionIndex + 1} of {selectedLesson.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue h-3 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / selectedLesson.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue mb-6">
                <div className="prose max-w-none">
                  {currentQuestionIndex === 0 && (
                    <div className="mb-6 whitespace-pre-line text-gray-800 text-lg font-semibold">
                      {selectedLesson.content}
                    </div>
                  )}
                </div>
              </div>

              {/* Question */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-teal">
                <h2 className="text-2xl font-black text-gray-800 mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 rounded-2xl font-bold text-left transition-all cursor-pointer ${
                        answers[currentQuestionIndex] === index
                          ? 'bg-teal text-white border-2 border-teal'
                          : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:border-teal'
                      }`}
                    >
                      <span className="text-lg">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestionIndex] === undefined}
                  className={`mt-6 w-full py-4 rounded-2xl font-bold text-white text-lg transition-all ${
                    answers[currentQuestionIndex] !== undefined
                      ? 'bg-blue hover:bg-blue-600 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex < selectedLesson.questions.length - 1
                    ? 'Next Question →'
                    : 'Submit Quiz ✅'}
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }

    // Results view
    return (
      <>
        <ChildNavbar />
        <EmergencyButton />
        <div className="min-h-screen bg-gradient-to-b from-peach to-white p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-blue text-center">
              <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl ${
                quizResult.passed ? 'bg-teal' : 'bg-yellow-400'
              }`}>
                {quizResult.passed ? '🎉' : '💪'}
              </div>

              <h1 className="text-4xl font-black text-gray-800 mb-4">
                {quizResult.passed ? 'Great Job!' : 'Keep Learning!'}
              </h1>

              <div className="bg-blue-100 rounded-2xl p-6 mb-6">
                <p className="text-3xl font-black text-blue mb-2">
                  Score: {quizResult.score}/{quizResult.total}
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {quizResult.passed
                    ? 'You passed the lesson! 🌟'
                    : 'Try again to improve your score!'}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setShowResults(false);
                    setQuizResult(null);
                    setAnswers([]);
                  }}
                  className="w-full bg-blue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition cursor-pointer"
                >
                  Choose Another Lesson
                </button>
                {!quizResult.passed && (
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers([]);
                      setShowResults(false);
                      setQuizResult(null);
                    }}
                    className="w-full bg-teal hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition cursor-pointer"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

