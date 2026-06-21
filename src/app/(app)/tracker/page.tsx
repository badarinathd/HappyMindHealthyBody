import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { rowToEntry, type FoodLogRow } from '@/lib/mappers';
import { formatDateLabel, formatTime } from '@/lib/format';
import { MEAL_TYPES } from '@/constants/health';
import type { FoodLogEntry } from '@/types/domain';
import { deleteLog } from './actions';

export default async function TrackerPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', user!.id)
    .order('logged_at', { ascending: false });

  const entries = ((rows ?? []) as FoodLogRow[]).map(rowToEntry);

  const groups = new Map<string, FoodLogEntry[]>();
  for (const e of entries) {
    const key = formatDateLabel(e.loggedAt);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Food tracker</h1>
        <Link href="/scan" className="btn-primary">
          + Scan meal
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="card text-ink-muted">
          No meals logged yet. Tap “Scan meal” to add your first one.
        </p>
      ) : (
        Array.from(groups.entries()).map(([day, items]) => (
          <section key={day} className="space-y-2">
            <h2 className="text-sm font-semibold text-ink-muted">{day}</h2>
            {items.map((e) => (
              <MealRow key={e.id} entry={e} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}

function MealRow({ entry }: { entry: FoodLogEntry }) {
  const n = entry.analysis.nutrition;
  const mealLabel =
    MEAL_TYPES.find((m) => m.id === entry.mealType)?.label ?? entry.mealType;
  return (
    <div className="card flex items-center gap-4 py-3">
      {entry.imageUri ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.imageUri}
          alt={entry.analysis.foodName}
          className="h-14 w-14 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F7F9FC] text-ink-faint">
          🍽️
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{entry.analysis.foodName}</p>
        <p className="text-xs text-ink-muted">
          {mealLabel} · {formatTime(entry.loggedAt)}
        </p>
        <p className="text-xs text-ink-faint">
          {Math.round(n.calories)} kcal · {Math.round(n.protein)}P ·{' '}
          {Math.round(n.carbs)}C · {Math.round(n.fats)}F
        </p>
      </div>
      <form action={deleteLog}>
        <input type="hidden" name="id" value={entry.id} />
        <button
          type="submit"
          className="text-sm text-ink-faint hover:text-verdict-avoid"
          aria-label="Delete entry"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
