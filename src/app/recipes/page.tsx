'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockRecipes } from '@/lib/mock-data';

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'breakfast', label: 'בוקר' },
    { value: 'lunch', label: 'צהריים' },
    { value: 'dinner', label: 'ערב' },
    { value: 'snack', label: 'חטיף' },
    { value: 'dessert', label: 'קינוח' },
    { value: 'drink', label: 'משקה' },
  ];

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.nameHe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.includes(searchQuery));

    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">מתכונים</h1>
            <p className="text-zinc-500 mt-1">
              חפש, צור ושמור מתכונים אישיים
            </p>
          </div>
          <Button size="lg">
            🤖 צור מתכון עם AI
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="search"
              placeholder="חפש מתכון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              🔍
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? 'success' : 'default'}
                className="cursor-pointer hover:opacity-80 transition-opacity px-4 py-2"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                לא נמצאו מתכונים
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                נסה לשנות את מונחי החיפוש או הפילטרים
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Recipe Generator Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤖✨</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  גנרטור מתכונים חכם עם AI
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                  יש לך מרכיבים בבית ולא יודע מה להכין? תן ל-AI ליצור מתכון מותאם אישית בשבילך!
                </p>
                <ul className="text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li>✅ הזן רכיבים זמינים או העדפות תזונתיות</li>
                  <li>✅ AI מייצר מתכון מלא עם הוראות הכנה</li>
                  <li>✅ חישוב אוטומטי של ערכים תזונתיים</li>
                  <li>✅ שמור למועדפים לשימוש חוזר</li>
                </ul>
                <Button className="mt-4" variant="outline">
                  נסה עכשיו →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{mockRecipes.length}</div>
              <div className="text-sm text-zinc-500 mt-1">מתכונים שמורים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {mockRecipes.filter(r => r.isPublic).length}
              </div>
              <div className="text-sm text-zinc-500 mt-1">מתכונים ציבוריים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {mockRecipes.filter(r => r.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-zinc-500 mt-1">מתכונים קלים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {mockRecipes.reduce((sum, r) => sum + r.ingredients.length, 0)}
              </div>
              <div className="text-sm text-zinc-500 mt-1">סה"כ מרכיבים</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
