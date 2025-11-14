// Core types for the application
export interface User {
  id: string;
  email: string;
  name: string;
  dailyCalorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  fiberGoal: number;
}

export interface Food {
  id: string;
  nameHe: string;
  nameEn?: string;
  barcode?: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: number;
  servingUnit: ServingUnit;
  source: FoodSource;
  verified: boolean;
}

export interface Meal {
  id: string;
  userId: string;
  name?: string;
  mealType?: MealType;
  timestamp: Date;
  parsedText?: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface MealItem {
  id: string;
  food: Food;
  quantity: number;
  unit: ServingUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  userId: string;
  nameHe: string;
  nameEn?: string;
  description?: string;
  category?: RecipeCategory;
  difficulty: RecipeDifficulty;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings: number;
  instructions: string;
  ingredients: RecipeIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  tags: string[];
  isPublic: boolean;
}

export interface RecipeIngredient {
  id: string;
  food: Food;
  quantity: number;
  unit: ServingUnit;
  notes?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  type: 'food' | 'meal' | 'recipe';
  itemId: string;
  name?: string;
  item?: Food | Meal | Recipe;
}

// Enums
export type FoodSource = 'usda' | 'user' | 'scraped' | 'verified';
export type ServingUnit = 'g' | 'ml' | 'unit' | 'cup' | 'tbsp' | 'tsp';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'drink' | 'salad' | 'soup';

// Stats & Analytics
export interface DailyStats {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  meals: Meal[];
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionProgress {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  goals: NutritionGoals;
  percentage: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}
