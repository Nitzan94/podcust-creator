'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/lib/mock-data';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl">🥗</div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Nutrition Track
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-green-600"
          >
            לוח בקרה
          </Link>
          <Link
            href="/meals"
            className="text-sm font-medium transition-colors hover:text-green-600"
          >
            ארוחות
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium transition-colors hover:text-green-600"
          >
            מתכונים
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium transition-colors hover:text-green-600"
          >
            פרופיל
          </Link>
        </nav>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm text-right">
            <div className="font-medium">{mockUser.name}</div>
            <div className="text-xs text-zinc-500">{mockUser.email}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-semibold">
            {mockUser.name.charAt(0)}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
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
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/dashboard"
              className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              לוח בקרה
            </Link>
            <Link
              href="/meals"
              className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ארוחות
            </Link>
            <Link
              href="/recipes"
              className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              מתכונים
            </Link>
            <Link
              href="/profile"
              className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              פרופיל
            </Link>
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-sm font-medium">{mockUser.name}</div>
              <div className="text-xs text-zinc-500">{mockUser.email}</div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
