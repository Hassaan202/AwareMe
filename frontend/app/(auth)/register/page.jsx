"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI, userUtils } from '@/app/utils/api'

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState('parent');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    age: '',
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
      const signupData = {
        email: formData.email,
        password: formData.password,
        role: role,
        name: formData.name,
        age: role === 'child' && formData.age ? parseInt(formData.age) : null,
      };

      const response = await authAPI.signup(signupData);

      if (response.success) {
        userUtils.saveToken(response.token);
        userUtils.saveUser(response.user);

        if (response.user.role === 'parent') {
          router.push('/parent');
        } else {
          router.push('/child');
        }
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-peach flex items-center justify-center p-4'>
      <div className="bg-off-white rounded-3xl shadow-2xl border-2 border-primary-200 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-2xl text-blue mb-2">Aware Me🛡️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Create Account
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
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
              placeholder="Enter your name"
            />
          </div>
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

          {/* Age Input - Only for Children */}
          {role === 'child' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                required
                min="1"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                placeholder="Enter your age"
              />
            </div>
          )}

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
              placeholder="Create a password"
            />
          </div>
           {/* Submit Button */}
           <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-primary-500 shadow-lg transition-all hover:scale-105 cursor-pointer ${
              role === 'parent'
                ? 'bg-blue hover:bg-blue-400'
                : 'bg-teal hover:bg-teal-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>
        {/* Footer Links */}
        <div className="mt-3 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-500 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
