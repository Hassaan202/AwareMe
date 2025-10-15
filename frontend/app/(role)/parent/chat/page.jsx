'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { chatAPI } from '@/app/utils/api';
import ParentNavbar from '../navbar/Navbar';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import { Bot, User, ArrowLeft } from 'lucide-react';

export default function ParentChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome back. How can I help you today?", sender: 'bot', timestamp: '9:00 AM' },
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
    { text: "Show progress", icon: "📊" },
    { text: "Parenting tips", icon: "🌱" },
    { text: "Child activity summary", icon: "🧠" },
    { text: "Ask for advice", icon: "💬" },
  ];

  return (
    <div className="h-screen flex flex-col bg-off-white">
      <ParentNavbar />

      {/* Chat Header */}
      <div className="bg-blue text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Bot className="w-8 h-8 text-blue" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black">Parent Assistant</h1>
              </div>
            </div>
            <div>
              <Link href="/parent">
                <button className="bg-white text-blue px-6 py-2 rounded-xl font-bold flex items-center space-x-2 cursor-pointer hover:bg-gray-100 transition">
                  <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
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
              className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex items-end space-x-2 max-w-xs md:max-w-md lg:max-w-2xl ${message.sender === 'parent' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'bot' ? 'bg-blue' : 'bg-teal'
                  }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
                  ) : (
                    <User className="w-6 h-6 text-white" strokeWidth={2.5} />
                  )}
                </div>

                <div>
                  <div className={`rounded-3xl px-5 py-3 shadow-lg ${message.sender === 'bot'
                      ? 'bg-white border-2 border-blue rounded-tl-sm'
                      : 'bg-blue text-white rounded-tr-sm'
                    }`}>
                    {message.sender === 'bot' ? (
                      <div className="text-gray-800">
                        <MarkdownRenderer content={message.text} isDarkBg={false} />
                      </div>
                    ) : (
                      <div className="text-white">
                        <MarkdownRenderer content={message.text} isDarkBg={true} />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs text-gray-500 block mt-1 ${message.sender === 'parent' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-end space-x-2">
                <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="bg-white border-2 border-blue rounded-3xl rounded-tl-sm px-5 py-3 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Response Buttons */}
      <div className="bg-white border-t-2 border-blue/20 px-4 py-3">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickResponses.map((res, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(res.text)}
                className="bg-blue/10 hover:bg-blue/20 text-blue border-2 border-blue/30 px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-sm"
              >
                <span className="mr-1">{res.icon}</span>
                {res.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-blue/20 px-4 py-4 shadow-lg">
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
            className="flex-1 h-12 px-4 py-3 border-2 border-blue/30 rounded-2xl focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 resize-none transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputText.trim()}
            className="bg-blue hover:bg-blue/90 text-white p-3 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
