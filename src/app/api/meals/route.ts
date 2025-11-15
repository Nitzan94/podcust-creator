import { NextRequest, NextResponse } from 'next/server';
import { db, meals, mealItems, foods } from '@/lib/db';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * Get user's meals
 * GET /api/meals?date=2025-11-14
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session when auth is implemented
    const userId = '1'; // Temporary mock user

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    let where;
    if (dateParam) {
      // Get meals for specific date
      const date = new Date(dateParam);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      where = and(
        eq(meals.userId, userId),
        gte(meals.timestamp, startOfDay),
        lte(meals.timestamp, endOfDay)
      );
    } else {
      // Get all user meals
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

    return NextResponse.json({
      meals: userMeals,
      count: userMeals.length,
    });
  } catch (error) {
    console.error('Get meals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

/**
 * Create a new meal
 * POST /api/meals
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get userId from session when auth is implemented
    const userId = '1'; // Temporary mock user

    const body = await request.json();
    const { name, mealType, parsedText, items, timestamp } = body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one food item is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    // Fetch food details and calculate nutrition
    const itemsWithNutrition = await Promise.all(
      items.map(async (item: { foodId: string; quantity: number; unit: string }) => {
        const food = await db.query.foods.findFirst({
          where: eq(foods.id, item.foodId),
        });

        if (!food) {
          throw new Error(`Food not found: ${item.foodId}`);
        }

        // Calculate nutrition based on quantity (simplified - assumes quantity in grams)
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
          foodId: item.foodId,
          quantity: item.quantity,
          unit: item.unit || 'g',
          calories: Math.round(calories * 100) / 100,
          protein: Math.round(protein * 100) / 100,
          carbs: Math.round(carbs * 100) / 100,
          fat: Math.round(fat * 100) / 100,
        };
      })
    );

    // Create meal
    const [meal] = await db.insert(meals).values({
      userId,
      name,
      mealType,
      parsedText,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      totalCalories: Math.round(totalCalories * 100) / 100,
      totalProtein: Math.round(totalProtein * 100) / 100,
      totalCarbs: Math.round(totalCarbs * 100) / 100,
      totalFat: Math.round(totalFat * 100) / 100,
      totalFiber: Math.round(totalFiber * 100) / 100,
    }).returning();

    // Create meal items
    await db.insert(mealItems).values(
      itemsWithNutrition.map(item => ({
        mealId: meal.id,
        ...item,
      }))
    );

    // Fetch complete meal with items
    const completeMeal = await db.query.meals.findFirst({
      where: eq(meals.id, meal.id),
      with: {
        items: {
          with: {
            food: true,
          },
        },
      },
    });

    return NextResponse.json({
      meal: completeMeal,
      message: 'Meal created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create meal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create meal' },
      { status: 500 }
    );
  }
}

/**
 * Delete a meal
 * DELETE /api/meals?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Get userId from session when auth is implemented
    const userId = '1'; // Temporary mock user

    const searchParams = request.nextUrl.searchParams;
    const mealId = searchParams.get('id');

    if (!mealId) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const meal = await db.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    if (meal.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete meal (cascade will delete meal_items)
    await db.delete(meals).where(eq(meals.id, mealId));

    return NextResponse.json({
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete meal' },
      { status: 500 }
    );
  }
}
