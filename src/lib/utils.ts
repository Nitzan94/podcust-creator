import type { NutritionProgress, NutritionGoals } from '@/types';

/**
 * Format number with Hebrew locale
 */
export function formatNumber(num: number | null | undefined, decimals: number = 0): string {
  if (num === null || num === undefined) return '0';
  const parsed = Number(num);
  if (isNaN(parsed)) return '0';
  return parsed.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate nutrition progress percentage
 */
export function calculateProgress(
  current: number,
  goal: number
): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/**
 * Get progress color based on percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 70) return 'text-yellow-600';
  if (percentage >= 50) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-green-600';
  if (percentage >= 70) return 'bg-yellow-600';
  if (percentage >= 50) return 'bg-orange-600';
  return 'bg-red-600';
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date (DD/MM/YYYY)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('he-IL');
}

/**
 * Get meal type in Hebrew
 */
export function getMealTypeHebrew(type: string): string {
  const map: Record<string, string> = {
    breakfast: 'ארוחת בוקר',
    lunch: 'ארוחת צהריים',
    dinner: 'ארוחת ערב',
    snack: 'חטיף',
  };
  return map[type] || type;
}

/**
 * Get difficulty in Hebrew
 */
export function getDifficultyHebrew(difficulty: string): string {
  const map: Record<string, string> = {
    easy: 'קל',
    medium: 'בינוני',
    hard: 'מאתגר',
  };
  return map[difficulty] || difficulty;
}

/**
 * Get category in Hebrew
 */
export function getCategoryHebrew(category: string): string {
  const map: Record<string, string> = {
    breakfast: 'בוקר',
    lunch: 'צהריים',
    dinner: 'ערב',
    snack: 'חטיף',
    dessert: 'קינוח',
    drink: 'משקה',
    salad: 'סלט',
    soup: 'מרק',
  };
  return map[category] || category;
}

/**
 * Get serving unit in Hebrew
 */
export function getServingUnitHebrew(unit: string): string {
  const map: Record<string, string> = {
    g: 'גרם',
    ml: 'מ"ל',
    unit: 'יחידה',
    cup: 'כוס',
    tbsp: 'כף',
    tsp: 'כפית',
  };
  return map[unit] || unit;
}

/**
 * Calculate total cooking time
 */
export function getTotalTime(prepTime?: number | null, cookTime?: number | null): number {
  return (prepTime || 0) + (cookTime || 0);
}

/**
 * Format cooking time
 */
export function formatCookingTime(minutes?: number): string {
  if (!minutes) return 'לא צוין';
  if (minutes < 60) return `${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} שעות ו-${mins} דקות` : `${hours} שעות`;
}

/**
 * Calculate nutrition progress
 */
export function getNutritionProgress(
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  },
  goals: NutritionGoals
): NutritionProgress {
  return {
    current,
    goals,
    percentage: {
      calories: calculateProgress(current.calories, goals.calories),
      protein: calculateProgress(current.protein, goals.protein),
      carbs: calculateProgress(current.carbs, goals.carbs),
      fat: calculateProgress(current.fat, goals.fat),
      fiber: calculateProgress(current.fiber, goals.fiber),
    },
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get time of day greeting
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'בוקר טוב';
  if (hour < 18) return 'צהריים טובים';
  return 'ערב טוב';
}

/**
 * Class names utility (like clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
