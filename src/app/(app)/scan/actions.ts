'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { FoodAnalysis } from '@/types/domain';
import type { MealType } from '@/constants/health';

export type SaveLogInput = {
  loggedAt: string; // ISO
  mealType: MealType;
  analysis: FoodAnalysis;
};

export async function saveLog(input: SaveLogInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const n = input.analysis.nutrition;
  const { error } = await supabase.from('food_logs').insert({
    user_id: user.id,
    logged_at: input.loggedAt,
    meal_type: input.mealType,
    food_name: input.analysis.foodName,
    description: input.analysis.description ?? null,
    serving_estimate: input.analysis.servingEstimate ?? null,
    confidence: input.analysis.confidence ?? null,
    calories: n.calories,
    protein: n.protein,
    carbs: n.carbs,
    fats: n.fats,
    fiber: n.fiber,
    glycemic_index: n.glycemicIndex,
    glycemic_load: n.glycemicLoad,
    vitamins: n.vitamins,
    minerals: n.minerals,
    feedback: input.analysis.feedback ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath('/tracker');
  revalidatePath('/dashboard');
  return { ok: true };
}
