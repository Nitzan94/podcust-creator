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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ארוחות</h1>
            <p className="text-zinc-500 mt-1">
              עקוב אחר כל מה שאתה אוכל
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'ביטול' : '+ הוסף ארוחה'}
          </Button>
        </div>

        {/* Add Meal Form */}
        {showForm && (
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle>הוסף ארוחה חדשה</CardTitle>
              <CardDescription>
                כתוב בשפה טבעית מה אכלת, ו-AI יפרסר את המידע
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleNaturalLanguageSubmit}
                  disabled={!naturalInput.trim() || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span className="mr-2">מעבד...</span>
                    </>
                  ) : (
                    '🤖 פרסר עם AI והוסף'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">הארוחות שלי</h2>

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
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡</span>
              <span>כיצד לוגינג בשפה טבעית עובד?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>1. כתוב בחופשיות:</strong> פשוט תאר מה אכלת בעברית, כמו "ארוחת בוקר: 2 ביצים וטוסט"
            </p>
            <p>
              <strong>2. AI מפרסר:</strong> המערכת משתמשת ב-AI כדי לזהות מזונות, כמויות ויחידות
            </p>
            <p>
              <strong>3. TOON Format:</strong> חיסכון של 30-60% בעלויות AI בזכות פורמט מותאם
            </p>
            <p>
              <strong>4. חישוב אוטומטי:</strong> המערכת מחשבת קלוריות ומקרו-נוטריינטים אוטומטית
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
