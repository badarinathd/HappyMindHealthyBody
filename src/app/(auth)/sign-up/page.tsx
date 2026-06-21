import Link from 'next/link';
import { signUp } from '@/app/(auth)/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { OAuthButtons } from '@/components/OAuthButtons';

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-ink-muted">Start your personalized wellness journey.</p>
      </div>

      {searchParams.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-verdict-avoid">
          {searchParams.error}
        </p>
      )}

      <form action={signUp} className="space-y-4">
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
            autoComplete="new-password"
            required
            minLength={6}
            className="input"
            placeholder="At least 6 characters"
          />
        </div>
        <SubmitButton className="w-full" pendingLabel="Creating account…">
          Sign Up
        </SubmitButton>
      </form>

      <OAuthButtons />

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-brand">
          Sign in
        </Link>
      </p>
    </div>
  );
}
