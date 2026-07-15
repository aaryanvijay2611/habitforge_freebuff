'use client';

import { createClient } from '@/lib/supabase/client';
import type { UserStats } from '@/types/database';

/**
 * Calculate total EXP needed to reach a given level.
 * Uses a quadratic curve: level 1→2 needs 200, 2→3 needs 600, etc.
 */
export function expToNextLevel(level: number): number {
  return 100 * level * (level + 1);
}

/**
 * Given total EXP, compute the current level and progress within it.
 */
export function calculateLevel(totalExp: number): {
  level: number;
  currentExp: number;
  expForNext: number;
  progress: number;
} {
  let level = 1;
  let remaining = totalExp;

  while (true) {
    const needed = expToNextLevel(level);
    if (remaining < needed) {
      return {
        level,
        currentExp: remaining,
        expForNext: needed,
        progress: remaining / needed,
      };
    }
    remaining -= needed;
    level++;
  }
}

export interface AwardExpResult {
  totalExp: number;
  level: number;
  leveledUp: boolean;
  previousLevel: number;
}

/**
 * Central EXP engine — all EXP awards must go through this.
 */
export async function awardExp(
  userId: string,
  amount: number,
  reason: string,
  referenceType?: string,
  referenceId?: string
): Promise<AwardExpResult> {
  const supabase = createClient();

  // 1. Insert the EXP transaction record
  const { error: txError } = await supabase.from('exp_transactions').insert({
    user_id: userId,
    amount,
    reason,
    reference_type: referenceType ?? null,
    reference_id: referenceId ?? null,
  });

  if (txError) throw new Error(`Failed to record EXP: ${txError.message}`);

  // 2. Fetch current stats
  const { data: stats, error: statsError } = await supabase
    .from('user_stats')
    .select('total_exp, level')
    .eq('user_id', userId)
    .single<{ total_exp: number; level: number }>();

  if (statsError || !stats)
    throw new Error(`Failed to fetch stats: ${statsError?.message ?? 'No stats found'}`);

  const previousLevel = stats.level;
  const newTotalExp = stats.total_exp + amount;

  // 3. Recalculate level
  const { level: newLevel } = calculateLevel(newTotalExp);
  const leveledUp = newLevel > previousLevel;

  // 4. Update user_stats
  const { error: updateError } = await supabase
    .from('user_stats')
    .update({ total_exp: newTotalExp, level: newLevel })
    .eq('user_id', userId);

  if (updateError) throw new Error(`Failed to update stats: ${updateError.message}`);

  return {
    totalExp: newTotalExp,
    level: newLevel,
    leveledUp,
    previousLevel,
  };
}
