// ABOUTME: Recipe detail page showing full recipe information
// ABOUTME: Displays ingredients, instructions, nutrition facts

import { getRecipe } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDifficultyHebrew, getCategoryHebrew, formatNumber, getTotalTime, formatCookingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  let recipe;
  try {
    recipe = await getRecipe(id);
  } catch (error) {
    notFound();
  }

  const totalTime = getTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes);

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button */}
      <Link href="/recipes" className="text-blue-600 hover:underline">
        ← חזרה למתכונים
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{recipe.nameHe}</h1>
          {recipe.difficulty && (
            <Badge variant={
              recipe.difficulty === 'easy' ? 'success' :
              recipe.difficulty === 'medium' ? 'warning' : 'error'
            }>
              {getDifficultyHebrew(recipe.difficulty)}
            </Badge>
          )}
        </div>

        {recipe.description && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {recipe.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.category && (
            <Badge variant="default">
              {getCategoryHebrew(recipe.category)}
            </Badge>
          )}
          {recipe.tags && recipe.tags.length > 0 && recipe.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Time & Servings */}
        <div className="flex gap-6 text-zinc-600 dark:text-zinc-400">
          {totalTime > 0 && (
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>{formatCookingTime(totalTime)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>🍽️</span>
            <span>{recipe.servings} מנות</span>
          </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ערכים תזונתיים למנה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(recipe.caloriesPerServing)}
              </div>
              <div className="text-sm text-zinc-500">קלוריות</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(recipe.proteinPerServing, 1)}g
              </div>
              <div className="text-sm text-zinc-500">חלבון</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatNumber(Number(recipe.totalCarbs) / recipe.servings, 1)}g
              </div>
              <div className="text-sm text-zinc-500">פחמימות</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(Number(recipe.totalFat) / recipe.servings, 1)}g
              </div>
              <div className="text-sm text-zinc-500">שומן</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(Number(recipe.totalFiber) / recipe.servings, 1)}g
              </div>
              <div className="text-sm text-zinc-500">סיבים</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>מרכיבים</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recipe.ingredients && recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-baseline gap-3 text-lg">
                <span className="text-blue-600">•</span>
                <span className="flex-1">
                  <span className="font-medium">{ing.food.nameHe}</span>
                  {' - '}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {ing.quantity}{ing.unit}
                  </span>
                  {ing.notes && (
                    <span className="text-sm text-zinc-500 mr-2">
                      ({ing.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>הוראות הכנה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">
              {recipe.instructions}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle>סה{"״"}כ ערכים תזונתיים (כל המתכון)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{formatNumber(recipe.totalCalories)}</div>
              <div className="text-sm text-zinc-500">קלוריות</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{formatNumber(recipe.totalProtein, 1)}g</div>
              <div className="text-sm text-zinc-500">חלבון</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{formatNumber(recipe.totalCarbs, 1)}g</div>
              <div className="text-sm text-zinc-500">פחמימות</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{formatNumber(recipe.totalFat, 1)}g</div>
              <div className="text-sm text-zinc-500">שומן</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{formatNumber(recipe.totalFiber, 1)}g</div>
              <div className="text-sm text-zinc-500">סיבים</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
