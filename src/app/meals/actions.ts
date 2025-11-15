'use server';

import { auth } from '@/lib/auth/config';
import { db, meals, mealItems, foods } from '@/lib/db';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { parseWithRegex, shouldUseRegexParse } from '@/lib/ai/regex-parser';
import { parseFoodInput, matchFoodsToDatabase, calculateNutrition } from '@/lib/ai/food-parser';
import { revalidatePath } from 'next/cache';

export async function getMeals(date?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  let where;
  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    where = and(
      eq(meals.userId, userId),
      gte(meals.timestamp, startOfDay),
      lte(meals.timestamp, endOfDay)
    );
  } else {
    where = eq(meals.userId, userId);
  }

  const userMeals = await db.query.meals.findMany({
    where,
    with: {
      items: {
        with: {
          food: true,
        },
      },
    },
    orderBy: [desc(meals.timestamp)],
  });

  return userMeals;
}

export async function createMealFromText(input: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Try REGEX first (faster, no AI cost!)
  const regexResult = parseWithRegex(input);
  let matchedFoods;

  if (shouldUseRegexParse(regexResult)) {
    // REGEX succeeded! Match to DB
    matchedFoods = await Promise.all(
      regexResult.foods.map(async (parsedFood) => {
        const dbFood = await db.query.foods.findFirst({
          where: eq(foods.nameHe, parsedFood.name),
        });

        return {
          food: dbFood,
          quantity: parsedFood.quantity,
          unit: parsedFood.unit,
        };
      })
    );
  } else {
    // Fallback to AI
    const parsed = await parseFoodInput(input);
    matchedFoods = await matchFoodsToDatabase(parsed.foods);
  }

  // Filter out null foods
  const validFoods = matchedFoods.filter((item) => item.food !== null && item.food !== undefined);

  if (validFoods.length === 0) {
    throw new Error('לא נמצאו מזונות תואמים במאגר');
  }

  // Calculate nutrition
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const itemsWithNutrition = validFoods.map((item) => {
    const food = item.food!;
    const factor = item.quantity / 100;

    const calories = parseFloat(food.calories) * factor;
    const protein = parseFloat(food.protein) * factor;
    const carbs = parseFloat(food.carbs) * factor;
    const fat = parseFloat(food.fat) * factor;
    const fiber = parseFloat(food.fiber || '0') * factor;

    totalCalories += calories;
    totalProtein += protein;
    totalCarbs += carbs;
    totalFat += fat;
    totalFiber += fiber;

    return {
      foodId: food.id,
      quantity: item.quantity.toString(),
      unit: item.unit as 'g' | 'ml' | 'unit' | 'cup' | 'tbsp' | 'tsp',
      calories: (Math.round(calories * 100) / 100).toString(),
      protein: (Math.round(protein * 100) / 100).toString(),
      carbs: (Math.round(carbs * 100) / 100).toString(),
      fat: (Math.round(fat * 100) / 100).toString(),
    };
  });

  // Create meal
  const [meal] = await db
    .insert(meals)
    .values({
      userId: userId,
      parsedText: input,
      timestamp: new Date(),
      totalCalories: (Math.round(totalCalories * 100) / 100).toString(),
      totalProtein: (Math.round(totalProtein * 100) / 100).toString(),
      totalCarbs: (Math.round(totalCarbs * 100) / 100).toString(),
      totalFat: (Math.round(totalFat * 100) / 100).toString(),
      totalFiber: (Math.round(totalFiber * 100) / 100).toString(),
    })
    .returning();

  // Create meal items
  await db.insert(mealItems).values(
    itemsWithNutrition.map((item) => ({
      mealId: meal.id,
      ...item,
    }))
  );

  revalidatePath('/meals');
  revalidatePath('/dashboard');

  return meal;
}

export async function deleteMeal(mealId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Verify ownership
  const meal = await db.query.meals.findFirst({
    where: eq(meals.id, mealId),
  });

  if (!meal) {
    throw new Error('Meal not found');
  }

  if (meal.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Delete meal (cascade will delete meal_items)
  await db.delete(meals).where(eq(meals.id, mealId));

  revalidatePath('/meals');
  revalidatePath('/dashboard');

  return { success: true };
}
