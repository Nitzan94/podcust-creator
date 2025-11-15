import { NextRequest, NextResponse } from 'next/server';
import { db, foods } from '@/lib/db';
import { ilike, or, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * Search foods by name (Hebrew or English)
 * GET /api/foods/search?q=ביצה&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    if (!query || query.length < 2) {
      return NextResponse.json({
        foods: [],
        message: 'Query must be at least 2 characters',
      });
    }

    // Search by Hebrew or English name
    const results = await db.query.foods.findMany({
      where: or(
        ilike(foods.nameHe, `%${query}%`),
        ilike(foods.nameEn, `%${query}%`)
      ),
      limit,
      orderBy: [desc(foods.verified)], // Verified foods first
    });

    return NextResponse.json({
      foods: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Food search error:', error);
    return NextResponse.json(
      { error: 'Failed to search foods' },
      { status: 500 }
    );
  }
}
