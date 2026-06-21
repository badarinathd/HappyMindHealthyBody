import { createClient } from '@/lib/supabase/server';
import { rowToProfile, type ProfileRow } from '@/lib/mappers';
import {
  DIET_METHODS,
  HEALTH_GOALS,
  MEDICAL_CONDITIONS,
} from '@/constants/health';

function labelsFor<T extends { id: string; label: string }>(
  catalogue: T[],
  ids: string[],
): string[] {
  return ids
    .map((id) => catalogue.find((c) => c.id === id)?.label)
    .filter((x): x is string => Boolean(x));
}

function ageFrom(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();
  const profile = rowToProfile(data as ProfileRow);

  const goals = labelsFor(HEALTH_GOALS, profile.goals);
  const conditions = labelsFor(MEDICAL_CONDITIONS, profile.conditions);
  const diet = DIET_METHODS.find((d) => d.id === profile.dietMethod)?.label;
  const age = ageFrom(profile.dateOfBirth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
          {(profile.name || '?').charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold">{profile.name || 'Your profile'}</h1>
        <p className="text-sm text-ink-muted">{profile.email}</p>
      </div>

      <div className="card grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Gender" value={profile.gender ?? '—'} />
        <Stat label="Age" value={age != null ? String(age) : '—'} />
        <Stat
          label="Height"
          value={profile.heightCm ? `${profile.heightCm} cm` : '—'}
        />
        <Stat
          label="Weight"
          value={profile.weightKg ? `${profile.weightKg} kg` : '—'}
        />
      </div>

      <Section title="Diet method">
        <p className="font-semibold">{diet ?? 'Not set'}</p>
      </Section>

      <Section title="Goals">
        <Tags items={goals.length ? goals : ['None selected']} />
      </Section>

      <Section title="Medical conditions">
        <Tags items={conditions.length ? conditions : ['None reported']} />
      </Section>

      <form action="/auth/sign-out" method="post">
        <button type="submit" className="btn-secondary w-full">
          Sign out
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-bold capitalize">{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
