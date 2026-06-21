import { signInWithProvider } from '@/app/(auth)/actions';

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-ink-faint">or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form action={signInWithProvider}>
        <input type="hidden" name="provider" value="google" />
        <button type="submit" className="btn-secondary w-full">
          Continue with Google
        </button>
      </form>

      <form action={signInWithProvider}>
        <input type="hidden" name="provider" value="apple" />
        <button type="submit" className="btn-secondary w-full">
          Continue with Apple
        </button>
      </form>
    </div>
  );
}
