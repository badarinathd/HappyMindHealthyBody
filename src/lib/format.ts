import type { FoodLogEntry, Nutrition } from '@/types/domain';
import { EMPTY_NUTRITION } from '@/types/domain';

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function sumNutrition(entries: FoodLogEntry[]): Nutrition {
  return entries.reduce<Nutrition>(
    (acc, e) => {
      const n = e.analysis.nutrition;
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fats: acc.fats + n.fats,
        fiber: acc.fiber + n.fiber,
        glycemicIndex: null,
        glycemicLoad: (acc.glycemicLoad ?? 0) + (n.glycemicLoad ?? 0) || null,
        vitamins: [],
        minerals: [],
      };
    },
    { ...EMPTY_NUTRITION },
  );
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function toDateInput(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function toTimeInput(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toTimeString().slice(0, 5);
}

export function combineDateTime(dateStr: string, timeStr: string): string {
  const [y, m, day] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1, h ?? 0, min ?? 0).toISOString();
}
