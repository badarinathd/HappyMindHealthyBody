import type {
  DietMethodId,
  Gender,
  HealthGoalId,
  MealType,
  MedicalConditionId,
} from '@/constants/health';

export type UserProfile = {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  gender: Gender | null;
  dateOfBirth: string | null; // ISO date (YYYY-MM-DD)
  heightCm: number | null;
  weightKg: number | null;
  goals: HealthGoalId[];
  conditions: MedicalConditionId[];
  dietMethod: DietMethodId | null;
  onboardingCompleted: boolean;
  createdAt?: string;
};

/** Per-100g or per-serving nutrition metrics returned by the AI vision scan. */
export type Nutrition = {
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  fiber: number; // g
  glycemicIndex: number | null; // GI, 0-100
  glycemicLoad: number | null; // GL
  vitamins: string[]; // e.g. ["Vitamin C", "Vitamin A"]
  minerals: string[]; // e.g. ["Iron", "Magnesium"]
};

export type FoodAnalysis = {
  foodName: string;
  description?: string;
  servingEstimate?: string; // e.g. "1 bowl (~250g)"
  confidence?: number; // 0-1
  nutrition: Nutrition;
  /** Diet-aware feedback tailored to the user's Lifestyle Modification Diet. */
  feedback?: DietFeedback;
};

export type FeedbackVerdict = 'good' | 'moderate' | 'avoid';

export type DietFeedback = {
  verdict: FeedbackVerdict;
  summary: string;
  tips: string[];
};

export type FoodLogEntry = {
  id: string;
  userId: string;
  loggedAt: string; // ISO datetime chosen by user
  mealType: MealType;
  imageUri?: string | null;
  analysis: FoodAnalysis;
};

export type EmptyNutrition = Nutrition;

export const EMPTY_NUTRITION: Nutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  glycemicIndex: null,
  glycemicLoad: null,
  vitamins: [],
  minerals: [],
};
