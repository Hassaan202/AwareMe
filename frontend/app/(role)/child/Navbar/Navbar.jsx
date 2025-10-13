'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ChildNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/child/chat', label: 'Chat Friend', icon: '💬' },
    { href: '/child/learn', label: 'Learn', icon: '📚' },
    { href: '/child/games', label: 'Games', icon: '🎮' },
    { href: '/child/rewards', label: 'Rewards', icon: '⭐' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-teal shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-15">
          {/* Logo/Brand */}
          <Link href="/child/" className="flex items-center space-x-3 group">
            <div className="bg-white rounded-full p-2 shadow-lg group-hover:scale-110 transition-all">
              <span className="text-3xl">🛡️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-2xl">Aware Me</h1>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={'flex items-center space-x-2 px-5 py-3 rounded-2xl font-semibold transition-all text-white hover:translate-x-0.5'}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-lg">{link.label}</span>
              </Link>
            ))}
          </div>

          

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-white text-primary-600 p-3 rounded-xl shadow-lg"
          >
            <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-5 py-4 rounded-2xl font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-primary-400 text-white'
                }`}
              >
                <span className="text-3xl">{link.icon}</span>
                <span className="text-lg">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div> 
    </nav>
  );
}