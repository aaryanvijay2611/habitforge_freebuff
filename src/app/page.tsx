'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsChecking(false);
    });
  }, []);

  function handleGetStarted() {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔</span>
            <span className="text-lg font-bold text-white">HabitForge</span>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-400">
            ✦ Cultivation RPG — Beta
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Turn Your Life Into
            <br />
            <span className="text-gradient">an RPG</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-400 leading-relaxed">
            Forge your reality. Complete real-life habits, earn EXP,
            <br className="hidden sm:block" />
            level up like a cultivation protagonist.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
            >
              Start Your Journey
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            {!isLoggedIn && (
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  I Have an Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 mt-20 grid w-full max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
          {[
            { value: 'Complete', label: 'Habits' },
            { value: 'Earn', label: 'EXP' },
            { value: 'Level', label: 'Up' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-bold text-amber-400">{stat.value}</div>
              <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-600">
          HabitForge — Forge Your Reality
        </div>
      </footer>
    </div>
  );
}
