'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meal } from '@/types';
import { formatTime, getMealTypeHebrew, formatNumber } from '@/lib/utils';
import { EditMealModal } from './edit-meal-modal';
import api from '@/lib/api-client';

interface MealCardProps {
  meal: Meal;
  onDelete?: () => void;
}

export function MealCard({ meal, onDelete }: MealCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.meals.delete(meal.id);
      onDelete?.();
    } catch (error) {
      console.error('Delete error:', error);
      alert('שגיאה במחיקה');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow relative group">
        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-sm transition-colors"
            title="ערוך"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-white hover:bg-red-50 border border-red-200 rounded-lg shadow-sm transition-colors"
            title="מחק"
          >
            🗑️
          </button>
        </div>

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

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 mb-2">בטוח שברצונך למחוק ארוחה זו?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'מוחק...' : 'מחק'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-sm font-bold rounded-lg transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {showEdit && (
        <EditMealModal
          mealId={meal.id}
          initialName={meal.name}
          initialMealType={meal.mealType}
          initialItems={meal.items}
          onClose={() => setShowEdit(false)}
          onSave={() => {
            setShowEdit(false);
            onDelete?.(); // Refresh the list
          }}
        />
      )}
    </>
  );
}
