'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockUser } from '@/lib/mock-data';

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('הגדרות נשמרו בהצלחה! (דמו - ללא חיבור ל-DB)');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">פרופיל והגדרות</h1>
          <p className="text-zinc-500 mt-1">
            נהל את המידע האישי ומטרות התזונה שלך
          </p>
        </div>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>מידע אישי</CardTitle>
            <CardDescription>
              עדכן את פרטי החשבון שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Goals */}
        <Card>
          <CardHeader>
            <CardTitle>מטרות תזונה יומיות</CardTitle>
            <CardDescription>
              הגדר את היעדים התזונתיים שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">
                  🔥 קלוריות (kcal)
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={user.dailyCalorieGoal}
                  onChange={(e) => setUser({ ...user, dailyCalorieGoal: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">
                  💪 חלבון (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  value={user.proteinGoal}
                  onChange={(e) => setUser({ ...user, proteinGoal: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbs">
                  🍞 פחמימות (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  value={user.carbsGoal}
                  onChange={(e) => setUser({ ...user, carbsGoal: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat">
                  🥑 שומנים (g)
                </Label>
                <Input
                  id="fat"
                  type="number"
                  value={user.fatGoal}
                  onChange={(e) => setUser({ ...user, fatGoal: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiber">
                  🌾 סיבים תזונתיים (g)
                </Label>
                <Input
                  id="fiber"
                  type="number"
                  value={user.fiberGoal}
                  onChange={(e) => setUser({ ...user, fiberGoal: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Label className="mb-3 block">תבניות מוכנות:</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setUser({
                    ...user,
                    dailyCalorieGoal: 1800,
                    proteinGoal: 120,
                    carbsGoal: 150,
                    fatGoal: 60,
                    fiberGoal: 25,
                  })}
                >
                  🏃 ירידה במשקל
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUser({
                    ...user,
                    dailyCalorieGoal: 2500,
                    proteinGoal: 180,
                    carbsGoal: 250,
                    fatGoal: 80,
                    fiberGoal: 30,
                  })}
                >
                  💪 בניית שריר
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUser({
                    ...user,
                    dailyCalorieGoal: 2000,
                    proteinGoal: 150,
                    carbsGoal: 200,
                    fatGoal: 70,
                    fiberGoal: 30,
                  })}
                >
                  ⚖️ שמירה על משקל
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Settings */}
        <Card>
          <CardHeader>
            <CardTitle>הגדרות AI</CardTitle>
            <CardDescription>
              בחר את ספק ה-AI המועדף עליך
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">ספק AI</Label>
              <Select id="ai-provider">
                <option value="gemini">Google Gemini (חינמי מומלץ!)</option>
                <option value="openai">OpenAI GPT-4</option>
                <option value="anthropic">Anthropic Claude</option>
              </Select>
              <p className="text-sm text-zinc-500">
                💡 Gemini מספק API חינמי מעולה לפרסור מזון
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="flex-1"
          >
            {isSaving ? '💾 שומר...' : '💾 שמור שינויים'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setUser(mockUser)}
          >
            ביטול
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
