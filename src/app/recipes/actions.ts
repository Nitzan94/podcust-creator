'use server';

import { auth } from '@/lib/auth/config';
import { db, recipes, recipeIngredients, foods } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateAIText } from '@/lib/ai';

export async function getRecipes() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const userRecipes = await db.query.recipes.findMany({
    where: eq(recipes.userId, userId),
    with: {
      ingredients: {
        with: {
          food: true,
        },
      },
    },
    orderBy: [desc(recipes.createdAt)],
  });

  return userRecipes;
}

export async function createRecipe(data: {
  nameHe: string;
  description?: string;
  category?: string;
  difficulty?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings: number;
  instructions: string;
  ingredients: Array<{
    foodId: string;
    quantity: number;
    unit: string;
    notes?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Calculate nutrition from ingredients
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const ingredientsWithNutrition = await Promise.all(
    data.ingredients.map(async (ing) => {
      const food = await db.query.foods.findFirst({
        where: eq(foods.id, ing.foodId),
      });

      if (!food) throw new Error(`Food not found: ${ing.foodId}`);

      const factor = ing.quantity / 100;
      totalCalories += parseFloat(food.calories) * factor;
      totalProtein += parseFloat(food.protein) * factor;
      totalCarbs += parseFloat(food.carbs) * factor;
      totalFat += parseFloat(food.fat) * factor;
      totalFiber += parseFloat(food.fiber || '0') * factor;

      return {
        foodId: ing.foodId,
        quantity: ing.quantity.toString(),
        unit: ing.unit,
        notes: ing.notes,
      };
    })
  );

  // Create recipe
  const [recipe] = await db
    .insert(recipes)
    .values({
      userId,
      nameHe: data.nameHe,
      description: data.description,
      category: data.category as any,
      difficulty: data.difficulty as any,
      prepTimeMinutes: data.prepTimeMinutes,
      cookTimeMinutes: data.cookTimeMinutes,
      servings: data.servings,
      instructions: data.instructions,
      totalCalories: (Math.round(totalCalories * 100) / 100).toString(),
      totalProtein: (Math.round(totalProtein * 100) / 100).toString(),
      totalCarbs: (Math.round(totalCarbs * 100) / 100).toString(),
      totalFat: (Math.round(totalFat * 100) / 100).toString(),
      totalFiber: (Math.round(totalFiber * 100) / 100).toString(),
      caloriesPerServing: (Math.round((totalCalories / data.servings) * 100) / 100).toString(),
      proteinPerServing: (Math.round((totalProtein / data.servings) * 100) / 100).toString(),
    })
    .returning();

  // Create ingredients
  await db.insert(recipeIngredients).values(
    ingredientsWithNutrition.map((ing) => ({
      recipeId: recipe.id,
      ...ing,
    }))
  );

  revalidatePath('/recipes');
  return recipe;
}

export async function deleteRecipe(recipeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Verify ownership
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  });

  if (!recipe) throw new Error('Recipe not found');
  if (recipe.userId !== userId) throw new Error('Unauthorized');

  await db.delete(recipes).where(eq(recipes.id, recipeId));

  revalidatePath('/recipes');
  return { success: true };
}

export async function generateRecipeWithAI(prompt: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const aiPrompt = `
אתה שף מקצועי ותזונאי. צור מתכון עבור: "${prompt}"

החזר JSON בפורמט הבא:
{
  "nameHe": "שם המתכון בעברית",
  "description": "תיאור קצר",
  "category": "breakfast/lunch/dinner/snack/dessert/salad/soup",
  "difficulty": "easy/medium/hard",
  "prepTimeMinutes": מספר,
  "cookTimeMinutes": מספר,
  "servings": מספר,
  "instructions": "הוראות הכנה צעד אחר צעד",
  "ingredients": [
    {
      "name": "שם המרכיב בעברית",
      "quantity": מספר,
      "unit": "g/ml/unit/cup/tbsp/tsp",
      "notes": "הערות אופציונליות"
    }
  ]
}

חשוב:
- השתמש במרכיבים פשוטים וזמינים
- כמויות ריאליסטיות
- הוראות ברורות ומפורטות
`.trim();

  const response = await generateAIText(aiPrompt, {
    temperature: 0.7,
  });

  // Parse JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('לא הצלחתי ליצור מתכון. נסה שוב.');
  }

  const recipeData = JSON.parse(jsonMatch[0]);
  return recipeData;
}
