'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function deleteLog(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = createClient();
  await supabase.from('food_logs').delete().eq('id', id);
  revalidatePath('/tracker');
  revalidatePath('/dashboard');
}
