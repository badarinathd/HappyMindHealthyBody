'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MEAL_TYPES, type MealType } from '@/constants/health';
import type { FoodAnalysis } from '@/types/domain';
import { NutritionCard, verdictClasses } from '@/components/NutritionCard';
import { saveLog } from '@/app/(app)/scan/actions';

function nowParts() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return {
    date: local.toISOString().slice(0, 10),
    time: local.toISOString().slice(11, 16),
  };
}

export function ScanClient() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const init = nowParts();

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [date, setDate] = useState(init.date);
  const [time, setTime] = useState(init.time);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageDataUrl) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Analysis failed');
      setAnalysis(json.analysis as FoodAnalysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setAnalyzing(false);
    }
  };

  const save = () => {
    if (!analysis) return;
    startSaving(async () => {
      const loggedAt = new Date(`${date}T${time}`).toISOString();
      const res = await saveLog({ loggedAt, mealType, analysis });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push('/tracker');
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Scan food</h1>
        <p className="text-ink-muted">
          Upload a meal photo and we’ll detect the nutrition automatically.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-verdict-avoid">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white"
      >
        {imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageDataUrl}
            alt="Meal preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-ink-faint">Click to upload a meal photo</span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <div>
        <label className="label">Meal type</label>
        <div className="grid grid-cols-4 gap-2">
          {MEAL_TYPES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMealType(m.id)}
              className={`rounded-xl border-2 py-2 text-sm font-semibold transition ${
                mealType === m.id
                  ? 'border-brand bg-brand-soft text-brand-dark'
                  : 'border-gray-200 bg-white text-ink-muted'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Time</label>
          <input
            type="time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="btn-primary w-full"
        onClick={analyze}
        disabled={!imageDataUrl || analyzing}
      >
        {analyzing ? 'Analyzing…' : 'Analyze with AI'}
      </button>

      {analysis && (
        <div className="space-y-4">
          <div className="card space-y-1">
            <h3 className="text-lg font-bold">{analysis.foodName}</h3>
            {analysis.servingEstimate && (
              <p className="text-sm font-semibold text-brand-dark">
                {analysis.servingEstimate}
              </p>
            )}
            {analysis.description && (
              <p className="text-sm text-ink-muted">{analysis.description}</p>
            )}
          </div>

          <NutritionCard nutrition={analysis.nutrition} />

          {analysis.feedback && (
            <div className="card space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    verdictClasses[analysis.feedback.verdict]
                  }`}
                />
                <h3 className="font-bold capitalize">
                  Diet feedback ({analysis.feedback.verdict})
                </h3>
              </div>
              <p className="text-sm">{analysis.feedback.summary}</p>
              <ul className="space-y-1">
                {analysis.feedback.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-muted">
                    <span className="text-brand">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="btn-primary w-full"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save to tracker'}
          </button>
        </div>
      )}
    </div>
  );
}
