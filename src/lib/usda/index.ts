/**
 * USDA FoodData Central API Integration
 * Free API Key: https://fdc.nal.usda.gov/api-key-signup.html
 */

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

interface USDASearchParams {
  query: string;
  pageSize?: number;
  pageNumber?: number;
  dataType?: string[];
}

interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
}

interface USDASearchResult {
  totalHits: number;
  foods: USDAFood[];
}

/**
 * Search USDA food database
 */
export async function searchUSDAFoods(params: USDASearchParams): Promise<USDASearchResult> {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    throw new Error('USDA_API_KEY is not set. Get one at https://fdc.nal.usda.gov/api-key-signup.html');
  }

  const {
    query,
    pageSize = 50,
    pageNumber = 1,
    dataType = ['Foundation', 'SR Legacy'], // Most reliable databases
  } = params;

  const url = new URL(`${USDA_API_BASE}/foods/search`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('pageNumber', pageNumber.toString());

  if (dataType.length > 0) {
    url.searchParams.set('dataType', dataType.join(','));
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as USDASearchResult;
  } catch (error) {
    console.error('USDA API request failed:', error);
    throw error;
  }
}

/**
 * Get specific food details by FDC ID
 */
export async function getUSDAFood(fdcId: number): Promise<USDAFood> {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    throw new Error('USDA_API_KEY is not set');
  }

  const url = `${USDA_API_BASE}/food/${fdcId}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('USDA API request failed:', error);
    throw error;
  }
}

/**
 * Convert USDA food data to our database format
 */
export function convertUSDAToOurFormat(usdaFood: USDAFood) {
  const nutrients = usdaFood.foodNutrients.reduce((acc, nutrient) => {
    // Map USDA nutrient IDs to our fields
    switch (nutrient.nutrientId) {
      case 1008: // Energy (kcal)
        acc.calories = nutrient.value;
        break;
      case 1003: // Protein
        acc.protein = nutrient.value;
        break;
      case 1005: // Carbohydrates
        acc.carbs = nutrient.value;
        break;
      case 1004: // Total Fat
        acc.fat = nutrient.value;
        break;
      case 1079: // Fiber
        acc.fiber = nutrient.value;
        break;
      case 2000: // Sugar
        acc.sugar = nutrient.value;
        break;
      case 1093: // Sodium
        acc.sodium = nutrient.value;
        break;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    usdaId: usdaFood.fdcId.toString(),
    nameEn: usdaFood.description,
    nameHe: '', // Will need translation
    calories: nutrients.calories || 0,
    protein: nutrients.protein || 0,
    carbs: nutrients.carbs || 0,
    fat: nutrients.fat || 0,
    fiber: nutrients.fiber || 0,
    sugar: nutrients.sugar || 0,
    sodium: nutrients.sodium || 0,
    servingSize: 100, // USDA data is per 100g
    servingUnit: 'g' as const,
    source: 'usda' as const,
    verified: true,
  };
}

/**
 * Batch import USDA foods to our database
 * For seeding the database with common foods
 */
export async function importCommonFoods(queries: string[]) {
  const importedFoods = [];

  for (const query of queries) {
    try {
      const result = await searchUSDAFoods({ query, pageSize: 10 });

      for (const food of result.foods) {
        const converted = convertUSDAToOurFormat(food);
        importedFoods.push(converted);
      }

      // Rate limiting - USDA allows 1000 requests/hour
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to import ${query}:`, error);
    }
  }

  return importedFoods;
}

// Common foods to seed database
export const COMMON_FOODS_QUERIES = [
  'egg',
  'chicken breast',
  'rice',
  'bread',
  'milk',
  'yogurt',
  'banana',
  'apple',
  'orange',
  'tomato',
  'cucumber',
  'lettuce',
  'potato',
  'pasta',
  'beef',
  'salmon',
  'tuna',
  'cheese',
  'olive oil',
  'avocado',
];
