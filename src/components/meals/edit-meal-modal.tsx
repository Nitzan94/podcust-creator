'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Food } from '@/types';
import api from '@/lib/api-client';

interface MealItem {
  id: string;
  quantity: number;
  unit: string;
  food: Food;
}

interface EditMealModalProps {
  mealId: string;
  initialName?: string;
  initialMealType?: string;
  initialItems: MealItem[];
  onClose: () => void;
  onSave: () => void;
}

export function EditMealModal({
  mealId,
  initialName = '',
  initialMealType = '',
  initialItems,
  onClose,
  onSave,
}: EditMealModalProps) {
  const [name, setName] = useState(initialName);
  const [mealType, setMealType] = useState(initialMealType);
  const [items, setItems] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], quantity: parseFloat(value) || 0 };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.length === 0) {
      alert('חייב להיות לפחות מזון אחד בארוחה');
      return;
    }

    setIsSaving(true);
    try {
      // Delete old meal
      await api.meals.delete(mealId);

      // Create new meal with updated data
      await api.meals.create({
        name,
        mealType: mealType || undefined,
        items: items.map((item) => ({
          foodId: item.food.id,
          quantity: item.quantity,
          unit: item.unit,
        })),
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('שגיאה בשמירה');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-serif text-3xl font-bold">ערוך ארוחה</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-foreground/5 w-10 h-10 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Name and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">שם הארוחה</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="אופציונלי"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">סוג ארוחה</Label>
              <Select
                id="edit-type"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="">בחר</option>
                <option value="breakfast">ארוחת בוקר</option>
                <option value="lunch">ארוחת צהריים</option>
                <option value="dinner">ארוחת ערב</option>
                <option value="snack">חטיף</option>
              </Select>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <Label>מזונות בארוחה</Label>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl"
              >
                <div className="flex-1">
                  <div className="font-bold">{item.food.nameHe}</div>
                  <div className="text-sm text-foreground/60">
                    {item.food.calories} קלוריות / {item.food.servingSize}
                    {item.food.servingUnit}
                  </div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="text-center"
                  />
                </div>
                <div className="text-sm text-foreground/60 w-16 text-center">
                  {item.unit}
                </div>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving || items.length === 0}
              className="flex-1 px-6 py-3 bg-emerald hover:bg-emerald-dark text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isSaving ? 'שומר...' : 'שמור שינויים'}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl transition-all"
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
