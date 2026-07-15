'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/features/auth/auth-store';
import { useHabitsStore } from '@/features/habits/habits-store';
import { HabitCard } from '@/features/habits/components/HabitCard';
import { HabitForm } from '@/features/habits/components/HabitForm';
import { signOut } from '@/features/auth/auth-actions';
import { calculateLevel } from '@/features/exp/exp-engine';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Habit } from '@/types/database';

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const { habits, todayCompletions, stats, setHabits, setTodayCompletions, setStats, setLoading } =
    useHabitsStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;

    const supabase = createClient();
    setLoading(true);

    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (habitsError) console.error('Failed to fetch habits:', habitsError);
      if (habitsData) setHabits(habitsData);

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      if (completionsError) console.error('Failed to fetch completions:', completionsError);
      if (completionsData) setTodayCompletions(completionsData);

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('total_exp, level')
        .eq('user_id', user.id)
        .single<{ total_exp: number; level: number }>();

      if (statsError) console.error('Failed to fetch stats:', statsError);
      if (statsData) {
        setStats({ totalExp: statsData.total_exp, level: statsData.level });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, setHabits, setTodayCompletions, setStats, setLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut();
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const levelInfo = stats ? calculateLevel(stats.totalExp) : null;
  const totalHabits = habits.length;
  const completedCount = habits.filter((h) => todayCompletions.has(h.id)).length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚔</span>
            <span className="text-sm font-bold text-white">HabitForge</span>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="hidden sm:block text-xs text-gray-500">
                {profile.display_name || profile.username}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={isLoggingOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Title & Date */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{dateStr}</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {/* Level Card */}
          <Card className="relative overflow-hidden p-4">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-amber-500/10 blur-xl" />
            <p className="text-xs text-gray-500 mb-1">Level</p>
            <p className="text-2xl font-bold text-amber-400">
              {levelInfo?.level ?? '-'}
            </p>
          </Card>

          {/* EXP Card */}
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total EXP</p>
            <p className="text-2xl font-bold text-white">
              {stats?.totalExp?.toLocaleString() ?? '-'}
            </p>
          </Card>

          {/* Completion Card */}
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Today</p>
            <p className="text-2xl font-bold text-green-400">
              {completedCount}/{totalHabits}
            </p>
          </Card>
        </div>

        {/* EXP Progress Bar */}
        {levelInfo && (
          <Card className="mb-8 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">
                Progress to Level {levelInfo.level + 1}
              </p>
              <p className="text-xs text-gray-500">
                {levelInfo.currentExp.toLocaleString()} /{' '}
                {levelInfo.expForNext.toLocaleString()} EXP
              </p>
            </div>
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, levelInfo.progress * 100)}%` }}
              />
            </div>
          </Card>
        )}

        {/* Today's Habits */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-300">
              Today&apos;s Habits
              <span className="ml-2 text-xs text-gray-600">
                ({completedCount}/{totalHabits})
              </span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {habits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center">
                <p className="text-sm text-gray-500 mb-1">No habits yet</p>
                <p className="text-xs text-gray-600">
                  Create your first habit to start earning EXP.
                </p>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={todayCompletions.has(habit.id)}
                  completionId={todayCompletions.get(habit.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Add Habit Form */}
        <HabitForm onSuccess={() => loadData()} />
      </main>
    </div>
  );
}
