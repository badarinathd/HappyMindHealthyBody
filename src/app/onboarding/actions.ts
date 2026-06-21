'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  DietMethodId,
  Gender,
  HealthGoalId,
  MedicalConditionId,
} from '@/constants/health';

export type OnboardingPayload = {
  name: string;
  phone: string;
  gender: Gender | null;
  dateOfBirth: string | null;
  heightCm: string;
  weightKg: string;
  goals: HealthGoalId[];
  conditions: MedicalConditionId[];
  dietMethod: DietMethodId | null;
};

export async function saveOnboarding(payload: OnboardingPayload) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { error } = await supabase
    .from('profiles')
    .update({
      email: user.email,
      name: payload.name.trim(),
      phone: payload.phone.trim() || null,
      gender: payload.gender,
      date_of_birth: payload.dateOfBirth,
      height_cm: payload.heightCm ? Number(payload.heightCm) : null,
      weight_kg: payload.weightKg ? Number(payload.weightKg) : null,
      goals: payload.goals,
      conditions: payload.conditions,
      diet_method: payload.dietMethod,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }
  redirect('/dashboard');
}
