'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    headers().get('origin') ??
    'http://localhost:3000'
  );
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }
  redirect('/');
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }
  if (data.session) {
    redirect('/');
  }
  redirect('/sign-in?message=Check your email to confirm your account.');
}

export async function signInWithProvider(formData: FormData) {
  const provider = String(formData.get('provider') ?? 'google') as
    | 'google'
    | 'apple';
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error || !data.url) {
    redirect(`/sign-in?error=${encodeURIComponent(error?.message ?? 'OAuth failed')}`);
  }
  redirect(data.url);
}
