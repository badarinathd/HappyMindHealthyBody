import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { rowToProfile, type ProfileRow } from '@/lib/mappers';

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = data ? rowToProfile(data as ProfileRow) : null;
  if (profile?.onboardingCompleted) redirect('/dashboard');

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <OnboardingWizard
        defaults={{
          name: profile?.name ?? '',
          phone: profile?.phone ?? '',
          gender: profile?.gender ?? null,
          dateOfBirth: profile?.dateOfBirth ?? null,
          heightCm: profile?.heightCm ? String(profile.heightCm) : '',
          weightKg: profile?.weightKg ? String(profile.weightKg) : '',
          goals: profile?.goals ?? [],
          conditions: profile?.conditions ?? [],
          dietMethod: profile?.dietMethod ?? null,
        }}
      />
    </main>
  );
}
