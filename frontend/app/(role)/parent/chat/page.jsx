'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { chatAPI } from '@/app/utils/api';
import ParentNavbar from '../navbar/Navbar';

export default function ParentChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋, welcome back! How can I help you today?", sender: 'bot', timestamp: '9:00 AM' },
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

    const newMessage = {
      id: messages.length + 1,
      text,
      sender: 'parent',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    setIsTyping(true);
    try {
      const response = await chatAPI.parentChat(text);

      setIsTyping(false);
      if (response.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const quickResponses = [
    { text: "Show progress 📊" },
    { text: "Parenting tips 🌱" },
    { text: "Child activity summary 🧠" },
    { text: "Ask for advice 💬" },
  ];

  return (
    <>
      <ParentNavbar />
      <div className="h-screen flex flex-col bg-off-white">
        {/* Header */}
        <div className="bg-blue text-white shadow-lg">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white text-blue rounded-full p-2 shadow-md">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Parent Assistant</h1>
                <span className="text-sm text-blue-100">Guidance & Insights</span>
              </div>
            </div>

            <Link href="/parent">
              <button className=" text-white font-semibold px-4 py-2 rounded-xl cursor-pointer">
                ⬅ Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="container mx-auto max-w-4xl">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className={`flex items-end space-x-2 max-w-md ${msg.sender === 'parent' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xl">{msg.sender === 'bot' ? '🤖' : '👨‍👩‍👧'}</span>
                  </div>
                  <div>
                    <div className={`rounded-3xl px-5 py-3 shadow-md ${msg.sender === 'bot'
                        ? 'bg-white border border-blue-200'
                        : 'bg-blue text-white'
                      }`}>
                      <p className="text-lg">{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 block mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="flex items-end space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-3xl px-5 py-3 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Response Buttons */}
        <div className="bg-white border-t px-4 py-3">
          <div className="container mx-auto max-w-4xl flex flex-wrap gap-2 justify-center">
            {quickResponses.map((res, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(res.text)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full font-medium text-sm transition-all"
              >
                {res.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t-2 border-blue-200 px-4 py-4">
          <div className="container mx-auto max-w-4xl flex items-center space-x-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your question or message here..."
              className="flex-1 h-12 px-4 py-2 border border-blue-300 rounded-2xl focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-md transition-all disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
