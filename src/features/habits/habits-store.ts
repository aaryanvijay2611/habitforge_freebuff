'use client';

import { create } from 'zustand';
import type { Habit, HabitCompletion } from '@/types/database';

interface HabitsState {
  habits: Habit[];
  todayCompletions: Map<string, string>; // habit_id -> completion_id
  stats: {
    totalExp: number;
    level: number;
  } | null;
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  setTodayCompletions: (completions: HabitCompletion[]) => void;
  setStats: (stats: { totalExp: number; level: number } | null) => void;
  setLoading: (loading: boolean) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (habitId: string) => void;
  addCompletion: (completion: HabitCompletion) => void;
  removeCompletion: (completionId: string) => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  todayCompletions: new Map(),
  stats: null,
  isLoading: true,
  setHabits: (habits) => set({ habits }),
  setTodayCompletions: (completions) => {
    const map = new Map<string, string>();
    completions.forEach((c) => map.set(c.habit_id, c.id));
    set({ todayCompletions: map });
  },
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  removeHabit: (habitId) =>
    set((state) => ({ habits: state.habits.filter((h) => h.id !== habitId) })),
  addCompletion: (completion) =>
    set((state) => {
      const map = new Map(state.todayCompletions);
      map.set(completion.habit_id, completion.id);
      return { todayCompletions: map };
    }),
  removeCompletion: (completionId) =>
    set((state) => {
      const map = new Map(state.todayCompletions);
      for (const [habitId, id] of map) {
        if (id === completionId) {
          map.delete(habitId);
          break;
        }
      }
      return { todayCompletions: map };
    }),
}));
