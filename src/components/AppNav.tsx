'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/scan', label: 'Scan' },
  { href: '/profile', label: 'Profile' },
];

export function AppNav({ name, dietLabel }: { name: string; dietLabel: string }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/dashboard" className="text-lg font-bold text-brand">
          Be Healthy
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-soft text-brand-dark'
                    : 'text-ink-muted hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark sm:inline">
            {dietLabel}
          </span>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="text-sm font-semibold text-ink-muted hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center justify-around border-t border-gray-100 px-2 py-1 sm:hidden">
        {LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                active ? 'text-brand-dark' : 'text-ink-muted'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
