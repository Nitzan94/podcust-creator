import { generateAIText, type AIProvider } from './index';
import { foodsToToon } from '../toon';
import { db, foods } from '../db';
import { ilike, or } from 'drizzle-orm';
import { z } from 'zod';

// Schema for parsed meal
const ParsedMealSchema = z.object({
  foods: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
  })),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
});

export type ParsedMeal = z.infer<typeof ParsedMealSchema>;

/**
 * Parse natural language food input using AI
 * Uses TOON format to reduce tokens and save money!
 *
 * @example
 * const result = await parseFoodInput("אכלתי 2 ביצים וטוסט עם אבוקדו");
 * // Returns: { foods: [{ name: 'ביצה', quantity: 2, unit: 'unit' }, ...] }
 */
export async function parseFoodInput(
  input: string,
  options: {
    provider?: AIProvider;
    userId?: string;
  } = {}
): Promise<ParsedMeal> {
  const { provider, userId } = options;

  // 1. Get relevant foods from our database
  const searchTerms = extractKeywords(input);
  const relevantFoods = await searchFoodsInDB(searchTerms);

  // 2. Convert to TOON format (saves 30-60% tokens! 💰)
  const foodsDatabase = relevantFoods.map(food => ({
    id: food.id,
    nameHe: food.nameHe,
    nameEn: food.nameEn,
    servingUnit: food.servingUnit,
  }));

  const foodsTOON = foodsToToon(foodsDatabase);

  // 3. Create AI prompt
  const prompt = `
אתה עוזר תזונה שמפרסר קלט בשפה טבעית למזונות מובנים.

בסיס נתוני מזונות זמינים (TOON format):
${foodsTOON}

קלט מהמשתמש: "${input}"

נתח את הקלט וזהה:
1. כל מזון שהמשתמש אכל
2. כמות של כל מזון (מספר)
3. יחידת מידה (unit, g, ml, cup, tbsp, tsp)
4. סוג הארוחה אם ניתן לזהות (breakfast, lunch, dinner, snack)

השב בפורמט JSON בלבד:
{
  "foods": [
    { "name": "שם המזון בעברית", "quantity": מספר, "unit": "יחידה" }
  ],
  "mealType": "breakfast" (optional)
}

דוגמאות:
- "2 ביצים" → { "foods": [{ "name": "ביצה", "quantity": 2, "unit": "unit" }] }
- "כוס אורז" → { "foods": [{ "name": "אורז", "quantity": 1, "unit": "cup" }] }
- "ארוחת בוקר: טוסט עם גבינה" → { "foods": [...], "mealType": "breakfast" }

חשוב: אם מזון לא קיים במאגר, השתמש בשם הכללי ביותר.
`.trim();

  // 4. Generate with AI
  const response = await generateAIText(prompt, {
    provider,
    temperature: 0.2, // Low temperature for consistent parsing
    maxTokens: 500,
  });

  // 5. Parse response
  try {
    // Extract JSON from response (AI might add explanation)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return ParsedMealSchema.parse(parsed);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('AI Response:', response);
    throw new Error('Failed to parse food input. Please try rephrasing.');
  }
}

/**
 * Extract keywords from Hebrew/English text for food search
 */
function extractKeywords(text: string): string[] {
  // Remove common words and split
  const commonWords = ['אכלתי', 'שתיתי', 'ארוחת', 'עם', 'של', 'את', 'the', 'with', 'and', 'or'];

  const words = text
    .toLowerCase()
    .split(/[\s,،]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));

  return [...new Set(words)]; // Remove duplicates
}

/**
 * Search foods in database by keywords
 */
async function searchFoodsInDB(keywords: string[], limit: number = 50) {
  if (keywords.length === 0) {
    // Return most common foods
    return await db.query.foods.findMany({
      limit,
      where: (foods, { eq }) => eq(foods.verified, true),
    });
  }

  // Search by name (Hebrew or English)
  const conditions = keywords.flatMap(keyword => [
    ilike(foods.nameHe, `%${keyword}%`),
    ilike(foods.nameEn, `%${keyword}%`),
  ]);

  return await db.query.foods.findMany({
    where: or(...conditions),
    limit,
  });
}

/**
 * Match parsed food names to actual food IDs in our database
 */
export async function matchFoodsToDatabase(parsedFoods: ParsedMeal['foods']) {
  const matched = [];

  for (const parsedFood of parsedFoods) {
    // Try exact match first
    let food = await db.query.foods.findFirst({
      where: or(
        ilike(foods.nameHe, parsedFood.name),
        ilike(foods.nameEn, parsedFood.name)
      ),
    });

    // If no exact match, try fuzzy
    if (!food) {
      food = await db.query.foods.findFirst({
        where: or(
          ilike(foods.nameHe, `%${parsedFood.name}%`),
          ilike(foods.nameEn, `%${parsedFood.name}%)
        ),
      });
    }

    if (food) {
      matched.push({
        ...parsedFood,
        foodId: food.id,
        food: food,
      });
    } else {
      console.warn(`Food not found in database: ${parsedFood.name}`);
      // Could create a new food here or ask user for clarification
    }
  }

  return matched;
}

/**
 * Calculate nutrition for matched foods
 */
export function calculateNutrition(
  matchedFoods: Awaited<ReturnType<typeof matchFoodsToDatabase>>
) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const items = matchedFoods.map(item => {
    const { food, quantity, unit } = item;

    // Convert quantity to grams (simplified - would need proper conversion)
    let grams = quantity;
    if (unit === 'unit') {
      grams = quantity * parseFloat(food.servingSize);
    } else if (unit === 'cup') {
      grams = quantity * 240; // Rough estimate
    } else if (unit === 'tbsp') {
      grams = quantity * 15;
    } else if (unit === 'tsp') {
      grams = quantity * 5;
    }

    // Calculate nutrition based on grams (food nutrition is per 100g)
    const factor = grams / 100;
    const calories = parseFloat(food.calories) * factor;
    const protein = parseFloat(food.protein) * factor;
    const carbs = parseFloat(food.carbs) * factor;
    const fat = parseFloat(food.fat) * factor;
    const fiber = parseFloat(food.fiber) * factor;

    totalCalories += calories;
    totalProtein += protein;
    totalCarbs += carbs;
    totalFat += fat;
    totalFiber += fiber;

    return {
      foodId: food.id,
      quantity: grams,
      unit: 'g' as const,
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  });

  return {
    items,
    totals: {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
    },
  };
}
