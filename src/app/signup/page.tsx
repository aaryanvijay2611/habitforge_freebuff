'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[400px] rounded-full bg-green-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-sm text-center">
          <div className="mb-4 text-5xl">⚔</div>
          <h1 className="mb-2 text-xl font-bold text-white">Check your email</h1>
          <p className="mb-6 text-sm text-gray-400 leading-relaxed">
            We&apos;ve sent a confirmation link to your email.
            <br />
            Click it to activate your account.
          </p>
          <Link href="/login">
            <Button variant="secondary">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="text-2xl">⚔</span>
          <span className="text-lg font-bold text-white">HabitForge</span>
        </Link>

        <Card className="p-6">
          <h1 className="mb-1 text-xl font-bold text-white">Begin your journey</h1>
          <p className="mb-6 text-sm text-gray-500">Create your account to start cultivating.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              minLength={6}
            />

            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
