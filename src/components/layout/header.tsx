'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUser } from '@/lib/mock-data';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-3xl transform group-hover:scale-110 transition-transform">🥗</div>
          <span className="font-serif text-2xl font-bold text-emerald">
            Nutrition Track
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-base font-medium transition-all hover:text-emerald relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-emerald after:transition-all hover:after:w-full"
          >
            לוח בקרה
          </Link>
          <Link
            href="/meals"
            className="text-base font-medium transition-all hover:text-emerald relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-emerald after:transition-all hover:after:w-full"
          >
            ארוחות
          </Link>
          <Link
            href="/recipes"
            className="text-base font-medium transition-all hover:text-emerald relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-emerald after:transition-all hover:after:w-full"
          >
            מתכונים
          </Link>
          <Link
            href="/profile"
            className="text-base font-medium transition-all hover:text-emerald relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-emerald after:transition-all hover:after:w-full"
          >
            פרופיל
          </Link>
        </nav>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm text-right">
            <div className="font-bold">{mockUser.name}</div>
            <div className="text-xs text-foreground/50">{mockUser.email}</div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {mockUser.name.charAt(0)}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-emerald/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="תפריט"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-6 space-y-2">
            <Link
              href="/dashboard"
              className="p-4 rounded-2xl hover:bg-emerald/10 transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              לוח בקרה
            </Link>
            <Link
              href="/meals"
              className="p-4 rounded-2xl hover:bg-emerald/10 transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              ארוחות
            </Link>
            <Link
              href="/recipes"
              className="p-4 rounded-2xl hover:bg-emerald/10 transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              מתכונים
            </Link>
            <Link
              href="/profile"
              className="p-4 rounded-2xl hover:bg-emerald/10 transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              פרופיל
            </Link>
            <div className="pt-4 mt-2 border-t border-foreground/10">
              <div className="text-sm font-bold">{mockUser.name}</div>
              <div className="text-xs text-foreground/50">{mockUser.email}</div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
