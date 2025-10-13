'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ParentNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue text-white shadow-md">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <Link href="/parent" className="flex items-center space-x-2">
          <span className="text-3xl">👨‍👩‍👧</span>
          <h1 className="text-2xl font-bold tracking-wide">Parent Dashboard</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link href="/parent/dashborad" className="hover:text-blue-200 transition">🏠 Dashboard</Link>
          <Link href="/parent/child-progress" className="hover:text-blue-200 transition">📊 Child Progress</Link>
          <Link href="/parent/chat" className="hover:text-blue-200 transition">💬 Chat</Link>
          <Link href="/parent/resources" className="hover:text-blue-200 transition">📘 Resources</Link>
        </div>

        {/* Profile + Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-blue-300 px-3 py-2 rounded-full cursor-pointer hover:bg-blue-500 transition">
            <span className="text-sm">Hello, Parent</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold">P</div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue text-white px-6 py-4 space-y-3 font-medium">
          <Link href="/parent" className="block hover:text-blue-200 transition">🏠 Dashboard</Link>
          <Link href="/parent/child-progress" className="block hover:text-blue-200 transition">📊 Child Progress</Link>
          <Link href="/parent/chat" className="block hover:text-blue-200 transition">💬 Chat</Link>
          <Link href="/parent/resources" className="block hover:text-blue-200 transition">📘 Resources</Link>
          <hr className="border-blue-400" />
          <button className="w-full text-left bg-blue hover:bg-blue-300 px-4 py-2 rounded-lg transition">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}
