CREATE TYPE "public"."food_source" AS ENUM('usda', 'user', 'scraped', 'verified');--> statement-breakpoint
CREATE TYPE "public"."meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');--> statement-breakpoint
CREATE TYPE "public"."recipe_category" AS ENUM('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink', 'salad', 'soup');--> statement-breakpoint
CREATE TYPE "public"."recipe_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."serving_unit" AS ENUM('g', 'ml', 'unit', 'cup', 'tbsp', 'tsp');--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"food_id" uuid,
	"meal_id" uuid,
	"recipe_id" uuid,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_he" text NOT NULL,
	"name_en" text,
	"barcode" text,
	"brand" text,
	"calories" numeric(10, 2) NOT NULL,
	"protein" numeric(10, 2) NOT NULL,
	"carbs" numeric(10, 2) NOT NULL,
	"fat" numeric(10, 2) NOT NULL,
	"fiber" numeric(10, 2) DEFAULT '0',
	"sugar" numeric(10, 2) DEFAULT '0',
	"sodium" numeric(10, 2) DEFAULT '0',
	"serving_size" numeric(10, 2) NOT NULL,
	"serving_unit" "serving_unit" NOT NULL,
	"source" "food_source" NOT NULL,
	"verified" boolean DEFAULT false,
	"usda_id" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"food_id" uuid NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit" "serving_unit" NOT NULL,
	"calories" numeric(10, 2),
	"protein" numeric(10, 2),
	"carbs" numeric(10, 2),
	"fat" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text,
	"meal_type" "meal_type",
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"parsed_text" text,
	"total_calories" numeric(10, 2),
	"total_protein" numeric(10, 2),
	"total_carbs" numeric(10, 2),
	"total_fat" numeric(10, 2),
	"total_fiber" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"food_id" uuid NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit" "serving_unit" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name_he" text NOT NULL,
	"name_en" text,
	"description" text,
	"category" "recipe_category",
	"difficulty" "recipe_difficulty" DEFAULT 'medium',
	"prep_time_minutes" integer,
	"cook_time_minutes" integer,
	"servings" integer DEFAULT 1,
	"instructions" text,
	"total_calories" numeric(10, 2),
	"total_protein" numeric(10, 2),
	"total_carbs" numeric(10, 2),
	"total_fat" numeric(10, 2),
	"total_fiber" numeric(10, 2),
	"calories_per_serving" numeric(10, 2),
	"protein_per_serving" numeric(10, 2),
	"tags" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"daily_calorie_goal" integer DEFAULT 2000,
	"protein_goal" integer DEFAULT 150,
	"carbs_goal" integer DEFAULT 200,
	"fat_goal" integer DEFAULT 70,
	"fiber_goal" integer DEFAULT 30,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foods" ADD CONSTRAINT "foods_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;