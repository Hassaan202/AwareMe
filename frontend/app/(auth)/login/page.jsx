"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  // For Routing 
  const router = useRouter();
  //  For collecting form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  // store values at it changed 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //  When the form is Submittede
  const handleSubmit = (e) => {
    e.preventDefault()
    // backend Logic 
    console.log('Confirm User Data', { ...formData })
  }
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
              placeholder="Create a password"
            />
          </div>
           {/* Submit Button */}
           <button
            type="submit"
            className={'w-full py-4 rounded-xl font-bold text-primary-500 shadow-lg transition-all hover:scale-105 bg-teal hover:bg-teal-500'}
          >
            Login 🚀
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
