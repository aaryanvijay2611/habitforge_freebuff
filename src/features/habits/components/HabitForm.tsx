'use client';

import { useState } from 'react';
import { createHabit } from '@/features/habits/habits-actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface HabitFormProps {
  onSuccess?: () => void;
}

const EMOJI_OPTIONS = ['📝', '💪', '📖', '🏃', '🧘', '🎯', '✍️', '🧠', '🎨', '🎵', '🌱', '🔥'];

export function HabitForm({ onSuccess }: HabitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('📝');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('emoji', selectedEmoji);

    const result = await createHabit(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Reset form
    (e.target as HTMLFormElement).reset();
    setSelectedEmoji('📝');
    setIsOpen(false);
    setIsSubmitting(false);
    onSuccess?.();
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-gray-800 p-4 text-gray-500 hover:border-gray-700 hover:text-gray-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add New Habit
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-200">New Habit</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Emoji picker */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-amber-500/20 border border-amber-500 scale-110'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="name"
          name="name"
          label="Habit Name"
          placeholder="e.g. Morning Run"
          required
          maxLength={100}
        />

        <Input
          id="description"
          name="description"
          label="Description (optional)"
          placeholder="What does this habit involve?"
          maxLength={300}
        />

        <div>
          <label htmlFor="exp_reward" className="block text-xs text-gray-500 mb-1.5">
            EXP per completion
          </label>
          <input
            id="exp_reward"
            name="exp_reward"
            type="number"
            min={10}
            max={1000}
            defaultValue={50}
            className="block w-24 rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" isLoading={isSubmitting} size="sm">
            Create Habit
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
