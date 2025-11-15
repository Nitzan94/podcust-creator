'use client';

import { useState, useTransition } from 'react';
import { deleteMeal } from '@/app/meals/actions';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

interface MealItemProps {
  meal: {
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
  };
}

export function MealItem({ meal }: MealItemProps) {
  const [isPending, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteMeal(meal.id);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'אירעה שגיאה במחיקה');
      }
    });
  };

  const time = new Date(meal.timestamp).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="text-sm text-foreground/50 mb-1">{time}</div>
          {meal.parsedText && (
            <div className="text-lg font-medium mb-2">{meal.parsedText}</div>
          )}
        </div>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
          disabled={isPending}
        >
          🗑️
        </button>
      </div>

      {/* Food Items */}
      <div className="space-y-2 mb-4">
        {meal.items.map((item, idx) => (
          <div key={idx} className="text-sm text-foreground/70 flex gap-2">
            <span>•</span>
            <span>
              {item.food.nameHe} - {item.quantity} {item.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-foreground/10">
        <div className="text-center">
          <div className="text-xs text-foreground/50">קלוריות</div>
          <div className="font-bold text-emerald">
            {Math.round(parseFloat(meal.totalCalories || '0'))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-foreground/50">חלבון</div>
          <div className="font-bold">
            {Math.round(parseFloat(meal.totalProtein || '0'))}g
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-foreground/50">פחמימות</div>
          <div className="font-bold">
            {Math.round(parseFloat(meal.totalCarbs || '0'))}g
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-foreground/50">שומן</div>
          <div className="font-bold">
            {Math.round(parseFloat(meal.totalFat || '0'))}g
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 mb-2">בטוח שברצונך למחוק?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'מוחק...' : 'מחק'}
            </button>
            <button
              onClick={() => setShowDelete(false)}
              disabled={isPending}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-sm font-bold rounded-lg transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
