import type { FeedbackVerdict, Nutrition } from '@/types/domain';

const MACROS: { key: keyof Nutrition; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fats', label: 'Fats', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
];

export const verdictClasses: Record<FeedbackVerdict, string> = {
  good: 'bg-verdict-good',
  moderate: 'bg-verdict-moderate',
  avoid: 'bg-verdict-avoid',
};

export function NutritionCard({ nutrition }: { nutrition: Nutrition }) {
  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-bold">Nutrition</h3>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {MACROS.map((m) => (
          <div key={m.key} className="rounded-xl bg-[#F7F9FC] p-3">
            <div className="text-lg font-bold">
              {Math.round(Number(nutrition[m.key] ?? 0))}
              <span className="ml-1 text-xs font-normal text-ink-muted">
                {m.unit}
              </span>
            </div>
            <div className="text-sm text-ink-muted">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Pill label="Glycemic Index" value={nutrition.glycemicIndex} />
        <Pill label="Glycemic Load" value={nutrition.glycemicLoad} />
      </div>

      {nutrition.vitamins.length > 0 && (
        <TagSection title="Vitamins" tags={nutrition.vitamins} />
      )}
      {nutrition.minerals.length > 0 && (
        <TagSection title="Minerals" tags={nutrition.minerals} />
      )}
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-[#F7F9FC] p-3">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="text-lg font-bold">
        {value == null ? '—' : Math.round(value)}
      </span>
    </div>
  );
}

function TagSection({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-ink-muted">{title}</div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
