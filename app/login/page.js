'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Login failed.');
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError('Unexpected error while logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] sm:min-h-screen w-full flex items-start sm:items-center justify-center bg-background px-0 sm:px-4 pt-[max(env(safe-area-inset-top),0px)] pb-[max(env(safe-area-inset-bottom),0px)]">
      <div className="w-full min-h-[100dvh] sm:min-h-0 sm:max-w-sm rounded-none sm:rounded-xl border-0 sm:border border-outline/20 bg-surface p-4 sm:p-6 shadow-none sm:shadow-md">
        <h1 className="text-lg sm:text-xl font-semibold text-on-surface mb-2">Login</h1>
        <p className="text-sm text-on-surface-variant mb-5 sm:mb-6">
          Enter your username and password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-on-surface mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-md border border-outline/30 bg-background px-3 py-3 sm:py-2 text-base sm:text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-on-surface mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-outline/30 bg-background px-3 py-3 sm:py-2 text-base sm:text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-500 break-words">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 sm:py-2 text-white text-base sm:text-sm disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] sm:min-h-screen p-4 text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
