'use server';

import { auth } from '@/lib/auth/config';
import { db, meals, users } from '@/lib/db';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function getDailyStats(date?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Default to today
  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  // Get user goals
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get meals for the day
  const dayMeals = await db.query.meals.findMany({
    where: and(
      eq(meals.userId, userId),
      gte(meals.timestamp, startOfDay),
      lte(meals.timestamp, endOfDay)
    ),
    with: {
      items: {
        with: {
          food: true,
        },
      },
    },
  });

  // Calculate totals
  const totals = dayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + parseFloat(meal.totalCalories?.toString() || '0'),
      protein: acc.protein + parseFloat(meal.totalProtein?.toString() || '0'),
      carbs: acc.carbs + parseFloat(meal.totalCarbs?.toString() || '0'),
      fat: acc.fat + parseFloat(meal.totalFat?.toString() || '0'),
      fiber: acc.fiber + parseFloat(meal.totalFiber?.toString() || '0'),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // Calculate progress
  const goals = {
    calories: user.dailyCalorieGoal || 2000,
    protein: user.proteinGoal || 150,
    carbs: user.carbsGoal || 200,
    fat: user.fatGoal || 70,
    fiber: user.fiberGoal || 30,
  };

  const progress = {
    calories: Math.min(Math.round((totals.calories / goals.calories) * 100), 100),
    protein: Math.min(Math.round((totals.protein / goals.protein) * 100), 100),
    carbs: Math.min(Math.round((totals.carbs / goals.carbs) * 100), 100),
    fat: Math.min(Math.round((totals.fat / goals.fat) * 100), 100),
    fiber: Math.min(Math.round((totals.fiber / goals.fiber) * 100), 100),
  };

  return {
    date: targetDate.toISOString().split('T')[0],
    totals: {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      fiber: Math.round(totals.fiber * 10) / 10,
    },
    goals,
    progress,
    meals: dayMeals,
    mealCount: dayMeals.length,
  };
}
