/**
 * USDA Food Seeding Script
 * Seeds the database with common foods from USDA FoodData Central
 *
 * Usage: tsx scripts/seed-usda.ts
 */

import { db, foods } from '@/lib/db';
import { searchUSDAFoods, convertUSDAToOurFormat } from '@/lib/usda';

// Common foods to import - Hebrew names mapped to USDA search terms
const COMMON_FOODS = [
  // Proteins
  { nameHe: 'ביצה', searchTerm: 'egg whole raw', category: 'protein' },
  { nameHe: 'חזה עוף', searchTerm: 'chicken breast', category: 'protein' },
  { nameHe: 'סטייק בקר', searchTerm: 'beef steak', category: 'protein' },
  { nameHe: 'סלמון', searchTerm: 'salmon', category: 'protein' },
  { nameHe: 'טונה', searchTerm: 'tuna', category: 'protein' },
  { nameHe: 'חזה הודו', searchTerm: 'turkey breast', category: 'protein' },

  // Dairy - Multiple fat percentages
  { nameHe: 'חלב 3%', searchTerm: 'milk whole 3.25', category: 'dairy' },
  { nameHe: 'חלב 1%', searchTerm: 'milk 1% fat', category: 'dairy' },
  { nameHe: 'חלב רזה', searchTerm: 'milk nonfat skim', category: 'dairy' },

  { nameHe: 'קוטג׳ 9%', searchTerm: 'cottage cheese creamed large curd', category: 'dairy' },
  { nameHe: 'קוטג׳ 5%', searchTerm: 'cottage cheese lowfat 2%', category: 'dairy' },
  { nameHe: 'קוטג׳ 3%', searchTerm: 'cottage cheese lowfat 1%', category: 'dairy' },
  { nameHe: 'קוטג׳ 0%', searchTerm: 'cottage cheese nonfat', category: 'dairy' },

  { nameHe: 'יוגורט יווני 0%', searchTerm: 'greek yogurt nonfat plain', category: 'dairy' },
  { nameHe: 'יוגורט יווני 2%', searchTerm: 'greek yogurt lowfat plain', category: 'dairy' },
  { nameHe: 'יוגורט יווני 5%', searchTerm: 'greek yogurt plain', category: 'dairy' },

  { nameHe: 'יוגורט רגיל 3%', searchTerm: 'yogurt plain whole milk', category: 'dairy' },
  { nameHe: 'יוגורט רגיל 1.5%', searchTerm: 'yogurt plain low fat', category: 'dairy' },

  { nameHe: 'גבינה צהובה', searchTerm: 'cheddar cheese', category: 'dairy' },
  { nameHe: 'גבינה לבנה 5%', searchTerm: 'cream cheese', category: 'dairy' },
  { nameHe: 'גבינה בולגרית 5%', searchTerm: 'feta cheese', category: 'dairy' },
  { nameHe: 'גבינת מוצרלה', searchTerm: 'mozzarella cheese', category: 'dairy' },

  // Grains & Carbs
  { nameHe: 'אורז לבן', searchTerm: 'white rice cooked', category: 'grains' },
  { nameHe: 'אורז חום', searchTerm: 'brown rice cooked', category: 'grains' },
  { nameHe: 'אורז בסמטי', searchTerm: 'basmati rice cooked', category: 'grains' },

  { nameHe: 'לחם מלא', searchTerm: 'whole wheat bread', category: 'grains' },
  { nameHe: 'לחם לבן', searchTerm: 'white bread', category: 'grains' },
  { nameHe: 'טוסט', searchTerm: 'toast white bread', category: 'grains' },
  { nameHe: 'פיתה', searchTerm: 'pita bread', category: 'grains' },
  { nameHe: 'בגט', searchTerm: 'french bread', category: 'grains' },

  { nameHe: 'פסטה', searchTerm: 'pasta cooked', category: 'grains' },
  { nameHe: 'פסטה מלאה', searchTerm: 'whole wheat pasta cooked', category: 'grains' },

  { nameHe: 'קינואה', searchTerm: 'quinoa cooked', category: 'grains' },
  { nameHe: 'שיבולת שועל', searchTerm: 'oats', category: 'grains' },
  { nameHe: 'כוסמת', searchTerm: 'bulgur cooked', category: 'grains' },
  { nameHe: 'קוסקוס', searchTerm: 'couscous cooked', category: 'grains' },

  // Vegetables
  { nameHe: 'עגבניה', searchTerm: 'tomato raw', category: 'vegetables' },
  { nameHe: 'מלפפון', searchTerm: 'cucumber raw', category: 'vegetables' },
  { nameHe: 'חסה', searchTerm: 'lettuce', category: 'vegetables' },
  { nameHe: 'גזר', searchTerm: 'carrot raw', category: 'vegetables' },
  { nameHe: 'ברוקולי', searchTerm: 'broccoli raw', category: 'vegetables' },
  { nameHe: 'תפוח אדמה', searchTerm: 'potato', category: 'vegetables' },
  { nameHe: 'בטטה', searchTerm: 'sweet potato', category: 'vegetables' },
  { nameHe: 'פלפל', searchTerm: 'bell pepper', category: 'vegetables' },
  { nameHe: 'בצל', searchTerm: 'onion raw', category: 'vegetables' },
  { nameHe: 'שום', searchTerm: 'garlic raw', category: 'vegetables' },
  { nameHe: 'תרד', searchTerm: 'spinach raw', category: 'vegetables' },

  // Fruits
  { nameHe: 'בננה', searchTerm: 'banana', category: 'fruits' },
  { nameHe: 'תפוח', searchTerm: 'apple', category: 'fruits' },
  { nameHe: 'תפוז', searchTerm: 'orange', category: 'fruits' },
  { nameHe: 'אבטיח', searchTerm: 'watermelon', category: 'fruits' },
  { nameHe: 'אשכולית', searchTerm: 'grapefruit', category: 'fruits' },
  { nameHe: 'תות', searchTerm: 'strawberry', category: 'fruits' },
  { nameHe: 'אוכמניות', searchTerm: 'blueberry', category: 'fruits' },
  { nameHe: 'ענבים', searchTerm: 'grapes', category: 'fruits' },
  { nameHe: 'אגס', searchTerm: 'pear', category: 'fruits' },
  { nameHe: 'מנגו', searchTerm: 'mango', category: 'fruits' },

  // Nuts & Seeds
  { nameHe: 'שקדים', searchTerm: 'almonds', category: 'nuts' },
  { nameHe: 'אגוזי מלך', searchTerm: 'walnuts', category: 'nuts' },
  { nameHe: 'בוטנים', searchTerm: 'peanuts', category: 'nuts' },
  { nameHe: 'קשיו', searchTerm: 'cashews', category: 'nuts' },
  { nameHe: 'גרעיני חמניה', searchTerm: 'sunflower seeds', category: 'nuts' },
  { nameHe: 'גרעיני דלעת', searchTerm: 'pumpkin seeds', category: 'nuts' },
  { nameHe: 'חמאת בוטנים', searchTerm: 'peanut butter', category: 'nuts' },

  // Fats & Oils
  { nameHe: 'אבוקדו', searchTerm: 'avocado', category: 'fats' },
  { nameHe: 'שמן זית', searchTerm: 'olive oil', category: 'fats' },
  { nameHe: 'חמאה', searchTerm: 'butter', category: 'fats' },

  // Legumes
  { nameHe: 'חומוס (גרגרי)', searchTerm: 'chickpeas', category: 'legumes' },
  { nameHe: 'עדשים', searchTerm: 'lentils cooked', category: 'legumes' },
  { nameHe: 'שעועית שחורה', searchTerm: 'black beans', category: 'legumes' },
  { nameHe: 'פול', searchTerm: 'fava beans', category: 'legumes' },
];

interface SeedStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

async function seedFoods(): Promise<SeedStats> {
  const stats: SeedStats = {
    total: COMMON_FOODS.length,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  console.log('🌱 Starting USDA food seeding...\n');
  console.log(`📊 Total foods to import: ${stats.total}\n`);

  for (const food of COMMON_FOODS) {
    try {
      console.log(`🔍 Searching for: ${food.nameHe} (${food.searchTerm})...`);

      // Search USDA
      const result = await searchUSDAFoods({
        query: food.searchTerm,
        pageSize: 1,
      });

      if (result.foods.length === 0) {
        console.log(`   ⚠️  Not found in USDA\n`);
        stats.failed++;
        stats.errors.push(`${food.nameHe}: Not found in USDA`);
        continue;
      }

      // Convert to our format
      const usdaFood = result.foods[0];
      const convertedFood = convertUSDAToOurFormat(usdaFood);

      // Override with Hebrew name
      convertedFood.nameHe = food.nameHe;

      // Check if already exists
      const existing = await db.query.foods.findFirst({
        where: (foods, { eq, and }) =>
          and(
            eq(foods.nameHe, food.nameHe),
            eq(foods.source, 'usda')
          ),
      });

      if (existing) {
        console.log(`   ⏭️  Already exists, skipping\n`);
        stats.skipped++;
        continue;
      }

      // Insert into database
      await db.insert(foods).values(convertedFood);

      console.log(`   ✅ Added: ${food.nameHe}`);
      console.log(`      Calories: ${convertedFood.calories} | Protein: ${convertedFood.protein}g\n`);

      stats.success++;

      // Rate limiting - USDA allows 1000 requests/hour
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      stats.failed++;
      stats.errors.push(`${food.nameHe}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return stats;
}

// Run the seeding
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   USDA Food Database Seeding Script   ║');
  console.log('╚════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    const stats = await seedFoods();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║           Seeding Complete!            ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('📊 Statistics:');
    console.log(`   Total:    ${stats.total}`);
    console.log(`   ✅ Success: ${stats.success}`);
    console.log(`   ⏭️  Skipped: ${stats.skipped}`);
    console.log(`   ❌ Failed:  ${stats.failed}`);
    console.log(`   ⏱️  Duration: ${duration}s\n`);

    if (stats.errors.length > 0) {
      console.log('⚠️  Errors:');
      stats.errors.forEach(err => console.log(`   - ${err}`));
      console.log('');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
