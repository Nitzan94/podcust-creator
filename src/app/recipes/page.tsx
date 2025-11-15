import { MainLayout } from '@/components/layout/main-layout';
import { getRecipes } from './actions';
import { RecipesClient } from './recipes-client';

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <MainLayout>
      <RecipesClient initialRecipes={recipes} />
    </MainLayout>
  );
}
