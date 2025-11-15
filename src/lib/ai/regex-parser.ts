/**
 * REGEX-based food parser
 * Tries to parse food input using regex patterns before falling back to AI
 */

export interface ParsedFoodItem {
  quantity: number;
  unit: string;
  name: string;
  confidence: number;
}

export interface RegexParseResult {
  success: boolean;
  foods: ParsedFoodItem[];
  rawInput: string;
}

// Hebrew units mapping
const UNITS_MAP: Record<string, string> = {
  'גרם': 'g',
  'גרמים': 'g',
  'גר': 'g',
  'ג': 'g',
  'כוס': 'cup',
  'כוסות': 'cup',
  'כפית': 'tsp',
  'כפיות': 'tsp',
  'כף': 'tbsp',
  'כפות': 'tbsp',
  'מ"ל': 'ml',
  'מיליליטר': 'ml',
  'יחידה': 'unit',
  'יחידות': 'unit',
};

// Common food patterns with regex
const FOOD_PATTERNS = [
  // Pattern: "2 ביצים"
  /(\d+\.?\d*)\s*(ביצה|ביצים)/gi,
  // Pattern: "100 גרם חזה עוף"
  /(\d+\.?\d*)\s*(גרם|גרמים|גר|ג\')\s+([א-ת\s]+)/gi,
  // Pattern: "כוס אורז"
  /(כוס|כפית|כף|כפות)\s+([א-ת\s]+)/gi,
  // Pattern: "חצי אבוקדו"
  /(חצי|רבע|שליש)\s+([א-ת\s]+)/gi,
];

// Fraction words to numbers
const FRACTIONS: Record<string, number> = {
  'חצי': 0.5,
  'רבע': 0.25,
  'שליש': 0.33,
  'שני שלישים': 0.66,
  'שלושה רבעים': 0.75,
};

// Normalize Hebrew text
function normalizeHebrew(text: string): string {
  return text
    .replace(/[״"׳']/g, '') // Remove quotes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Parse quantity with unit
function parseQuantityUnit(quantityStr: string, unitStr: string): { quantity: number; unit: string } {
  let quantity = parseFloat(quantityStr);

  // Handle fractions
  if (FRACTIONS[quantityStr]) {
    quantity = FRACTIONS[quantityStr];
  }

  // Normalize unit
  const normalizedUnit = UNITS_MAP[unitStr] || 'g';

  return { quantity, unit: normalizedUnit };
}

/**
 * Try to parse food input using regex patterns
 */
export function parseWithRegex(input: string): RegexParseResult {
  const normalized = normalizeHebrew(input);
  const foods: ParsedFoodItem[] = [];

  // Split by common separators
  const parts = normalized.split(/[,،\n]/).filter(p => p.trim());

  for (const part of parts) {
    let matched = false;

    // Pattern 1: "2 ביצים"
    const eggMatch = part.match(/(\d+\.?\d*)\s*(ביצה|ביצים)/i);
    if (eggMatch) {
      foods.push({
        quantity: parseFloat(eggMatch[1]),
        unit: 'unit',
        name: 'ביצה',
        confidence: 0.95,
      });
      matched = true;
      continue;
    }

    // Pattern 2: "100 גרם חזה עוף"
    const gramMatch = part.match(/(\d+\.?\d*)\s*(גרם|גרמים|גר|ג\'?)\s+([א-ת\s]+)/i);
    if (gramMatch) {
      foods.push({
        quantity: parseFloat(gramMatch[1]),
        unit: 'g',
        name: gramMatch[3].trim(),
        confidence: 0.9,
      });
      matched = true;
      continue;
    }

    // Pattern 3: "כוס אורז"
    const cupMatch = part.match(/(כוס|כפית|כף|כפות)\s+([א-ת\s]+)/i);
    if (cupMatch) {
      const { quantity, unit } = parseQuantityUnit('1', cupMatch[1]);
      foods.push({
        quantity,
        unit,
        name: cupMatch[2].trim(),
        confidence: 0.85,
      });
      matched = true;
      continue;
    }

    // Pattern 4: "חצי אבוקדו"
    const fractionMatch = part.match(/(חצי|רבע|שליש)\s+([א-ת\s]+)/i);
    if (fractionMatch) {
      const { quantity } = parseQuantityUnit(fractionMatch[1], 'unit');
      foods.push({
        quantity,
        unit: 'unit',
        name: fractionMatch[2].trim(),
        confidence: 0.85,
      });
      matched = true;
      continue;
    }

    // Pattern 5: Just food name "טוסט", "אבוקדו" (default to 1 unit)
    const simpleMatch = part.match(/^([א-ת\s]+)$/i);
    if (simpleMatch && simpleMatch[1].trim().length > 2) {
      foods.push({
        quantity: 1,
        unit: 'unit',
        name: simpleMatch[1].trim(),
        confidence: 0.7,
      });
      matched = true;
    }
  }

  return {
    success: foods.length > 0,
    foods,
    rawInput: input,
  };
}

/**
 * Get confidence level for regex parse
 */
export function getParseConfidence(result: RegexParseResult): number {
  if (result.foods.length === 0) return 0;

  const avgConfidence = result.foods.reduce((sum, f) => sum + f.confidence, 0) / result.foods.length;
  return avgConfidence;
}

/**
 * Determine if regex parse is good enough (>= 0.75 confidence)
 */
export function shouldUseRegexParse(result: RegexParseResult): boolean {
  return result.success && getParseConfidence(result) >= 0.75;
}
