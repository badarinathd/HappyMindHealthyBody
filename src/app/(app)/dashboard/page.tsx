import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { rowToEntry, rowToProfile, type FoodLogRow, type ProfileRow } from '@/lib/mappers';
import { isSameDay, sumNutrition } from '@/lib/format';
import { DIET_METHODS } from '@/constants/health';

const GOAL_CALORIES = 2000;

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profileRow }, { data: logRows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user!.id)
      .order('logged_at', { ascending: false })
      .limit(100),
  ]);

  const profile = rowToProfile(profileRow as ProfileRow);
  const entries = ((logRows ?? []) as FoodLogRow[]).map(rowToEntry);
  const now = new Date();
  const todays = entries.filter((e) => isSameDay(new Date(e.loggedAt), now));
  const totals = sumNutrition(todays);
  const remaining = Math.max(0, GOAL_CALORIES - Math.round(totals.calories));
  const pct = Math.min(100, (totals.calories / GOAL_CALORIES) * 100);
  const dietLabel = DIET_METHODS.find((d) => d.id === profile.dietMethod)?.label;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-ink-muted">Hello,</p>
          <h1 className="text-2xl font-bold">{profile.name || 'there'} 👋</h1>
        </div>
        {dietLabel && (
          <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark">
            {dietLabel}
          </span>
        )}
      </div>

      <div className="card space-y-3">
        <p className="text-sm text-ink-muted">Calories today</p>
        <p className="text-3xl font-bold">
          {Math.round(totals.calories)}
          <span className="text-base font-normal text-ink-muted">
            {' '}
            / {GOAL_CALORIES} kcal
          </span>
        </p>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#F7F9FC]">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm text-ink-muted">{remaining} kcal remaining</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Macro label="Protein" value={totals.protein} />
        <Macro label="Carbs" value={totals.carbs} />
        <Macro label="Fats" value={totals.fats} />
        <Macro label="Fiber" value={totals.fiber} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/scan" className="btn-primary flex-1">
          Scan a meal
        </Link>
        <Link href="/tracker" className="btn-secondary flex-1">
          View tracker
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Recent meals</h2>
        {todays.length === 0 ? (
          <p className="card text-ink-muted">
            No meals logged today yet. Scan your first meal to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {todays.slice(0, 5).map((e) => (
              <div
                key={e.id}
                className="card flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-semibold">{e.analysis.foodName}</p>
                  <p className="text-sm text-ink-muted capitalize">
                    {e.mealType}
                  </p>
                </div>
                <p className="font-semibold">
                  {Math.round(e.analysis.nutrition.calories)} kcal
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Macro({ label, value }: { label: string; value: number }) {
  return (
    <div className="card py-4 text-center">
      <p className="text-lg font-bold">{Math.round(value)}g</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
