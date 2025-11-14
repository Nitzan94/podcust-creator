import { MainLayout } from '@/components/layout/main-layout';
import { NutritionCard } from '@/components/nutrition/nutrition-card';
import { MacrosChart } from '@/components/nutrition/macros-chart';
import { MealCard } from '@/components/meals/meal-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUser, mockDailyStats } from '@/lib/mock-data';
import { getGreeting, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = mockDailyStats;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {mockUser.name}! 👋
            </h1>
            <p className="text-zinc-500 mt-1">
              {formatDate(new Date())}
            </p>
          </div>
          <Link href="/meals">
            <Button size="lg">
              + הוסף ארוחה
            </Button>
          </Link>
        </div>

        {/* Nutrition Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NutritionCard
            title="קלוריות"
            current={stats.calories}
            goal={mockUser.dailyCalorieGoal}
            unit="kcal"
            icon="🔥"
          />
          <NutritionCard
            title="חלבון"
            current={stats.protein}
            goal={mockUser.proteinGoal}
            unit="g"
            icon="💪"
          />
          <NutritionCard
            title="פחמימות"
            current={stats.carbs}
            goal={mockUser.carbsGoal}
            unit="g"
            icon="🍞"
          />
          <NutritionCard
            title="שומנים"
            current={stats.fat}
            goal={mockUser.fatGoal}
            unit="g"
            icon="🥑"
          />
        </div>

        {/* Macros Distribution */}
        <MacrosChart
          protein={stats.protein}
          carbs={stats.carbs}
          fat={stats.fat}
        />

        {/* Today's Meals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ארוחות היום</CardTitle>
              <Link href="/meals">
                <Button variant="ghost" size="sm">
                  צפה בהכל ←
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.meals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-lg font-medium">עדיין לא נוספו ארוחות היום</p>
                <p className="text-sm mt-2">התחל לעקוב אחר התזונה שלך עכשיו!</p>
                <Link href="/meals">
                  <Button className="mt-4">
                    הוסף ארוחה ראשונה
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/meals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🗣️</span>
                  <span>לוג מזון</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">
                  הזן מה אכלת בשפה טבעית
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recipes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  <span>מתכונים</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">
                  חפש או צור מתכונים חדשים
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span>מטרות</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">
                  עדכן את המטרות התזונתיות שלך
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
