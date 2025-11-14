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
      <div className="space-y-12">
        {/* Header - Editorial Style */}
        <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-emerald">
              {formatDate(new Date())}
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
              {getGreeting()},
              <br />
              <span className="text-emerald">{mockUser.name}</span>
            </h1>
          </div>
          <Link href="/meals">
            <button className="group px-6 py-3 bg-emerald hover:bg-emerald-dark text-white font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20">
              <span className="flex items-center gap-2">
                + הוסף ארוחה
              </span>
            </button>
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

        {/* Quick Actions - Magazine Grid */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-6">פעולות מהירות</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/meals" className="group">
              <div className="relative h-48 bg-gradient-to-br from-emerald/10 to-emerald/5 rounded-3xl p-8 border-2 border-emerald/20 hover:border-emerald/40 transition-all hover:shadow-2xl hover:shadow-emerald/10 hover:-translate-y-1">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🗣️</div>
                <h3 className="font-serif text-2xl font-bold mb-2">לוג מזון</h3>
                <p className="text-sm text-foreground/60">
                  הזן מה אכלת בשפה טבעית
                </p>
                <div className="absolute bottom-6 left-6 text-emerald opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Link>

            <Link href="/recipes" className="group">
              <div className="relative h-48 bg-gradient-to-br from-terracotta/10 to-terracotta/5 rounded-3xl p-8 border-2 border-terracotta/20 hover:border-terracotta/40 transition-all hover:shadow-2xl hover:shadow-terracotta/10 hover:-translate-y-1">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">📖</div>
                <h3 className="font-serif text-2xl font-bold mb-2">מתכונים</h3>
                <p className="text-sm text-foreground/60">
                  חפש או צור מתכונים חדשים
                </p>
                <div className="absolute bottom-6 left-6 text-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Link>

            <Link href="/profile" className="group">
              <div className="relative h-48 bg-gradient-to-br from-golden/10 to-golden/5 rounded-3xl p-8 border-2 border-golden/20 hover:border-golden/40 transition-all hover:shadow-2xl hover:shadow-golden/10 hover:-translate-y-1">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="font-serif text-2xl font-bold mb-2">מטרות</h3>
                <p className="text-sm text-foreground/60">
                  עדכן את המטרות התזונתיות שלך
                </p>
                <div className="absolute bottom-6 left-6 text-golden opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
