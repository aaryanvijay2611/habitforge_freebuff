'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useHabitsStore } from '@/features/habits/habits-store';
import { awardExp } from '@/features/exp/exp-engine';
import { deleteHabit } from '@/features/habits/habits-actions';
import { Card } from '@/components/ui/Card';
import type { Habit, HabitCompletion } from '@/types/database';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  completionId?: string;
}

export function HabitCard({ habit, isCompleted, completionId }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { addCompletion, setStats } = useHabitsStore();

  const supabase = createClient();

  async function handleComplete() {
    if (isCompleting || isCompleted) return;
    setIsCompleting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Insert completion
      const { data: completion, error: completionError } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habit.id,
          user_id: user.id,
          completed_date: new Date().toISOString().split('T')[0],
          exp_earned: habit.exp_reward,
        })
        .select()
        .single();

      if (completionError) throw new Error(completionError.message);

      // Award EXP through the central engine
      const result = await awardExp(
        user.id,
        habit.exp_reward,
        `Completed habit: ${habit.name}`,
        'habit_completion',
        completion.id
      );

      addCompletion(completion as HabitCompletion);

      // Update stats in store
      setStats({ totalExp: result.totalExp, level: result.level });

      if (result.leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    } catch (err) {
      console.error('Failed to complete habit:', err);
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    await deleteHabit(habit.id);
    useHabitsStore.getState().removeHabit(habit.id);
    setIsDeleting(false);
  }

  return (
    <div className="relative">
      {showLevelUp && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap">
            ⬆ LEVEL UP!
          </div>
        </div>
      )}
      <Card hover className={isCompleted ? 'border-green-800/50 bg-green-950/20' : ''}>
        <div className="flex items-center gap-3">
          {/* Complete button / checkbox */}
          <button
            onClick={handleComplete}
            disabled={isCompleted || isCompleting}
            className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg transition-all duration-200 ${
              isCompleted
                ? 'border-green-500 bg-green-500/20 text-green-400'
                : 'border-gray-700 hover:border-amber-500/50 hover:bg-amber-500/10 text-gray-600'
            } ${isCompleting ? 'animate-pulse' : ''}`}
          >
            {isCompleted ? '✓' : habit.emoji}
          </button>

          {/* Habit info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-medium truncate ${
                isCompleted ? 'text-gray-500 line-through' : 'text-gray-100'
              }`}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {habit.description}
              </p>
            )}
          </div>

          {/* EXP badge */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                isCompleted
                  ? 'text-green-500 bg-green-500/10'
                  : 'text-amber-400 bg-amber-500/10'
              }`}
            >
              +{habit.exp_reward} EXP
            </span>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-600 hover:text-red-400 transition-colors p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
