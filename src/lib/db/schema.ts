import { pgTable, uuid, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const foodSourceEnum = pgEnum('food_source', ['usda', 'user', 'scraped', 'verified']);
export const servingUnitEnum = pgEnum('serving_unit', ['g', 'ml', 'unit', 'cup', 'tbsp', 'tsp']);
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
export const recipeDifficultyEnum = pgEnum('recipe_difficulty', ['easy', 'medium', 'hard']);
export const recipeCategoryEnum = pgEnum('recipe_category', ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink', 'salad', 'soup']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Goals
  dailyCalorieGoal: integer('daily_calorie_goal').default(2000),
  proteinGoal: integer('protein_goal').default(150),
  carbsGoal: integer('carbs_goal').default(200),
  fatGoal: integer('fat_goal').default(70),
  fiberGoal: integer('fiber_goal').default(30),
});

// Foods table - our main nutrition database
export const foods = pgTable('foods', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Names
  nameHe: text('name_he').notNull(),
  nameEn: text('name_en'),

  // Product details
  barcode: text('barcode'),
  brand: text('brand'),

  // Nutrition per 100g
  calories: decimal('calories', { precision: 10, scale: 2 }).notNull(),
  protein: decimal('protein', { precision: 10, scale: 2 }).notNull(),
  carbs: decimal('carbs', { precision: 10, scale: 2 }).notNull(),
  fat: decimal('fat', { precision: 10, scale: 2 }).notNull(),
  fiber: decimal('fiber', { precision: 10, scale: 2 }).default('0'),
  sugar: decimal('sugar', { precision: 10, scale: 2 }).default('0'),
  sodium: decimal('sodium', { precision: 10, scale: 2 }).default('0'),

  // Serving info
  servingSize: decimal('serving_size', { precision: 10, scale: 2 }).notNull(),
  servingUnit: servingUnitEnum('serving_unit').notNull(),

  // Metadata
  source: foodSourceEnum('source').notNull(),
  verified: boolean('verified').default(false),
  usdaId: text('usda_id'), // Original USDA FDC ID

  // User contribution
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Meals table
export const meals = pgTable('meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  name: text('name'),
  mealType: mealTypeEnum('meal_type'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),

  // Parsed from natural language
  parsedText: text('parsed_text'),

  // Calculated totals (denormalized for performance)
  totalCalories: decimal('total_calories', { precision: 10, scale: 2 }),
  totalProtein: decimal('total_protein', { precision: 10, scale: 2 }),
  totalCarbs: decimal('total_carbs', { precision: 10, scale: 2 }),
  totalFat: decimal('total_fat', { precision: 10, scale: 2 }),
  totalFiber: decimal('total_fiber', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Meal items - junction table
export const mealItems = pgTable('meal_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  mealId: uuid('meal_id').references(() => meals.id, { onDelete: 'cascade' }).notNull(),
  foodId: uuid('food_id').references(() => foods.id).notNull(),

  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: servingUnitEnum('unit').notNull(),

  // Calculated nutrition for this specific item
  calories: decimal('calories', { precision: 10, scale: 2 }),
  protein: decimal('protein', { precision: 10, scale: 2 }),
  carbs: decimal('carbs', { precision: 10, scale: 2 }),
  fat: decimal('fat', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Favorites table
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  // Can favorite either a food, meal, or recipe
  foodId: uuid('food_id').references(() => foods.id),
  mealId: uuid('meal_id').references(() => meals.id),
  recipeId: uuid('recipe_id'),

  name: text('name'), // Custom name for the favorite

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recipes table - Personal recipe collection
export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),

  // Recipe details
  nameHe: text('name_he').notNull(),
  nameEn: text('name_en'),
  description: text('description'),
  category: recipeCategoryEnum('category'),
  difficulty: recipeDifficultyEnum('difficulty').default('medium'),

  // Time & servings
  prepTimeMinutes: integer('prep_time_minutes'),
  cookTimeMinutes: integer('cook_time_minutes'),
  servings: integer('servings').default(1),

  // Instructions
  instructions: text('instructions'), // Step by step instructions

  // Nutrition (calculated from ingredients)
  totalCalories: decimal('total_calories', { precision: 10, scale: 2 }),
  totalProtein: decimal('total_protein', { precision: 10, scale: 2 }),
  totalCarbs: decimal('total_carbs', { precision: 10, scale: 2 }),
  totalFat: decimal('total_fat', { precision: 10, scale: 2 }),
  totalFiber: decimal('total_fiber', { precision: 10, scale: 2 }),

  // Per serving (calculated)
  caloriesPerServing: decimal('calories_per_serving', { precision: 10, scale: 2 }),
  proteinPerServing: decimal('protein_per_serving', { precision: 10, scale: 2 }),

  // Tags for search
  tags: text('tags'), // Comma-separated tags

  // Visibility
  isPublic: boolean('is_public').default(false), // Can other users see it?

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Recipe ingredients - junction table
export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  foodId: uuid('food_id').references(() => foods.id).notNull(),

  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: servingUnitEnum('unit').notNull(),
  notes: text('notes'), // e.g., "chopped", "diced"

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  meals: many(meals),
  favorites: many(favorites),
  contributedFoods: many(foods),
  recipes: many(recipes),
}));

export const foodsRelations = relations(foods, ({ one, many }) => ({
  creator: one(users, {
    fields: [foods.createdBy],
    references: [users.id],
  }),
  mealItems: many(mealItems),
}));

export const mealsRelations = relations(meals, ({ one, many }) => ({
  user: one(users, {
    fields: [meals.userId],
    references: [users.id],
  }),
  items: many(mealItems),
}));

export const mealItemsRelations = relations(mealItems, ({ one }) => ({
  meal: one(meals, {
    fields: [mealItems.mealId],
    references: [meals.id],
  }),
  food: one(foods, {
    fields: [mealItems.foodId],
    references: [foods.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  food: one(foods, {
    fields: [favorites.foodId],
    references: [foods.id],
  }),
  meal: one(meals, {
    fields: [favorites.mealId],
    references: [meals.id],
  }),
  recipe: one(recipes, {
    fields: [favorites.recipeId],
    references: [recipes.id],
  }),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
  food: one(foods, {
    fields: [recipeIngredients.foodId],
    references: [foods.id],
  }),
}));
