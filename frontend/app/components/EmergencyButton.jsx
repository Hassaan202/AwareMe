'use client';

import { useState } from 'react';
import { emergencyAPI } from '@/app/utils/api';

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendAlert = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const response = await emergencyAPI.sendAlert(message, location);
      if (response.success) {
        alert('Emergency alert sent! Help is on the way.');
        setMessage('');
        setLocation('');
        setShowModal(false);
      } else {
        alert('Failed to send alert. Please try again.');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Unable to send alert. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all cursor-pointer animate-pulse"
        title="Emergency Alert"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </button>

      {/* Emergency Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Emergency Alert</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-700 mb-4">
              This will send an alert to your trusted contacts. Please describe what's happening.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">What's wrong?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I need help because..."
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:border-red-500 resize-none"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Where are you? (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="My location..."
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSendAlert}
                  disabled={sending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  {sending ? 'Sending...' : 'Send Alert'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}