import 'server-only';
import OpenAI from 'openai';
import {
  EMPTY_NUTRITION,
  type DietFeedback,
  type FoodAnalysis,
  type Nutrition,
} from '@/types/domain';
import type { DietMethodId, MedicalConditionId } from '@/constants/health';

const MODEL = 'gpt-4o-mini';

export type AnalyzeArgs = {
  /** data URL or remote https URL of the meal image. */
  imageUrl: string;
  dietMethod: DietMethodId | null;
  conditions: MedicalConditionId[];
};

const SYSTEM_PROMPT = `You are a clinical nutrition assistant for the "Be Healthy" app.
Analyze the food in the image and estimate nutrition for the full portion shown.
Then give short, practical feedback tailored to the user's diet method and medical conditions.
Respond ONLY with strict JSON matching the requested schema.`;

type RawResponse = {
  foodName?: string;
  description?: string;
  servingEstimate?: string;
  confidence?: number;
  nutrition?: Partial<Nutrition>;
  feedback?: Partial<DietFeedback>;
};

function buildUserPrompt(args: AnalyzeArgs): string {
  const diet = args.dietMethod ?? 'none specified';
  const conditions = args.conditions.length
    ? args.conditions.join(', ')
    : 'none reported';
  return [
    `User diet method (Lifestyle Modification Diet): ${diet}.`,
    `User medical conditions: ${conditions}.`,
    'Return JSON with this exact shape:',
    `{
  "foodName": string,
  "description": string,
  "servingEstimate": string,
  "confidence": number,
  "nutrition": {
    "calories": number, "protein": number, "carbs": number, "fats": number,
    "fiber": number, "glycemicIndex": number|null, "glycemicLoad": number|null,
    "vitamins": string[], "minerals": string[]
  },
  "feedback": { "verdict": "good"|"moderate"|"avoid", "summary": string, "tips": string[] }
}`,
  ].join('\n');
}

function coerceNutrition(n?: Partial<Nutrition>): Nutrition {
  if (!n) return { ...EMPTY_NUTRITION };
  return {
    calories: Number(n.calories ?? 0),
    protein: Number(n.protein ?? 0),
    carbs: Number(n.carbs ?? 0),
    fats: Number(n.fats ?? 0),
    fiber: Number(n.fiber ?? 0),
    glycemicIndex: n.glycemicIndex == null ? null : Number(n.glycemicIndex),
    glycemicLoad: n.glycemicLoad == null ? null : Number(n.glycemicLoad),
    vitamins: Array.isArray(n.vitamins) ? n.vitamins : [],
    minerals: Array.isArray(n.minerals) ? n.minerals : [],
  };
}

function coerceAnalysis(raw: RawResponse): FoodAnalysis {
  return {
    foodName: raw.foodName ?? 'Unknown food',
    description: raw.description,
    servingEstimate: raw.servingEstimate,
    confidence: raw.confidence,
    nutrition: coerceNutrition(raw.nutrition),
    feedback: raw.feedback
      ? {
          verdict:
            (raw.feedback.verdict as DietFeedback['verdict']) ?? 'moderate',
          summary: raw.feedback.summary ?? '',
          tips: Array.isArray(raw.feedback.tips) ? raw.feedback.tips : [],
        }
      : undefined,
  };
}

export const isOpenAIConfigured = Boolean(process.env.OPENAI_API_KEY);

export async function analyzeFoodImage(args: AnalyzeArgs): Promise<FoodAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured on the server.');

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: buildUserPrompt(args) },
          { type: 'image_url', image_url: { url: args.imageUrl } },
        ],
      },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? '{}';
  let parsed: RawResponse;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI returned malformed JSON. Please try again.');
  }
  return coerceAnalysis(parsed);
}

/** Deterministic fallback so the app is usable without an API key. */
export function mockAnalyzeFoodImage(args: AnalyzeArgs): FoodAnalysis {
  const lowCarb = args.dietMethod === 'keto' || args.dietMethod === 'low_carb';
  return {
    foodName: 'Grilled chicken bowl',
    description: 'Grilled chicken with brown rice, greens, and avocado.',
    servingEstimate: '1 bowl (~350g)',
    confidence: 0.78,
    nutrition: {
      calories: 520,
      protein: 42,
      carbs: 48,
      fats: 18,
      fiber: 9,
      glycemicIndex: 48,
      glycemicLoad: 23,
      vitamins: ['Vitamin C', 'Vitamin B6', 'Folate'],
      minerals: ['Iron', 'Magnesium', 'Potassium'],
    },
    feedback: {
      verdict: lowCarb ? 'moderate' : 'good',
      summary: lowCarb
        ? 'Solid protein, but the rice adds carbs to watch on a low-carb plan.'
        : 'Balanced and high in protein — a great fit for your plan.',
      tips: [
        'Great lean protein source.',
        lowCarb
          ? 'Swap rice for cauliflower rice to cut carbs.'
          : 'Fiber content supports gut health.',
      ],
    },
  };
}
