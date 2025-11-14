import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/types';
import { getDifficultyHebrew, getCategoryHebrew, formatNumber, getTotalTime, formatCookingTime } from '@/lib/utils';
import Link from 'next/link';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = getTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes);

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{recipe.nameHe}</CardTitle>
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
            <CardDescription className="line-clamp-2">
              {recipe.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.category && (
                <Badge variant="default">
                  {getCategoryHebrew(recipe.category)}
                </Badge>
              )}
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Time & Servings */}
          <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{formatCookingTime(totalTime)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>🍽️</span>
              <span>{recipe.servings} מנות</span>
            </div>
          </div>

          {/* Nutrition Per Serving */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xl font-bold text-green-600">
                {formatNumber(recipe.caloriesPerServing)}
              </div>
              <div className="text-xs text-zinc-500">קלוריות למנה</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">
                {formatNumber(recipe.proteinPerServing, 1)}g
              </div>
              <div className="text-xs text-zinc-500">חלבון למנה</div>
            </div>
          </div>

          {/* Ingredients Count */}
          <div className="text-xs text-zinc-500">
            {recipe.ingredients.length} מרכיבים
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
