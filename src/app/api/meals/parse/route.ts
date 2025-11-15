import { NextRequest, NextResponse } from 'next/server';
import { parseFoodInput, matchFoodsToDatabase, calculateNutrition } from '@/lib/ai/food-parser';

export const dynamic = 'force-dynamic';

/**
 * Parse natural language food input with AI
 * POST /api/meals/parse
 * Body: { text: string, provider?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, provider } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Parse with AI
    const parsed = await parseFoodInput(text, { provider });

    // Match to database
    const matched = await matchFoodsToDatabase(parsed.foods);

    if (matched.length === 0) {
      return NextResponse.json(
        { error: 'Could not match any foods to database. Try being more specific.' },
        { status: 400 }
      );
    }

    // Calculate nutrition
    const nutrition = calculateNutrition(matched);

    return NextResponse.json({
      parsed,
      matched,
      nutrition,
      mealData: {
        parsedText: text,
        mealType: parsed.mealType,
        items: nutrition.items,
        totals: nutrition.totals,
      },
    });
  } catch (error) {
    console.error('Parse meal error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to parse meal',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
