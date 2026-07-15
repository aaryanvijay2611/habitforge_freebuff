'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createHabit(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const emoji = formData.get('emoji') as string || '📝';
  const expReward = parseInt(formData.get('exp_reward') as string) || 50;

  if (!name || name.trim().length === 0) {
    return { error: 'Habit name is required.' };
  }

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name.trim(),
    description: description.trim() || null,
    emoji,
    exp_reward: Math.max(10, expReward),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteHabit(habitId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('habits').delete().eq('id', habitId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
