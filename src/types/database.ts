export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  emoji: string;
  exp_reward: number;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  exp_earned: number;
  created_at: string;
}

export interface ExpTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_exp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Habit, 'id' | 'user_id' | 'created_at'>>;
      };
      habit_completions: {
        Row: HabitCompletion;
        Insert: Omit<HabitCompletion, 'id' | 'created_at'>;
        Update: Partial<Omit<HabitCompletion, 'id' | 'created_at'>>;
      };
      exp_transactions: {
        Row: ExpTransaction;
        Insert: Omit<ExpTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<ExpTransaction, 'id' | 'created_at'>>;
      };
      user_stats: {
        Row: UserStats;
        Insert: Omit<UserStats, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserStats, 'id' | 'user_id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
