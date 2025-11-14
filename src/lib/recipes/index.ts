import { db, recipes, recipeIngredients, foods } from '../db';
import { eq, and, ilike, or } from 'drizzle-orm';
import { generateAIText } from '../ai';

/**
 * Search recipes by query (name, tags, ingredients)
 */
export async function searchRecipes(query: string, userId?: string) {
  const conditions = [
    ilike(recipes.nameHe, `%${query}%`),
    ilike(recipes.nameEn, `%${query}%`),
    ilike(recipes.tags, `%${query}%`),
  ];

  // If user provided, show their recipes + public recipes
  if (userId) {
    return await db.query.recipes.findMany({
      where: and(
        or(...conditions),
        or(
          eq(recipes.userId, userId),
          eq(recipes.isPublic, true)
        )
      ),
      with: {
        ingredients: {
          with: {
            food: true,
          },
        },
      },
    });
  }

  // Public only
  return await db.query.recipes.findMany({
    where: and(
      or(...conditions),
      eq(recipes.isPublic, true)
    ),
    with: {
      ingredients: {
        with: {
          food: true,
        },
      },
    },
  });
}

/**
 * Get recipe by ID with full details
 */
export async function getRecipeById(id: string, userId?: string) {
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      ingredients: {
        with: {
          food: true,
        },
      },
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Check access: owner or public
  if (recipe.userId !== userId && !recipe.isPublic) {
    throw new Error('Recipe is private');
  }

  return recipe;
}

/**
 * Calculate recipe nutrition from ingredients
 */
export function calculateRecipeNutrition(ingredients: Array<{
  food: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  quantity: string;
  unit: string;
}>) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  for (const ingredient of ingredients) {
    // Convert to grams (simplified)
    let grams = parseFloat(ingredient.quantity);
    if (ingredient.unit === 'cup') grams *= 240;
    else if (ingredient.unit === 'tbsp') grams *= 15;
    else if (ingredient.unit === 'tsp') grams *= 5;

    // Calculate nutrition (food is per 100g)
    const factor = grams / 100;
    totalCalories += parseFloat(ingredient.food.calories) * factor;
    totalProtein += parseFloat(ingredient.food.protein) * factor;
    totalCarbs += parseFloat(ingredient.food.carbs) * factor;
    totalFat += parseFloat(ingredient.food.fat) * factor;
    totalFiber += parseFloat(ingredient.food.fiber) * factor;
  }

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalFiber: Math.round(totalFiber * 10) / 10,
  };
}

/**
 * AI-powered recipe generation
 * Generate personalized recipes based on available ingredients or preferences
 */
export async function generateRecipeWithAI(params: {
  ingredients?: string[]; // List of available ingredients
  dietary?: string[]; // e.g., ["vegetarian", "high-protein"]
  mealType?: string; // e.g., "breakfast", "lunch"
  servings?: number;
  maxTime?: number; // Max prep + cook time in minutes
  userId: string;
}) {
  const {
    ingredients = [],
    dietary = [],
    mealType = 'any',
    servings = 2,
    maxTime,
    userId,
  } = params;

  // Build prompt
  const prompt = `
אתה שף מקצועי שיוצר מתכונים בריאים ומותאמים אישית.

צור מתכון חדש על בסיס הדרישות הבאות:

${ingredients.length > 0 ? `רכיבים זמינים: ${ingredients.join(', ')}` : ''}
${dietary.length > 0 ? `דרישות תזונתיות: ${dietary.join(', ')}` : ''}
${mealType !== 'any' ? `סוג ארוחה: ${mealType}` : ''}
מספר מנות: ${servings}
${maxTime ? `זמן מקסימלי: ${maxTime} דקות` : ''}

החזר מתכון בפורמט JSON הבא:
{
  "nameHe": "שם המתכון בעברית",
  "description": "תיאור קצר של המתכון",
  "prepTimeMinutes": זמן הכנה בדקות,
  "cookTimeMinutes": זמן בישול בדקות,
  "servings": ${servings},
  "difficulty": "easy/medium/hard",
  "ingredients": [
    { "name": "שם המרכיב", "quantity": כמות, "unit": "g/ml/unit/cup/tbsp/tsp", "notes": "הערות (אופציונלי)" }
  ],
  "instructions": "הוראות הכנה מפורטות צעד אחר צעד",
  "tags": ["תג1", "תג2", "תג3"]
}

חשוב: המתכון חייב להיות בר ביצוע, מציאותי, ובריא.
`.trim();

  const response = await generateAIText(prompt, {
    temperature: 0.8, // Higher for creativity
    maxTokens: 2000,
  });

  // Parse response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI recipe response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Create custom recipe from AI-generated data
 */
export async function createRecipeFromAI(
  aiRecipe: Awaited<ReturnType<typeof generateRecipeWithAI>>,
  userId: string
) {
  // Match ingredients to our food database
  const matchedIngredients = [];

  for (const ingredient of aiRecipe.ingredients) {
    const food = await db.query.foods.findFirst({
      where: or(
        ilike(foods.nameHe, ingredient.name),
        ilike(foods.nameHe, `%${ingredient.name}%`)
      ),
    });

    if (food) {
      matchedIngredients.push({
        foodId: food.id,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes,
      });
    }
  }

  if (matchedIngredients.length === 0) {
    throw new Error('Could not match any ingredients to food database');
  }

  // Calculate nutrition
  const ingredientsWithFood = await Promise.all(
    matchedIngredients.map(async (ing) => {
      const food = await db.query.foods.findFirst({
        where: eq(foods.id, ing.foodId),
      });
      return { ...ing, food: food! };
    })
  );

  const nutrition = calculateRecipeNutrition(ingredientsWithFood);

  // Create recipe
  const [recipe] = await db.insert(recipes).values({
    userId,
    nameHe: aiRecipe.nameHe,
    description: aiRecipe.description,
    prepTimeMinutes: aiRecipe.prepTimeMinutes,
    cookTimeMinutes: aiRecipe.cookTimeMinutes,
    servings: aiRecipe.servings,
    difficulty: aiRecipe.difficulty,
    instructions: aiRecipe.instructions,
    tags: aiRecipe.tags.join(','),
    ...nutrition,
    caloriesPerServing: Math.round(nutrition.totalCalories / aiRecipe.servings),
    proteinPerServing: Math.round((nutrition.totalProtein / aiRecipe.servings) * 10) / 10,
  }).returning();

  // Add ingredients
  await db.insert(recipeIngredients).values(
    matchedIngredients.map((ing) => ({
      recipeId: recipe.id,
      ...ing,
    }))
  );

  return recipe;
}

/**
 * Get user's recipes
 */
export async function getUserRecipes(userId: string, includePublic: boolean = false) {
  if (includePublic) {
    return await db.query.recipes.findMany({
      where: or(
        eq(recipes.userId, userId),
        eq(recipes.isPublic, true)
      ),
      with: {
        ingredients: {
          with: {
            food: true,
          },
        },
      },
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });
  }

  return await db.query.recipes.findMany({
    where: eq(recipes.userId, userId),
    with: {
      ingredients: {
        with: {
          food: true,
        },
      },
    },
    orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
  });
}
