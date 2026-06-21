import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppNav } from '@/components/AppNav';
import { rowToProfile, type ProfileRow } from '@/lib/mappers';
import { DIET_METHODS } from '@/constants/health';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  if (!profile?.onboardingCompleted) redirect('/onboarding');

  const dietLabel =
    DIET_METHODS.find((d) => d.id === profile.dietMethod)?.label ?? 'No diet';

  return (
    <div className="min-h-screen">
      <AppNav name={profile.name} dietLabel={dietLabel} />
      <main className="mx-auto max-w-5xl px-5 py-6">{children}</main>
    </div>
  );
}
