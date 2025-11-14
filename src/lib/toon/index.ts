// NOTE: TOON format will be fully integrated once the database is set up
// For now, we're using JSON as a fallback for development

/**
 * Convert an array of food objects to TOON format
 * Saves ~30-60% tokens compared to JSON
 *
 * TODO: Implement actual TOON stringify when DB is ready
 *
 * @example
 * const foods = [
 *   { id: '1', nameHe: 'ביצה', calories: 70, protein: 6 },
 *   { id: '2', nameHe: 'לחם', calories: 80, protein: 4 }
 * ];
 * const toon = foodsToToon(foods);
 * // Result: compact TOON format string
 */
export function foodsToToon<T>(foods: T[]): string {
  if (!foods || foods.length === 0) {
    return '';
  }

  try {
    // TODO: Replace with actual TOON.stringify() when integrated
    // return TOON.stringify(foods);
    return JSON.stringify(foods);
  } catch (error) {
    console.error('Failed to convert foods to TOON:', error);
    return JSON.stringify(foods);
  }
}

/**
 * Parse TOON format back to JavaScript objects
 *
 * TODO: Implement actual TOON parse when DB is ready
 */
export function toonToFoods<T>(toonString: string): T[] {
  if (!toonString) {
    return [];
  }

  try {
    // TODO: Replace with actual TOON.parse() when integrated
    // return TOON.parse(toonString);
    return JSON.parse(toonString);
  } catch (error) {
    console.error('Failed to parse TOON:', error);
    return [];
  }
}

/**
 * Calculate token savings percentage
 * For analytics/monitoring
 */
export function calculateTokenSavings(jsonString: string, toonString: string): number {
  const jsonLength = jsonString.length;
  const toonLength = toonString.length;

  if (jsonLength === 0) return 0;

  const savings = ((jsonLength - toonLength) / jsonLength) * 100;
  return Math.round(savings * 10) / 10; // Round to 1 decimal
}

/**
 * Compare formats and log savings
 * Useful for development/debugging
 */
export function logFormatComparison<T>(data: T[], label: string = 'Data') {
  const jsonStr = JSON.stringify(data);
  const toonStr = foodsToToon(data);
  const savings = calculateTokenSavings(jsonStr, toonStr);

  console.log(`📊 ${label} Format Comparison:`);
  console.log(`   JSON: ${jsonStr.length} chars`);
  console.log(`   TOON: ${toonStr.length} chars`);
  console.log(`   Savings: ${savings}% 💰`);

  return { jsonStr, toonStr, savings };
}

export default {
  foodsToToon,
  toonToFoods,
  calculateTokenSavings,
  logFormatComparison,
};
