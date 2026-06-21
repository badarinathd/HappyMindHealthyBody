import Link from 'next/link';
import { signIn } from '@/app/(auth)/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { OAuthButtons } from '@/components/OAuthButtons';

export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-brand">Be Healthy</h1>
        <p className="text-ink-muted">Welcome back. Let’s keep you on track.</p>
      </div>

      {searchParams.message && (
        <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
          {searchParams.message}
        </p>
      )}
      {searchParams.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-verdict-avoid">
          {searchParams.error}
        </p>
      )}

      <form action={signIn} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input"
            placeholder="••••••••"
          />
        </div>
        <SubmitButton className="w-full" pendingLabel="Signing in…">
          Sign In
        </SubmitButton>
      </form>

      <OAuthButtons />

      <p className="text-center text-sm text-ink-muted">
        Don’t have an account?{' '}
        <Link href="/sign-up" className="font-semibold text-brand">
          Sign up
        </Link>
      </p>
    </div>
  );
}
