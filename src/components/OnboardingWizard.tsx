'use client';

import { useState, useTransition } from 'react';
import {
  DIET_METHODS,
  GENDERS,
  HEALTH_GOALS,
  MEDICAL_CONDITIONS,
  type DietMethodId,
  type Gender,
  type HealthGoalId,
  type MedicalConditionId,
} from '@/constants/health';
import { saveOnboarding, type OnboardingPayload } from '@/app/onboarding/actions';

const TOTAL = 4;

export function OnboardingWizard({
  defaults,
}: {
  defaults: Partial<OnboardingPayload>;
}) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(defaults.name ?? '');
  const [phone, setPhone] = useState(defaults.phone ?? '');
  const [gender, setGender] = useState<Gender | null>(defaults.gender ?? null);
  const [dob, setDob] = useState(defaults.dateOfBirth ?? '');
  const [height, setHeight] = useState(defaults.heightCm ?? '');
  const [weight, setWeight] = useState(defaults.weightKg ?? '');
  const [goals, setGoals] = useState<HealthGoalId[]>(defaults.goals ?? []);
  const [conditions, setConditions] = useState<MedicalConditionId[]>(
    defaults.conditions ?? [],
  );
  const [diet, setDiet] = useState<DietMethodId | null>(
    defaults.dietMethod ?? null,
  );

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const next = () => {
    setError(null);
    if (step === 1 && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (step === 2 && goals.length === 0) {
      setError('Select at least one goal.');
      return;
    }
    if (step === 4 && !diet) {
      setError('Pick a diet method.');
      return;
    }
    if (step < TOTAL) {
      setStep(step + 1);
      return;
    }
    submit();
  };

  const submit = () => {
    startTransition(async () => {
      const res = await saveOnboarding({
        name,
        phone,
        gender,
        dateOfBirth: dob || null,
        heightCm: height,
        weightKg: weight,
        goals,
        conditions,
        dietMethod: diet,
      });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex gap-1">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < step ? 'bg-brand' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <h1 className="text-2xl font-bold">{STEP_TITLES[step - 1]}</h1>
        <p className="text-ink-muted">{STEP_SUBTITLES[step - 1]}</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-verdict-avoid">
          {error}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
          <div>
            <label className="label">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <Chip
                  key={g.id}
                  label={g.label}
                  selected={gender === g.id}
                  onClick={() => setGender(g.id)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Date of birth</label>
              <input
                type="date"
                className="input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input
                type="number"
                className="input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
              />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                className="input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="65"
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HEALTH_GOALS.map((g) => (
            <Chip
              key={g.id}
              label={g.label}
              selected={goals.includes(g.id)}
              onClick={() => setGoals((l) => toggle(l, g.id))}
            />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-2">
          {MEDICAL_CONDITIONS.map((c) => {
            const on = conditions.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setConditions((l) => toggle(l, c.id))}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left"
              >
                <span className="font-medium">{c.label}</span>
                <span
                  className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${
                    on ? 'bg-brand' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white transition ${
                      on ? 'translate-x-5' : ''
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-2">
          {DIET_METHODS.map((d) => (
            <Chip
              key={d.id}
              label={d.label}
              description={d.description}
              selected={diet === d.id}
              onClick={() => setDiet(d.id)}
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => setStep(step - 1)}
            disabled={pending}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={next}
          disabled={pending}
        >
          {step < TOTAL ? 'Continue' : pending ? 'Saving…' : 'Finish setup'}
        </button>
      </div>
    </div>
  );
}

const STEP_TITLES = [
  'About you',
  'Your health goals',
  'Medical conditions',
  'Choose your method',
];
const STEP_SUBTITLES = [
  'This helps us personalize your plan.',
  'Choose all that apply.',
  'Toggle any that apply — this tailors your feedback.',
  'Your Lifestyle Modification Diet. Pick one.',
];

function Chip({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition ${
        selected
          ? 'border-brand bg-brand-soft'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span>
        <span
          className={`block font-semibold ${
            selected ? 'text-brand-dark' : 'text-ink'
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="block text-sm text-ink-muted">{description}</span>
        )}
      </span>
      <span
        className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand' : 'border-gray-300'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
    </button>
  );
}
