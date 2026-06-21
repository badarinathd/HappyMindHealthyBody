import type {
  DietMethodId,
  Gender,
  HealthGoalId,
  MealType,
  MedicalConditionId,
} from '@/constants/health';
import type { FoodAnalysis, FoodLogEntry, UserProfile } from '@/types/domain';

export type ProfileRow = {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goals: HealthGoalId[] | null;
  conditions: MedicalConditionId[] | null;
  diet_method: DietMethodId | null;
  onboarding_completed: boolean;
  created_at?: string;
};

export function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    goals: row.goals ?? [],
    conditions: row.conditions ?? [],
    dietMethod: row.diet_method,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
  };
}

export type FoodLogRow = {
  id: string;
  user_id: string;
  logged_at: string;
  meal_type: MealType;
  image_path: string | null;
  food_name: string;
  description: string | null;
  serving_estimate: string | null;
  confidence: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  glycemic_index: number | null;
  glycemic_load: number | null;
  vitamins: string[] | null;
  minerals: string[] | null;
  feedback: FoodAnalysis['feedback'] | null;
};

export function rowToEntry(row: FoodLogRow): FoodLogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    loggedAt: row.logged_at,
    mealType: row.meal_type,
    imageUri: row.image_path,
    analysis: {
      foodName: row.food_name,
      description: row.description ?? undefined,
      servingEstimate: row.serving_estimate ?? undefined,
      confidence: row.confidence ?? undefined,
      nutrition: {
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fats: row.fats,
        fiber: row.fiber,
        glycemicIndex: row.glycemic_index,
        glycemicLoad: row.glycemic_load,
        vitamins: row.vitamins ?? [],
        minerals: row.minerals ?? [],
      },
      feedback: row.feedback ?? undefined,
    },
  };
}
