import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  analyzeFoodImage,
  isOpenAIConfigured,
  mockAnalyzeFoodImage,
} from '@/lib/openai';
import { rowToProfile, type ProfileRow } from '@/lib/mappers';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { imageDataUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  if (!body.imageDataUrl) {
    return NextResponse.json({ error: 'imageDataUrl is required' }, { status: 400 });
  }

  // Pull the user's diet + conditions server-side so feedback is trustworthy.
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const profile = data ? rowToProfile(data as ProfileRow) : null;

  const args = {
    imageUrl: body.imageDataUrl,
    dietMethod: profile?.dietMethod ?? null,
    conditions: profile?.conditions ?? [],
  };

  try {
    const analysis = isOpenAIConfigured
      ? await analyzeFoodImage(args)
      : mockAnalyzeFoodImage(args);
    return NextResponse.json({ analysis, mocked: !isOpenAIConfigured });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Analysis failed' },
      { status: 500 },
    );
  }
}
