'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { MealCard } from '@/components/meals/meal-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/api-client';
import type { Food } from '@/types';

type FormMode = 'ai' | 'manual';

interface SelectedFood {
  food: Food | null;
  quantity: string;
  unit: string;
  searchQuery: string;
  searchResults: Food[];
  showResults: boolean;
}

export default function MealsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('ai');
  const [naturalInput, setNaturalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mealType, setMealType] = useState('');
  const [mealName, setMealName] = useState('');
  const [meals, setMeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manual mode states
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const result = await api.meals.getAll();
      setMeals(result.meals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleNaturalLanguageSubmit = async () => {
    setIsProcessing(true);
    try {
      const parsed = await api.meals.parse(naturalInput);
      await api.meals.create({
        parsedText: naturalInput,
        mealType: mealType || undefined,
        name: mealName || undefined,
        items: parsed.mealData.items,
      });
      setNaturalInput('');
      setMealType('');
      setMealName('');
      setShowForm(false);
      await loadMeals();
      alert('ארוחה נוספה בהצלחה!');
    } catch (error) {
      console.error('Error:', error);
      alert('שגיאה בשמירת הארוחה');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFood = () => {
    setSelectedFoods([...selectedFoods, {
      food: null,
      quantity: '',
      unit: 'g',
      searchQuery: '',
      searchResults: [],
      showResults: false,
    }]);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleFoodSearch = async (index: number, query: string) => {
    const updated = [...selectedFoods];
    updated[index].searchQuery = query;
    updated[index].showResults = true;

    if (query.length >= 2) {
      try {
        const result = await api.foods.search(query, 10);
        updated[index].searchResults = result.foods;
      } catch (error) {
        console.error('Search error:', error);
        updated[index].searchResults = [];
      }
    } else {
      updated[index].searchResults = [];
    }

    setSelectedFoods(updated);
  };

  const handleSelectFood = (index: number, food: Food) => {
    const updated = [...selectedFoods];
    updated[index].food = food;
    updated[index].searchQuery = food.nameHe;
    updated[index].showResults = false;
    setSelectedFoods(updated);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...selectedFoods];
    updated[index].quantity = value;
    setSelectedFoods(updated);
  };

  const handleUnitChange = (index: number, value: string) => {
    const updated = [...selectedFoods];
    updated[index].unit = value;
    setSelectedFoods(updated);
  };

  const calculateNutrition = (food: Food, quantity: string, unit: string) => {
    const qty = parseFloat(quantity) || 0;
    const multiplier = qty / food.servingSize;
    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
    };
  };

  const handleManualSubmit = async () => {
    const validFoods = selectedFoods.filter(sf => {
      return sf.food !== null && sf.quantity && parseFloat(sf.quantity) > 0;
    });

    console.log('Selected foods:', selectedFoods);
    console.log('Valid foods:', validFoods);

    if (validFoods.length === 0) {
      alert('אנא הוסף לפחות מזון אחד עם כמות');
      return;
    }

    setIsProcessing(true);
    try {
      const items = validFoods.map(sf => ({
        foodId: sf.food!.id,
        quantity: parseFloat(sf.quantity),
        unit: sf.unit,
      }));

      console.log('Creating meal with items:', items);

      await api.meals.create({
        mealType: mealType || undefined,
        name: mealName || undefined,
        items,
      });

      setSelectedFoods([]);
      setMealType('');
      setMealName('');
      setShowForm(false);
      await loadMeals();
      alert('ארוחה נוספה בהצלחה!');
    } catch (error) {
      console.error('Error:', error);
      alert(`שגיאה בשמירת הארוחה: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-10">
        {/* Header - Editorial */}
        <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
          <div>
            <h1 className="font-serif text-5xl font-bold mb-2">הארוחות שלי</h1>
            <p className="text-lg text-foreground/60">
              עקוב אחר כל מה שאתה אוכל
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-emerald hover:bg-emerald-dark text-white font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20"
          >
            {showForm ? 'ביטול' : '+ הוסף ארוחה'}
          </button>
        </div>

        {/* Add Meal Form - Enhanced with Manual Mode */}
        {showForm && (
          <div className="bg-gradient-to-br from-cream/50 to-emerald/5 rounded-3xl p-8 border-2 border-emerald/20 shadow-2xl shadow-emerald/5">
            <div className="mb-6">
              <h2 className="font-serif text-3xl font-bold mb-2">הוסף ארוחה חדשה</h2>

              {/* Mode Selector */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setFormMode('ai')}
                  className={`px-6 py-2 font-bold rounded-xl transition-all ${
                    formMode === 'ai'
                      ? 'bg-emerald text-white shadow-lg'
                      : 'bg-white hover:bg-foreground/5 border-2 border-foreground/10'
                  }`}
                >
                  🤖 עם AI
                </button>
                <button
                  onClick={() => {
                    setFormMode('manual');
                    if (selectedFoods.length === 0) {
                      handleAddFood();
                    }
                  }}
                  className={`px-6 py-2 font-bold rounded-xl transition-all ${
                    formMode === 'manual'
                      ? 'bg-emerald text-white shadow-lg'
                      : 'bg-white hover:bg-foreground/5 border-2 border-foreground/10'
                  }`}
                >
                  ✍️ ידני
                </button>
              </div>
            </div>

            {formMode === 'ai' ? (
              /* AI Mode */
              <div className="space-y-6">
                <p className="text-foreground/60">
                  כתוב בשפה טבעית מה אכלת, ו-AI יפרסר את המידע
                </p>

                {/* Natural Language Input */}
                <div className="space-y-2">
                  <Label htmlFor="natural-input">
                    מה אכלת? 🗣️
                  </Label>
                  <Textarea
                    id="natural-input"
                    placeholder='לדוגמה: "2 ביצים וטוסט עם אבוקדו" או "עוף עם אורז וסלט"'
                    value={naturalInput}
                    onChange={(e) => setNaturalInput(e.target.value)}
                    rows={3}
                    className="text-lg"
                  />
                  <p className="text-sm text-zinc-500">
                    💡 טיפ: פשוט תאר מה אכלת, ה-AI יזהה את המזונות והכמויות
                  </p>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">סוג ארוחה (אופציונלי)</Label>
                    <Select
                      id="meal-type"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                    >
                      <option value="">בחר סוג ארוחה</option>
                      <option value="breakfast">ארוחת בוקר</option>
                      <option value="lunch">ארוחת צהריים</option>
                      <option value="dinner">ארוחת ערב</option>
                      <option value="snack">חטיף</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meal-name">שם הארוחה (אופציונלי)</Label>
                    <Input
                      id="meal-name"
                      placeholder="לדוגמה: ארוחת בוקר טיפוסית"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleNaturalLanguageSubmit}
                    disabled={!naturalInput.trim() || isProcessing}
                    className="flex-1 px-8 py-4 bg-emerald hover:bg-emerald-dark text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        <span>מעבד...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>🤖</span>
                        <span>פרסר עם AI והוסף</span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-4 bg-white hover:bg-foreground/5 border-2 border-foreground/10 hover:border-foreground/20 font-bold rounded-2xl transition-all"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              /* Manual Mode */
              <div className="space-y-6">
                <p className="text-foreground/60">
                  חפש והוסף מזונות מהמאגר, הכנס כמויות ידנית
                </p>

                {/* Food Items */}
                <div className="space-y-4">
                  {selectedFoods.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 border-2 border-foreground/10 space-y-3">
                      <div className="flex gap-2 items-start">
                        {/* Food Search */}
                        <div className="flex-1 space-y-2 relative">
                          <Label htmlFor={`food-${index}`}>מזון {index + 1}</Label>
                          <Input
                            id={`food-${index}`}
                            placeholder="חפש מזון... (לפחות 2 תווים)"
                            value={item.searchQuery}
                            onChange={(e) => handleFoodSearch(index, e.target.value)}
                            onFocus={() => {
                              if (item.searchResults.length > 0) {
                                const updated = [...selectedFoods];
                                updated[index].showResults = true;
                                setSelectedFoods(updated);
                              }
                            }}
                          />

                          {/* Search Results Dropdown */}
                          {item.showResults && item.searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-emerald rounded-xl shadow-2xl max-h-60 overflow-auto">
                              {item.searchResults.map((food) => (
                                <button
                                  key={food.id}
                                  onClick={() => handleSelectFood(index, food)}
                                  className="w-full px-4 py-3 text-right hover:bg-emerald/10 transition-colors border-b border-foreground/5 last:border-0"
                                >
                                  <div className="font-bold">{food.nameHe}</div>
                                  <div className="text-sm text-foreground/60">
                                    {food.calories} קלוריות | {food.protein}g חלבון | {food.servingSize}{food.servingUnit}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="w-32 space-y-2">
                          <Label htmlFor={`quantity-${index}`}>כמות</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            placeholder="100"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                          />
                        </div>

                        {/* Unit */}
                        <div className="w-24 space-y-2">
                          <Label htmlFor={`unit-${index}`}>יחידה</Label>
                          <Select
                            id={`unit-${index}`}
                            value={item.unit}
                            onChange={(e) => handleUnitChange(index, e.target.value)}
                          >
                            <option value="g">גרם</option>
                            <option value="ml">מ"ל</option>
                            <option value="unit">יחידה</option>
                            <option value="cup">כוס</option>
                            <option value="tbsp">כף</option>
                          </Select>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFood(index)}
                          className="mt-7 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Nutrition Info */}
                      {item.food && item.quantity && (
                        <div className="bg-emerald/5 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                          <div>
                            <div className="text-xs text-foreground/60">קלוריות</div>
                            <div className="font-bold text-emerald">
                              {calculateNutrition(item.food, item.quantity, item.unit).calories}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/60">חלבון</div>
                            <div className="font-bold text-emerald">
                              {calculateNutrition(item.food, item.quantity, item.unit).protein}g
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/60">פחמימות</div>
                            <div className="font-bold text-emerald">
                              {calculateNutrition(item.food, item.quantity, item.unit).carbs}g
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/60">שומן</div>
                            <div className="font-bold text-emerald">
                              {calculateNutrition(item.food, item.quantity, item.unit).fat}g
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleAddFood}
                    className="w-full px-4 py-3 bg-white hover:bg-foreground/5 border-2 border-dashed border-foreground/20 hover:border-emerald font-bold rounded-2xl transition-all"
                  >
                    + הוסף מזון
                  </button>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type-manual">סוג ארוחה (אופציונלי)</Label>
                    <Select
                      id="meal-type-manual"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                    >
                      <option value="">בחר סוג ארוחה</option>
                      <option value="breakfast">ארוחת בוקר</option>
                      <option value="lunch">ארוחת צהריים</option>
                      <option value="dinner">ארוחת ערב</option>
                      <option value="snack">חטיף</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meal-name-manual">שם הארוחה (אופציונלי)</Label>
                    <Input
                      id="meal-name-manual"
                      placeholder="לדוגמה: ארוחת בוקר טיפוסית"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleManualSubmit}
                    disabled={selectedFoods.length === 0 || isProcessing}
                    className="flex-1 px-8 py-4 bg-emerald hover:bg-emerald-dark text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        <span>שומר...</span>
                      </span>
                    ) : (
                      <span>✅ שמור ארוחה</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setSelectedFoods([]);
                    }}
                    className="px-6 py-4 bg-white hover:bg-foreground/5 border-2 border-foreground/10 hover:border-foreground/20 font-bold rounded-2xl transition-all"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meals List */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold">היסטוריית ארוחות</h2>

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  טוען ארוחות...
                </p>
              </CardContent>
            </Card>
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
                  עדיין לא נוספו ארוחות
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  התחל לעקוב אחר התזונה שלך עכשיו!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-terracotta/10 to-golden/5 rounded-3xl p-8 border-2 border-terracotta/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">💡</div>
            <h3 className="font-serif text-2xl font-bold">
              כיצד לוגינג בשפה טבעית עובד?
            </h3>
          </div>
          <div className="space-y-4 text-base">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold">1</div>
              <div>
                <strong>כתוב בחופשיות:</strong> פשוט תאר מה אכלת בעברית, כמו "ארוחת בוקר: 2 ביצים וטוסט"
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center font-bold">2</div>
              <div>
                <strong>AI מפרסר:</strong> המערכת משתמשת ב-AI כדי לזהות מזונות, כמויות ויחידות
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-golden text-white flex items-center justify-center font-bold">3</div>
              <div>
                <strong>חישוב אוטומטי:</strong> המערכת מחשבת קלוריות ומקרו-נוטריינטים אוטומטית
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
