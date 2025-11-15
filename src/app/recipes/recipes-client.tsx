'use client';

import { useState, useTransition } from 'react';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateRecipeWithAI, createRecipe } from './actions';
import { useRouter } from 'next/navigation';
import api from '@/lib/api-client';

interface RecipesClientProps {
  initialRecipes: Array<any>;
}

export function RecipesClient({ initialRecipes }: RecipesClientProps) {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'breakfast', label: 'בוקר' },
    { value: 'lunch', label: 'צהריים' },
    { value: 'dinner', label: 'ערב' },
    { value: 'snack', label: 'חטיף' },
    { value: 'dessert', label: 'קינוח' },
    { value: 'salad', label: 'סלט' },
    { value: 'soup', label: 'מרק' },
  ];

  const filteredRecipes = initialRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.nameHe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleGenerateRecipe = () => {
    if (!aiPrompt.trim()) {
      alert('אנא הזן תיאור למתכון');
      return;
    }

    startTransition(async () => {
      try {
        const recipeData = await generateRecipeWithAI(aiPrompt);

        // Match ingredients to DB
        const ingredientsWithIds = await Promise.all(
          recipeData.ingredients.map(async (ing: any) => {
            try {
              const result = await api.foods.search(ing.name, 1);
              if (result.foods.length > 0) {
                return {
                  foodId: result.foods[0].id,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  notes: ing.notes,
                };
              }
              return null;
            } catch {
              return null;
            }
          })
        );

        const validIngredients = ingredientsWithIds.filter((ing) => ing !== null);

        if (validIngredients.length === 0) {
          alert('לא הצלחתי למצוא מרכיבים מתאימים במאגר');
          return;
        }

        // Create recipe
        await createRecipe({
          ...recipeData,
          ingredients: validIngredients,
        });

        setAiPrompt('');
        setShowAIGenerator(false);
        router.refresh();
        alert('מתכון נוצר בהצלחה!');
      } catch (error) {
        console.error('Error generating recipe:', error);
        alert('שגיאה ביצירת מתכון. נסה שוב.');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl font-bold">מתכונים</h1>
          <p className="text-lg text-foreground/60 mt-2">
            חפש, צור ושמור מתכונים אישיים
          </p>
        </div>
        <button
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all hover:scale-105"
        >
          🤖 {showAIGenerator ? 'ביטול' : 'צור מתכון עם AI'}
        </button>
      </div>

      {/* AI Generator */}
      {showAIGenerator && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-8">
            <h2 className="font-serif text-3xl font-bold mb-4">צור מתכון עם AI</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">תאר את המתכון שאתה רוצה</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder='לדוגמה: "מתכון לסלט חלבוני עם חזה עוף וקינואה" או "קינוח בריא ללא סוכר"'
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="mt-2 bg-white"
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateRecipe}
                  disabled={!aiPrompt.trim() || isPending}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {isPending ? 'יוצר מתכון...' : '✨ צור מתכון'}
                </button>
                <button
                  onClick={() => setShowAIGenerator(false)}
                  disabled={isPending}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl transition-all"
                >
                  ביטול
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="חפש מתכון..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">
            🔍
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === category.value
                  ? 'bg-emerald text-white'
                  : 'bg-white hover:bg-foreground/5 border-2 border-foreground/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={() => router.refresh()} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {initialRecipes.length === 0 ? 'אין מתכונים עדיין' : 'לא נמצאו מתכונים'}
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              {initialRecipes.length === 0
                ? 'צור מתכון ראשון עם AI!'
                : 'נסה לשנות את מונחי החיפוש'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {initialRecipes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-emerald">{initialRecipes.length}</div>
              <div className="text-sm text-foreground/50 mt-1">מתכונים שמורים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {initialRecipes.filter((r) => r.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-foreground/50 mt-1">מתכונים קלים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(
                  initialRecipes.reduce(
                    (sum, r) => sum + parseFloat(r.caloriesPerServing || '0'),
                    0
                  ) / initialRecipes.length
                )}
              </div>
              <div className="text-sm text-foreground/50 mt-1">ממוצע קלוריות</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {initialRecipes.reduce((sum, r) => sum + r.ingredients.length, 0)}
              </div>
              <div className="text-sm text-foreground/50 mt-1">סה"כ מרכיבים</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
