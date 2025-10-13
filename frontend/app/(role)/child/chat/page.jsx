'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChildChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi friend! 🌟 How are you today?", sender: 'friend', timestamp: '10:30 AM' },
    { id: 2, text: "I'm good!", sender: 'child', timestamp: '10:31 AM' },
    { id: 3, text: "That's wonderful! 😊 I'm so happy to hear that!", sender: 'friend', timestamp: '10:31 AM' },
    { id: 4, text: "Would you like to learn something fun about staying safe, or would you rather play a game? 🎮", sender: 'friend', timestamp: '10:32 AM' },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = (text = inputText) => {
    if (text.trim() === '') return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'child',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate friend typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's great! Tell me more! 😊",
        "I understand! You're doing amazing! 💙",
        "Thank you for sharing that with me! ⭐",
        "You're so brave! Want to learn something fun? 🎮",
        "That's wonderful! How does that make you feel? 🤗",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const friendMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'friend',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, friendMessage]);
    }, 1500);
  };

  // Quick response buttons
  const quickResponses = [
    { text: "Let's learn! 📚", emoji: "📚" },
    { text: "Play a game! 🎮", emoji: "🎮" },
    { text: "Tell me more! 💬", emoji: "💬" },
    { text: "I have a question ❓", emoji: "❓" },
  ];

  // Emoji picker (simplified)
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '⭐', '💪', '🤗', '😢', '😰'];

  return (
    <div className="h-screen flex flex-col bg-child">
      {/* Chat Header */}
      <div className="bg-teal text-white shadow-xl">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Friend Avatar */}
              <div className="bg-white rounded-full p-3 shadow-lg">
                <span className="text-2xl">🐻</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Friend</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-safe rounded-full animate-pulse"></div>
                  <span className="text-teal-100 text-sm">Always here for you</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-center text-white text-sm mt-3">
                💙 You can tell me anything. I'm here to listen and help!
              </p>
            </div>
            <div>
              <Link href="/child/">
                <button className="bg-friendly text-white px-8  font-bold text-xl flex items-center space-x-3 cursor-pointer">
                  <span className="text-3xl">⬅️</span>
                  <span>Go Back</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'child' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex items-end space-x-2 max-w-xs md:max-w-md ${message.sender === 'child' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'friend' ? 'bg-teal-100' : 'bg-teal-100'
                  }`}>
                  <span className="text-2xl">{message.sender === 'friend' ? '🐻' : '👧'}</span>
                </div>

                {/* Message Bubble */}
                <div>
                  <div className={`rounded-3xl px-5 py-3 shadow-lg ${message.sender === 'friend'
                      ? 'bg-white border-2 border-teal rounded-tl-sm'
                      : 'bg-teal text-white rounded-tr-sm'
                    }`}>
                    <p className={`text-lg ${message.sender === 'friend' ? 'text-gray-800' : 'text-white'}`}>
                      {message.text}
                    </p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 block ${message.sender === 'child' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-end space-x-2">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐻</span>
                </div>
                <div className="bg-white border-2 border-teal-200 rounded-3xl rounded-tl-sm px-5 py-3 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Response Buttons */}
      <div className="bg-white border-t-2 border-gray-200 px-4 py-3">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(response.text)}
                className="bg-teal-100 hover:bg-teal-200 text-teal-700 px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 flex items-center space-x-1"
              >
                <span>{response.emoji}</span>
                <span>{response.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-4 border-teal-200 px-4 py-4 shadow-2xl">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-3">
            {/* Emoji Picker Button */}
            <div className="relative group">
              <button className="bg-friendly hover:bg-friendly-dark text-gray-800 p-3 rounded-2xl shadow-lg transition-all hover:scale-110">
                <span className="text-2xl">😊</span>
              </button>

              {/* Emoji Dropdown */}
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 hidden group-hover:block">
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(inputText + emoji)}
                      className="text-2xl hover:scale-125 transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message here... 💬"
                className="w-full h-12 px-5 py-2 border-2 border-teal-300 rounded-2xl focus:outline-none focus:border-teal-500 resize-none text-lg"
                rows="2"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              className="bg-teal-500 hover:bg-teal-600 flex items-center text-white p-4 h-12 rounded-2xl shadow-lg transition-all hover:scale-110 flex-shrink-0"
            >
              <span className="text-2xl">➤</span>
            </button>
          </div>

          {/* Helper Text */}
          {/* <p className="text-center text-gray-500 text-sm mt-3">
            💙 You can tell me anything. I'm here to listen and help!
          </p> */}
        </div>
      </div>

    </div>
  );
}