'use client';

import { useState } from 'react';
import { AddMealForm } from '@/components/meals/add-meal-form';
import { MealItem } from '@/components/meals/meal-item';
import { Card, CardContent } from '@/components/ui/card';

interface MealsClientProps {
  initialMeals: Array<{
    id: string;
    parsedText: string | null;
    timestamp: Date;
    totalCalories: string | null;
    totalProtein: string | null;
    totalCarbs: string | null;
    totalFat: string | null;
    items: Array<{
      quantity: string;
      unit: string;
      food: {
        nameHe: string;
      };
    }>;
  }>;
}

export function MealsClient({ initialMeals }: MealsClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
        <div>
          <h1 className="font-serif text-5xl font-bold mb-2">היומן שלי</h1>
          <p className="text-lg text-foreground/60">
            כל מה שאכלת היום
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-emerald hover:bg-emerald-dark text-white font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20"
        >
          {showForm ? 'ביטול' : '+ הוסף מזון'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && <AddMealForm onCancel={() => setShowForm(false)} />}

      {/* Meals List */}
      <div className="space-y-6">
        <h2 className="font-serif text-3xl font-bold">היסטוריה</h2>

        {initialMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialMeals.map((meal) => (
              <MealItem key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                עדיין לא הוספת מזונות היום
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                התחל לעקוב אחר מה שאתה אוכל!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-terracotta/10 to-golden/5 rounded-3xl p-8 border-2 border-terracotta/20">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">⚡</div>
          <h3 className="font-serif text-2xl font-bold">
            זיהוי חכם ומהיר
          </h3>
        </div>
        <div className="space-y-4 text-base">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <strong>REGEX מהיר:</strong> המערכת מנסה לזהות באופן מיידי בעזרת דפוסים
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <strong>AI חכם:</strong> אם צריך, המערכת משתמשת ב-AI לזיהוי מדויק יותר
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-golden text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <strong>חישוב אוטומטי:</strong> קלוריות ומקרו-נוטריינטים מחושבים מיידית
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
