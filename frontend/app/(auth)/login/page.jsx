"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI, userUtils } from '@/app/utils/api'

export default function Login() {
  const [role, setRole] = useState('parent');
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);

      if (response.success) {
        userUtils.saveToken(response.token);
        userUtils.saveUser(response.user);

        if (response.user.role === 'parent') {
          router.push('/parent');
        } else {
          router.push('/child');
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getRoute = (role) => {
    if (role === 'child') {
      return '/child';
    } else {
      return '/parent';
    }
  };
  
  return (
    <div className='min-h-screen bg-peach flex items-center justify-center p-4'>
      <div className="bg-off-white rounded-3xl shadow-2xl border-2 border-primary-200 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-2xl text-blue mb-2">Aware Me🛡️</div>
          <h1 className="text-xl font-bold text-gray-700 mb-2">
            LogIn
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              placeholder="Enter your email"
            />
          </div>
           {/* Password Input */}
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              placeholder="Enter your password"
            />
          </div>
          {/* Role Selection */}
          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`p-2 rounded-xl border-2 transition-all  ${
                  role === 'parent'
                    ? 'bg-blue-100 border-blue border-2'
                    : 'border-2 border-blue'
                }`}
              >
                <div className="text-xl mb-1">👨‍👩‍👧</div>
                <div className={`font-semibold ${
                  role === 'parent' ? 'text-blue-400' : 'text-gray-600'
                }`}>
                  Parent
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('child')}
                className={`p-2 rounded-xl border-2 transition-all ${
                  role === 'child'
                    ? 'bg-green-100 border-teal border-2'
                    : 'border-2 border-teal'
                }`}
              >
                <div className="text-xl mb-1">👧</div>
                <div className={`font-semibold ${
                  role === 'child' ? 'text-green-700' : 'text-gray-600'
                }`}>
                  Child
                </div>
              </button>
            </div>
          </div>
           {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-primary-500 shadow-lg transition-all hover:scale-105 cursor-pointer ${
              role == 'parent' ? 'bg-blue hover:bg-blue-400'
              : 'bg-teal hover:bg-teal-500'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
            {loading ? 'Logging in...' : 'Login 🚀'}
          </button>
        </form>
        {/* Footer Links */}
        <div className="mt-3 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-500 font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
