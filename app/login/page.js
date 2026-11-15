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
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-outline/20 bg-surface p-6 shadow-md">
        <h1 className="text-xl font-semibold text-on-surface mb-2">Login</h1>
        <p className="text-sm text-on-surface-variant mb-6">Enter your username and password to continue.</p>

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
              className="w-full rounded-md border border-outline/30 bg-background px-3 py-2 text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full rounded-md border border-outline/30 bg-background px-3 py-2 text-on-surface outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
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
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
