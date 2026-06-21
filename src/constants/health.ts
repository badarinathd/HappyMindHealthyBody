/**
 * Domain catalogues for Be Healthy onboarding & personalization.
 * These IDs are the source of truth and should match the values stored in
 * Supabase (see supabase/schema.sql).
 */

export type Option<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
};

// ---------------------------------------------------------------------------
// Health goals — multiple selection allowed
// ---------------------------------------------------------------------------
export type HealthGoalId =
  | 'weight_loss'
  | 'fat_loss'
  | 'muscle_gain'
  | 'weight_gain'
  | 'calorie_tracking'
  | 'intermittent_fasting'
  | 'gut_health'
  | 'healthy_lifestyle';

export const HEALTH_GOALS: Option<HealthGoalId>[] = [
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'fat_loss', label: 'Fat Loss' },
  { id: 'muscle_gain', label: 'Muscle Gain' },
  { id: 'weight_gain', label: 'Weight Gain' },
  { id: 'calorie_tracking', label: 'Calorie Tracking' },
  { id: 'intermittent_fasting', label: 'Intermittent Fasting' },
  { id: 'gut_health', label: 'Improve Gut Health' },
  { id: 'healthy_lifestyle', label: 'Healthy Lifestyle' },
];

// ---------------------------------------------------------------------------
// Medical conditions — toggle switches
// ---------------------------------------------------------------------------
export type MedicalConditionId =
  | 'diabetes'
  | 'prediabetes'
  | 'high_cholesterol'
  | 'hypertension'
  | 'thyroid'
  | 'pcos'
  | 'fatty_liver'
  | 'kidney_disease'
  | 'ibs'
  | 'gerd'
  | 'gluten_intolerance'
  | 'lactose_intolerance';

export const MEDICAL_CONDITIONS: Option<MedicalConditionId>[] = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'prediabetes', label: 'Prediabetes' },
  { id: 'high_cholesterol', label: 'High Cholesterol' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'fatty_liver', label: 'Fatty Liver' },
  { id: 'kidney_disease', label: 'Kidney Disease' },
  { id: 'ibs', label: 'IBS' },
  { id: 'gerd', label: 'GERD' },
  { id: 'gluten_intolerance', label: 'Gluten Intolerance' },
  { id: 'lactose_intolerance', label: 'Lactose Intolerance' },
];

// ---------------------------------------------------------------------------
// Methodology / Lifestyle Modification Diet — single selection
// ---------------------------------------------------------------------------
export type DietMethodId =
  | 'calorie_deficit'
  | 'low_carb'
  | 'keto'
  | 'high_protein'
  | 'mediterranean'
  | 'plant_based'
  | 'gut_health';

export const DIET_METHODS: Option<DietMethodId>[] = [
  {
    id: 'calorie_deficit',
    label: 'Calorie Deficit',
    description: 'Eat below maintenance calories for steady weight loss.',
  },
  {
    id: 'low_carb',
    label: 'Low Carb',
    description: 'Reduce carbohydrates to manage blood sugar and appetite.',
  },
  {
    id: 'keto',
    label: 'Keto',
    description: 'Very low carb, high fat to drive ketosis.',
  },
  {
    id: 'high_protein',
    label: 'High Protein',
    description: 'Prioritize protein to preserve and build muscle.',
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    description: 'Whole foods, healthy fats, fish, and vegetables.',
  },
  {
    id: 'plant_based',
    label: 'Plant Based',
    description: 'Centered on vegetables, legumes, grains, and fruit.',
  },
  {
    id: 'gut_health',
    label: 'Gut Health',
    description: 'Fiber and fermented foods to support digestion.',
  },
];

// ---------------------------------------------------------------------------
// Gender & meal types
// ---------------------------------------------------------------------------
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export const GENDERS: Option<Gender>[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: Option<MealType>[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];
