import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meal } from '@/types';
import { formatTime, getMealTypeHebrew, formatNumber } from '@/lib/utils';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{meal.name || 'ארוחה'}</CardTitle>
            <div className="text-sm text-zinc-500 mt-1">
              {formatTime(meal.timestamp)}
            </div>
          </div>
          {meal.mealType && (
            <Badge>{getMealTypeHebrew(meal.mealType)}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parsed Text */}
        {meal.parsedText && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 italic">
            "{meal.parsedText}"
          </div>
        )}

        {/* Food Items */}
        <div className="space-y-2">
          {meal.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.food.nameHe}</span>
              <span className="text-zinc-500">
                {formatNumber(item.quantity)} {item.unit}
              </span>
            </div>
          ))}
        </div>

        {/* Nutrition Summary */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(meal.totalCalories)}
            </div>
            <div className="text-xs text-zinc-500">קלוריות</div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              {formatNumber(meal.totalProtein, 1)}g
            </div>
            <div className="text-xs text-zinc-500">חלבון</div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              {formatNumber(meal.totalCarbs, 1)}g
            </div>
            <div className="text-xs text-zinc-500">פחמימות</div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              {formatNumber(meal.totalFat, 1)}g
            </div>
            <div className="text-xs text-zinc-500">שומן</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
