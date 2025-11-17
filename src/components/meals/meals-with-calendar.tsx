'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { MealCard } from '@/components/meals/meal-card';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api-client';

interface Meal {
  id: string;
  userId: string;
  name?: string;
  parsedText?: string;
  mealType?: string;
  timestamp: string;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  totalFiber?: number;
  items: Array<{
    quantity: number;
    unit: string;
    food: {
      nameHe: string;
      nameEn?: string;
    };
  }>;
}

export function MealsWithCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const result = await api.meals.getAll(dateStr);
      setMeals((result.meals || []).map(m => ({ ...m, timestamp: typeof m.timestamp === 'string' ? m.timestamp : m.timestamp.toISOString() })));
    } catch (error) {
      console.error('Failed to load meals:', error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.totalCalories || 0),
      protein: acc.protein + (meal.totalProtein || 0),
      carbs: acc.carbs + (meal.totalCarbs || 0),
      fat: acc.fat + (meal.totalFat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Daily Summary */}
      {meals.length > 0 && (
        <div className="bg-gradient-to-br from-emerald/10 to-emerald/5 rounded-2xl p-6 border-2 border-emerald/20">
          <div className="text-sm font-bold text-emerald mb-2">סיכום יומי</div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-foreground/60">קלוריות</div>
              <div className="text-2xl font-bold text-emerald">{Math.round(totalStats.calories)}</div>
            </div>
            <div>
              <div className="text-xs text-foreground/60">חלבון</div>
              <div className="text-2xl font-bold">{Math.round(totalStats.protein)}g</div>
            </div>
            <div>
              <div className="text-xs text-foreground/60">פחמימות</div>
              <div className="text-2xl font-bold">{Math.round(totalStats.carbs)}g</div>
            </div>
            <div>
              <div className="text-xs text-foreground/60">שומן</div>
              <div className="text-2xl font-bold">{Math.round(totalStats.fat)}g</div>
            </div>
          </div>
        </div>
      )}

      {/* Meals List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-foreground/60">טוען...</p>
        </div>
      ) : meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={loadMeals} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              אין ארוחות בתאריך זה
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              הוסף ארוחה חדשה כדי להתחיל לעקוב
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
