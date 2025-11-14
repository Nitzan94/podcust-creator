'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { MealCard } from '@/components/meals/meal-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockMeals } from '@/lib/mock-data';

export default function MealsPage() {
  const [showForm, setShowForm] = useState(false);
  const [naturalInput, setNaturalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNaturalLanguageSubmit = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setNaturalInput('');
    setShowForm(false);
    alert('ארוחה נוספה בהצלחה! (דמו - ללא חיבור ל-DB)');
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

        {/* Add Meal Form - Enhanced */}
        {showForm && (
          <div className="bg-gradient-to-br from-cream/50 to-emerald/5 rounded-3xl p-8 border-2 border-emerald/20 shadow-2xl shadow-emerald/5">
            <div className="mb-6">
              <h2 className="font-serif text-3xl font-bold mb-2">הוסף ארוחה חדשה</h2>
              <p className="text-foreground/60">
                כתוב בשפה טבעית מה אכלת, ו-AI יפרסר את המידע
              </p>
            </div>
            <div className="space-y-6">
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
                  <Select id="meal-type">
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
          </div>
        )}

        {/* Meals List */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold">היסטוריית ארוחות</h2>

          {mockMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
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
