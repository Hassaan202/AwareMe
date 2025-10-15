'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { chatAPI } from '@/app/utils/api';
import EmergencyButton from '@/app/components/EmergencyButton';

export default function ChildChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi friend! How are you today?", sender: 'friend', timestamp: '10:30 AM' },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text = inputText) => {
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

    // Call backend API
    setIsTyping(true);
    try {
      const response = await chatAPI.childChat(text);

      setIsTyping(false);
      if (response.success) {
        const friendMessage = {
          id: messages.length + 2,
          text: response.response,
          sender: 'friend',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, friendMessage]);

        // Show alert if distress detected
        if (response.distressDetected) {
          setTimeout(() => {
            alert('I noticed you might need help. Remember, you can always talk to a trusted adult!');
          }, 1000);
        }
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again!",
        sender: 'friend',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const quickResponses = [
    { text: "Let's learn!", emoji: "📚" },
    { text: "Play a game!", emoji: "🎮" },
    { text: "Tell me more!", emoji: "💬" },
    { text: "I have a question", emoji: "❓" },
  ];

  return (
    <div className="h-screen flex flex-col bg-child">
      <EmergencyButton />

      {/* Chat Header */}
      <div className="bg-teal text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8 text-teal" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 20 L35 35 L35 65 L50 80 L65 65 L65 35 Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="42" cy="45" r="2" fill="white"/>
                  <circle cx="58" cy="45" r="2" fill="white"/>
                  <path d="M40 55 Q50 60 60 55" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">AwareMigo</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-teal-100 text-sm">Always here for you</span>
                </div>
              </div>
            </div>
            <div>
              <Link href="/child/">
                <button className="bg-white text-teal px-6 py-2 rounded-xl font-bold flex items-center space-x-2 cursor-pointer hover:bg-gray-100 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
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
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'friend' ? 'bg-teal' : 'bg-blue'
                  }`}>
                  {message.sender === 'friend' ? (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 20 L35 35 L35 65 L50 80 L65 65 L65 35 Z" fill="white" stroke="white" strokeWidth="2"/>
                      <circle cx="42" cy="45" r="2" fill="currentColor"/>
                      <circle cx="58" cy="45" r="2" fill="currentColor"/>
                      <path d="M40 55 Q50 60 60 55" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

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
                <div className="w-10 h-10 bg-teal rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20 L35 35 L35 65 L50 80 L65 65 L65 35 Z" fill="white" stroke="white" strokeWidth="2"/>
                  </svg>
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
            {/* Text Input */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              className="flex-1 h-14 px-5 py-3 border-2 border-teal-300 rounded-2xl focus:outline-none focus:border-teal-500 resize-none text-lg"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping}
              className="bg-teal hover:bg-teal-600 text-white p-4 rounded-2xl shadow-lg transition-all hover:scale-110 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}