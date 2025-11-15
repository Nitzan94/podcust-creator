/**
 * USDA Food Seeding Script
 * Seeds the database with common foods from USDA FoodData Central
 *
 * Usage: tsx scripts/seed-usda.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { db, foods } from '@/lib/db';
import { searchUSDAFoods, convertUSDAToOurFormat } from '@/lib/usda';

// Common foods to import - Hebrew names mapped to USDA search terms
const COMMON_FOODS = [
  // Proteins - Poultry
  { nameHe: 'ביצה', searchTerm: 'egg whole raw', category: 'protein' },
  { nameHe: 'ביצה מקושקשת', searchTerm: 'egg scrambled', category: 'protein' },
  { nameHe: 'חלבון ביצה', searchTerm: 'egg white', category: 'protein' },
  { nameHe: 'חלמון ביצה', searchTerm: 'egg yolk', category: 'protein' },
  { nameHe: 'חזה עוף טרי', searchTerm: 'chicken breast raw', category: 'protein' },
  { nameHe: 'חזה עוף מבושל', searchTerm: 'chicken breast cooked', category: 'protein' },
  { nameHe: 'שוק עוף טרי', searchTerm: 'chicken thigh raw', category: 'protein' },
  { nameHe: 'שוק עוף מבושל', searchTerm: 'chicken thigh cooked', category: 'protein' },
  { nameHe: 'כנפיים עוף', searchTerm: 'chicken wings', category: 'protein' },
  { nameHe: 'עוף שלם', searchTerm: 'chicken whole', category: 'protein' },
  { nameHe: 'חזה הודו טרי', searchTerm: 'turkey breast raw', category: 'protein' },
  { nameHe: 'חזה הודו מבושל', searchTerm: 'turkey breast cooked', category: 'protein' },
  { nameHe: 'הודו טחון', searchTerm: 'ground turkey', category: 'protein' },
  { nameHe: 'ברווז', searchTerm: 'duck meat', category: 'protein' },

  // Proteins - Beef & Lamb
  { nameHe: 'סטייק בקר טרי', searchTerm: 'beef steak raw', category: 'protein' },
  { nameHe: 'סטייק בקר מבושל', searchTerm: 'beef steak cooked', category: 'protein' },
  { nameHe: 'בשר בקר טחון טרי', searchTerm: 'ground beef raw', category: 'protein' },
  { nameHe: 'בשר בקר טחון מבושל', searchTerm: 'ground beef cooked', category: 'protein' },
  { nameHe: 'אנטריקוט טרי', searchTerm: 'beef ribeye raw', category: 'protein' },
  { nameHe: 'אנטריקוט מבושל', searchTerm: 'beef ribeye cooked', category: 'protein' },
  { nameHe: 'פילה בקר טרי', searchTerm: 'beef tenderloin raw', category: 'protein' },
  { nameHe: 'פילה בקר מבושל', searchTerm: 'beef tenderloin cooked', category: 'protein' },
  { nameHe: 'צלי בקר', searchTerm: 'beef roast', category: 'protein' },
  { nameHe: 'המבורגר', searchTerm: 'hamburger patty', category: 'protein' },
  { nameHe: 'כבש טרי', searchTerm: 'lamb meat raw', category: 'protein' },
  { nameHe: 'כבש מבושל', searchTerm: 'lamb meat cooked', category: 'protein' },
  { nameHe: 'טלה', searchTerm: 'lamb chops', category: 'protein' },

  // Proteins - Pork
  { nameHe: 'חזיר', searchTerm: 'pork loin', category: 'protein' },
  { nameHe: 'בייקון', searchTerm: 'bacon', category: 'protein' },
  { nameHe: 'נקניק', searchTerm: 'sausage', category: 'protein' },
  { nameHe: 'נקניקיות', searchTerm: 'hot dog', category: 'protein' },
  { nameHe: 'סלמי', searchTerm: 'salami', category: 'protein' },

  // Proteins - Fish & Seafood
  { nameHe: 'סלמון טרי', searchTerm: 'salmon raw', category: 'protein' },
  { nameHe: 'סלמון מבושל', searchTerm: 'salmon cooked', category: 'protein' },
  { nameHe: 'טונה טרייה', searchTerm: 'tuna raw', category: 'protein' },
  { nameHe: 'טונה מבושלת', searchTerm: 'tuna cooked', category: 'protein' },
  { nameHe: 'טונה משומרת במים', searchTerm: 'tuna canned water', category: 'protein' },
  { nameHe: 'קוד טרי', searchTerm: 'cod raw', category: 'protein' },
  { nameHe: 'קוד מבושל', searchTerm: 'cod cooked', category: 'protein' },
  { nameHe: 'דג מוסר טרי', searchTerm: 'tilapia raw', category: 'protein' },
  { nameHe: 'דג מוסר מבושל', searchTerm: 'tilapia cooked', category: 'protein' },
  { nameHe: 'הרינג', searchTerm: 'herring', category: 'protein' },
  { nameHe: 'סרדינים', searchTerm: 'sardines', category: 'protein' },
  { nameHe: 'דניס', searchTerm: 'sea bream', category: 'protein' },
  { nameHe: 'לברק', searchTerm: 'sea bass', category: 'protein' },
  { nameHe: 'שרימפס טרי', searchTerm: 'shrimp raw', category: 'protein' },
  { nameHe: 'שרימפס מבושל', searchTerm: 'shrimp cooked', category: 'protein' },
  { nameHe: 'דיונון', searchTerm: 'squid', category: 'protein' },
  { nameHe: 'סרטן', searchTerm: 'crab', category: 'protein' },
  { nameHe: 'צדפות', searchTerm: 'mussels', category: 'protein' },

  // Dairy - Milk
  { nameHe: 'חלב 3%', searchTerm: 'milk whole', category: 'dairy' },
  { nameHe: 'חלב 1%', searchTerm: 'milk 1%', category: 'dairy' },
  { nameHe: 'חלב רזה', searchTerm: 'skim milk', category: 'dairy' },
  { nameHe: 'חלב סויה', searchTerm: 'soy milk', category: 'dairy' },
  { nameHe: 'חלב שקדים', searchTerm: 'almond milk', category: 'dairy' },
  { nameHe: 'חלב קוקוס', searchTerm: 'coconut milk', category: 'dairy' },
  { nameHe: 'חלב שיבולת שועל', searchTerm: 'oat milk', category: 'dairy' },
  { nameHe: 'שמנת', searchTerm: 'heavy cream', category: 'dairy' },
  { nameHe: 'שמנת חמוצה', searchTerm: 'sour cream', category: 'dairy' },

  // Dairy - Yogurt
  { nameHe: 'יוגורט יווני', searchTerm: 'greek yogurt plain', category: 'dairy' },
  { nameHe: 'יוגורט רגיל', searchTerm: 'yogurt plain', category: 'dairy' },
  { nameHe: 'יוגורט רזה', searchTerm: 'yogurt low fat', category: 'dairy' },
  { nameHe: 'יוגורט פירות', searchTerm: 'yogurt fruit', category: 'dairy' },
  { nameHe: 'קפיר', searchTerm: 'kefir', category: 'dairy' },

  // Dairy - Cheese
  { nameHe: 'גבינה צהובה', searchTerm: 'cheddar cheese', category: 'dairy' },
  { nameHe: 'גבינת קוטג׳', searchTerm: 'cottage cheese', category: 'dairy' },
  { nameHe: 'גבינה לבנה 5%', searchTerm: 'cream cheese', category: 'dairy' },
  { nameHe: 'מוצרלה', searchTerm: 'mozzarella', category: 'dairy' },
  { nameHe: 'פרמזן', searchTerm: 'parmesan', category: 'dairy' },
  { nameHe: 'פטה', searchTerm: 'feta cheese', category: 'dairy' },
  { nameHe: 'גאודה', searchTerm: 'gouda', category: 'dairy' },
  { nameHe: 'בולגרית', searchTerm: 'bulgarian cheese', category: 'dairy' },
  { nameHe: 'צפתית', searchTerm: 'tzfat cheese', category: 'dairy' },
  { nameHe: 'ריקוטה', searchTerm: 'ricotta', category: 'dairy' },
  { nameHe: 'חלומי', searchTerm: 'halloumi', category: 'dairy' },
  { nameHe: 'גבינה כחולה', searchTerm: 'blue cheese', category: 'dairy' },
  { nameHe: 'ברי', searchTerm: 'brie', category: 'dairy' },
  { nameHe: 'קממבר', searchTerm: 'camembert', category: 'dairy' },
  { nameHe: 'גבינת עיזים', searchTerm: 'goat cheese', category: 'dairy' },

  // Grains & Carbs - Rice
  { nameHe: 'אורז לבן', searchTerm: 'white rice cooked', category: 'grains' },
  { nameHe: 'אורז חום', searchTerm: 'brown rice cooked', category: 'grains' },
  { nameHe: 'אורז בסמטי', searchTerm: 'basmati rice', category: 'grains' },
  { nameHe: 'אורז יסמין', searchTerm: 'jasmine rice', category: 'grains' },
  { nameHe: 'אורז פרא', searchTerm: 'wild rice', category: 'grains' },

  // Grains & Carbs - Bread
  { nameHe: 'לחם מלא', searchTerm: 'whole wheat bread', category: 'grains' },
  { nameHe: 'לחם לבן', searchTerm: 'white bread', category: 'grains' },
  { nameHe: 'לחם שיפון', searchTerm: 'rye bread', category: 'grains' },
  { nameHe: 'פיתה', searchTerm: 'pita bread', category: 'grains' },
  { nameHe: 'בגט', searchTerm: 'baguette', category: 'grains' },
  { nameHe: 'חלה', searchTerm: 'challah', category: 'grains' },
  { nameHe: 'טורטייה', searchTerm: 'tortilla', category: 'grains' },
  { nameHe: 'קרקר', searchTerm: 'crackers', category: 'grains' },

  // Grains & Carbs - Pasta & Noodles
  { nameHe: 'פסטה', searchTerm: 'pasta cooked', category: 'grains' },
  { nameHe: 'פסטה מלאה', searchTerm: 'whole wheat pasta', category: 'grains' },
  { nameHe: 'ספגטי', searchTerm: 'spaghetti', category: 'grains' },
  { nameHe: 'פנה', searchTerm: 'penne', category: 'grains' },
  { nameHe: 'פוזילי', searchTerm: 'fusilli', category: 'grains' },
  { nameHe: 'נודלס', searchTerm: 'noodles', category: 'grains' },
  { nameHe: 'נודלס אורז', searchTerm: 'rice noodles', category: 'grains' },
  { nameHe: 'אטריות סיניות', searchTerm: 'chinese noodles', category: 'grains' },

  // Grains & Carbs - Other Grains
  { nameHe: 'קינואה', searchTerm: 'quinoa cooked', category: 'grains' },
  { nameHe: 'שיבולת שועל', searchTerm: 'oats', category: 'grains' },
  { nameHe: 'דייסה', searchTerm: 'oatmeal', category: 'grains' },
  { nameHe: 'כוסמת', searchTerm: 'bulgur cooked', category: 'grains' },
  { nameHe: 'קוסקוס', searchTerm: 'couscous', category: 'grains' },
  { nameHe: 'שעורה', searchTerm: 'barley', category: 'grains' },
  { nameHe: 'פתיתי תירס', searchTerm: 'corn flakes', category: 'grains' },
  { nameHe: 'מוזלי', searchTerm: 'muesli', category: 'grains' },
  { nameHe: 'גרנולה', searchTerm: 'granola', category: 'grains' },
  { nameHe: 'ברקס', searchTerm: 'bran flakes', category: 'grains' },

  // Vegetables - Leafy Greens
  { nameHe: 'חסה', searchTerm: 'lettuce', category: 'vegetables' },
  { nameHe: 'תרד', searchTerm: 'spinach raw', category: 'vegetables' },
  { nameHe: 'קייל', searchTerm: 'kale', category: 'vegetables' },
  { nameHe: 'מנגולד', searchTerm: 'swiss chard', category: 'vegetables' },
  { nameHe: 'רוקט', searchTerm: 'arugula', category: 'vegetables' },
  { nameHe: 'עלי סלק', searchTerm: 'beet greens', category: 'vegetables' },

  // Vegetables - Cruciferous
  { nameHe: 'ברוקולי', searchTerm: 'broccoli raw', category: 'vegetables' },
  { nameHe: 'כרובית', searchTerm: 'cauliflower', category: 'vegetables' },
  { nameHe: 'כרוב', searchTerm: 'cabbage', category: 'vegetables' },
  { nameHe: 'כרוב סגול', searchTerm: 'red cabbage', category: 'vegetables' },
  { nameHe: 'כרוב ניצנים', searchTerm: 'brussels sprouts', category: 'vegetables' },
  { nameHe: 'קולרבי', searchTerm: 'kohlrabi', category: 'vegetables' },
  { nameHe: 'בוק צ\'וי', searchTerm: 'bok choy', category: 'vegetables' },

  // Vegetables - Root Vegetables
  { nameHe: 'גזר', searchTerm: 'carrot raw', category: 'vegetables' },
  { nameHe: 'תפוח אדמה', searchTerm: 'potato', category: 'vegetables' },
  { nameHe: 'בטטה', searchTerm: 'sweet potato', category: 'vegetables' },
  { nameHe: 'סלק', searchTerm: 'beets', category: 'vegetables' },
  { nameHe: 'צנון', searchTerm: 'radish', category: 'vegetables' },
  { nameHe: 'לפת', searchTerm: 'turnip', category: 'vegetables' },
  { nameHe: 'חצילים', searchTerm: 'eggplant', category: 'vegetables' },
  { nameHe: 'שורש פטרוזיליה', searchTerm: 'parsnip', category: 'vegetables' },

  // Vegetables - Fruits (botanical)
  { nameHe: 'עגבניה', searchTerm: 'tomato raw', category: 'vegetables' },
  { nameHe: 'מלפפון', searchTerm: 'cucumber raw', category: 'vegetables' },
  { nameHe: 'פלפל', searchTerm: 'bell pepper', category: 'vegetables' },
  { nameHe: 'פלפל אדום', searchTerm: 'red bell pepper', category: 'vegetables' },
  { nameHe: 'פלפל צהוב', searchTerm: 'yellow bell pepper', category: 'vegetables' },
  { nameHe: 'פלפל חריף', searchTerm: 'hot pepper', category: 'vegetables' },
  { nameHe: 'זוקיני', searchTerm: 'zucchini', category: 'vegetables' },
  { nameHe: 'דלעת', searchTerm: 'pumpkin', category: 'vegetables' },

  // Vegetables - Onions & Garlic
  { nameHe: 'בצל', searchTerm: 'onion raw', category: 'vegetables' },
  { nameHe: 'בצל ירוק', searchTerm: 'green onion', category: 'vegetables' },
  { nameHe: 'שום', searchTerm: 'garlic raw', category: 'vegetables' },
  { nameHe: 'כרישה', searchTerm: 'leek', category: 'vegetables' },
  { nameHe: 'שלוט', searchTerm: 'shallot', category: 'vegetables' },

  // Vegetables - Legumes (fresh)
  { nameHe: 'אפונה', searchTerm: 'peas', category: 'vegetables' },
  { nameHe: 'שעועית ירוקה', searchTerm: 'green beans', category: 'vegetables' },
  { nameHe: 'תרמילים', searchTerm: 'snap peas', category: 'vegetables' },
  { nameHe: 'אדמאמה', searchTerm: 'edamame', category: 'vegetables' },

  // Vegetables - Other
  { nameHe: 'תירס', searchTerm: 'corn', category: 'vegetables' },
  { nameHe: 'פטריות', searchTerm: 'mushrooms', category: 'vegetables' },
  { nameHe: 'פטריות שיטאקי', searchTerm: 'shiitake mushrooms', category: 'vegetables' },
  { nameHe: 'פטריות פורטובלו', searchTerm: 'portobello mushrooms', category: 'vegetables' },
  { nameHe: 'אספרגוס', searchTerm: 'asparagus', category: 'vegetables' },
  { nameHe: 'סלרי', searchTerm: 'celery', category: 'vegetables' },
  { nameHe: 'קישוא', searchTerm: 'squash', category: 'vegetables' },
  { nameHe: 'ארטישוק', searchTerm: 'artichoke', category: 'vegetables' },
  { nameHe: 'במיה', searchTerm: 'okra', category: 'vegetables' },

  // Fruits - Citrus
  { nameHe: 'תפוז', searchTerm: 'orange', category: 'fruits' },
  { nameHe: 'אשכולית', searchTerm: 'grapefruit', category: 'fruits' },
  { nameHe: 'לימון', searchTerm: 'lemon', category: 'fruits' },
  { nameHe: 'ליים', searchTerm: 'lime', category: 'fruits' },
  { nameHe: 'מנדרינה', searchTerm: 'mandarin', category: 'fruits' },
  { nameHe: 'קלמנטינה', searchTerm: 'clementine', category: 'fruits' },
  { nameHe: 'פומלה', searchTerm: 'pomelo', category: 'fruits' },

  // Fruits - Berries
  { nameHe: 'תות', searchTerm: 'strawberry', category: 'fruits' },
  { nameHe: 'אוכמניות', searchTerm: 'blueberry', category: 'fruits' },
  { nameHe: 'פטל', searchTerm: 'raspberry', category: 'fruits' },
  { nameHe: 'אוכמניות שחורות', searchTerm: 'blackberry', category: 'fruits' },
  { nameHe: 'חמוציות', searchTerm: 'cranberry', category: 'fruits' },
  { nameHe: 'דובדבן', searchTerm: 'cherry', category: 'fruits' },

  // Fruits - Tree Fruits
  { nameHe: 'תפוח', searchTerm: 'apple', category: 'fruits' },
  { nameHe: 'אגס', searchTerm: 'pear', category: 'fruits' },
  { nameHe: 'אפרסק', searchTerm: 'peach', category: 'fruits' },
  { nameHe: 'נקטרינה', searchTerm: 'nectarine', category: 'fruits' },
  { nameHe: 'שזיף', searchTerm: 'plum', category: 'fruits' },
  { nameHe: 'משמש', searchTerm: 'apricot', category: 'fruits' },

  // Fruits - Tropical
  { nameHe: 'בננה', searchTerm: 'banana', category: 'fruits' },
  { nameHe: 'מנגו', searchTerm: 'mango', category: 'fruits' },
  { nameHe: 'אננס', searchTerm: 'pineapple', category: 'fruits' },
  { nameHe: 'פפאיה', searchTerm: 'papaya', category: 'fruits' },
  { nameHe: 'קיווי', searchTerm: 'kiwi', category: 'fruits' },
  { nameHe: 'גויאבה', searchTerm: 'guava', category: 'fruits' },
  { nameHe: 'פסיפלורה', searchTerm: 'passion fruit', category: 'fruits' },
  { nameHe: 'ליצ\'י', searchTerm: 'lychee', category: 'fruits' },
  { nameHe: 'רמבוטן', searchTerm: 'rambutan', category: 'fruits' },
  { nameHe: 'דרגון פרוט', searchTerm: 'dragon fruit', category: 'fruits' },

  // Fruits - Melons
  { nameHe: 'אבטיח', searchTerm: 'watermelon', category: 'fruits' },
  { nameHe: 'מלון', searchTerm: 'cantaloupe', category: 'fruits' },
  { nameHe: 'מלון דבש', searchTerm: 'honeydew melon', category: 'fruits' },

  // Fruits - Grapes & Other
  { nameHe: 'ענבים', searchTerm: 'grapes', category: 'fruits' },
  { nameHe: 'ענבים אדומים', searchTerm: 'red grapes', category: 'fruits' },
  { nameHe: 'ענבים ירוקים', searchTerm: 'green grapes', category: 'fruits' },
  { nameHe: 'רימון', searchTerm: 'pomegranate', category: 'fruits' },
  { nameHe: 'תאנים', searchTerm: 'figs', category: 'fruits' },
  { nameHe: 'תמר', searchTerm: 'dates', category: 'fruits' },

  // Dried Fruits
  { nameHe: 'צימוקים', searchTerm: 'raisins', category: 'fruits' },
  { nameHe: 'משמש מיובש', searchTerm: 'dried apricot', category: 'fruits' },
  { nameHe: 'שזיף מיובש', searchTerm: 'prunes', category: 'fruits' },
  { nameHe: 'חמוציות מיובשות', searchTerm: 'dried cranberries', category: 'fruits' },
  { nameHe: 'תאנים מיובשים', searchTerm: 'dried figs', category: 'fruits' },

  // Nuts & Seeds
  { nameHe: 'שקדים', searchTerm: 'almonds', category: 'nuts' },
  { nameHe: 'אגוזי מלך', searchTerm: 'walnuts', category: 'nuts' },
  { nameHe: 'בוטנים', searchTerm: 'peanuts', category: 'nuts' },
  { nameHe: 'קשיו', searchTerm: 'cashews', category: 'nuts' },
  { nameHe: 'פיסטוק', searchTerm: 'pistachios', category: 'nuts' },
  { nameHe: 'אגוזי לוז', searchTerm: 'hazelnuts', category: 'nuts' },
  { nameHe: 'אגוזי פקאן', searchTerm: 'pecans', category: 'nuts' },
  { nameHe: 'אגוזי ברזיל', searchTerm: 'brazil nuts', category: 'nuts' },
  { nameHe: 'אגוזי מקדמיה', searchTerm: 'macadamia nuts', category: 'nuts' },
  { nameHe: 'גרעיני חמניה', searchTerm: 'sunflower seeds', category: 'nuts' },
  { nameHe: 'גרעיני דלעת', searchTerm: 'pumpkin seeds', category: 'nuts' },
  { nameHe: 'גרעיני שומשום', searchTerm: 'sesame seeds', category: 'nuts' },
  { nameHe: 'גרעיני פשתן', searchTerm: 'flax seeds', category: 'nuts' },
  { nameHe: 'גרעיני צ\'יה', searchTerm: 'chia seeds', category: 'nuts' },
  { nameHe: 'חמאת בוטנים', searchTerm: 'peanut butter', category: 'nuts' },
  { nameHe: 'חמאת שקדים', searchTerm: 'almond butter', category: 'nuts' },
  { nameHe: 'חמאת קשיו', searchTerm: 'cashew butter', category: 'nuts' },
  { nameHe: 'טחינה', searchTerm: 'tahini', category: 'nuts' },

  // Legumes - Beans
  { nameHe: 'חומוס (גרגרי)', searchTerm: 'chickpeas', category: 'legumes' },
  { nameHe: 'עדשים', searchTerm: 'lentils cooked', category: 'legumes' },
  { nameHe: 'עדשים אדומות', searchTerm: 'red lentils', category: 'legumes' },
  { nameHe: 'שעועית שחורה', searchTerm: 'black beans', category: 'legumes' },
  { nameHe: 'פול', searchTerm: 'fava beans', category: 'legumes' },
  { nameHe: 'שעועית לבנה', searchTerm: 'white beans', category: 'legumes' },
  { nameHe: 'שעועית אדומה', searchTerm: 'kidney beans', category: 'legumes' },
  { nameHe: 'שעועית פינטו', searchTerm: 'pinto beans', category: 'legumes' },
  { nameHe: 'שעועית נייבי', searchTerm: 'navy beans', category: 'legumes' },
  { nameHe: 'אפונה יבשה', searchTerm: 'split peas', category: 'legumes' },
  { nameHe: 'חומוס מוכן', searchTerm: 'hummus', category: 'legumes' },

  // Fats & Oils
  { nameHe: 'אבוקדו', searchTerm: 'avocado', category: 'fats' },
  { nameHe: 'שמן זית', searchTerm: 'olive oil', category: 'fats' },
  { nameHe: 'שמן קנולה', searchTerm: 'canola oil', category: 'fats' },
  { nameHe: 'שמן צמחי', searchTerm: 'vegetable oil', category: 'fats' },
  { nameHe: 'שמן קוקוס', searchTerm: 'coconut oil', category: 'fats' },
  { nameHe: 'שמן שומשום', searchTerm: 'sesame oil', category: 'fats' },
  { nameHe: 'שמן פשתן', searchTerm: 'flaxseed oil', category: 'fats' },
  { nameHe: 'חמאה', searchTerm: 'butter', category: 'fats' },
  { nameHe: 'מרגרינה', searchTerm: 'margarine', category: 'fats' },
  { nameHe: 'מיונז', searchTerm: 'mayonnaise', category: 'fats' },

  // Sweets & Desserts
  { nameHe: 'שוקולד מריר', searchTerm: 'dark chocolate', category: 'sweets' },
  { nameHe: 'שוקולד חלב', searchTerm: 'milk chocolate', category: 'sweets' },
  { nameHe: 'שוקולד לבן', searchTerm: 'white chocolate', category: 'sweets' },
  { nameHe: 'דבש', searchTerm: 'honey', category: 'sweets' },
  { nameHe: 'ריבה', searchTerm: 'jam', category: 'sweets' },
  { nameHe: 'סוכר', searchTerm: 'sugar', category: 'sweets' },
  { nameHe: 'סוכר חום', searchTerm: 'brown sugar', category: 'sweets' },
  { nameHe: 'סירופ מייפל', searchTerm: 'maple syrup', category: 'sweets' },
  { nameHe: 'נוטלה', searchTerm: 'chocolate hazelnut spread', category: 'sweets' },
  { nameHe: 'גלידה וניל', searchTerm: 'vanilla ice cream', category: 'sweets' },
  { nameHe: 'גלידה שוקולד', searchTerm: 'chocolate ice cream', category: 'sweets' },
  { nameHe: 'עוגת שוקולד', searchTerm: 'chocolate cake', category: 'sweets' },
  { nameHe: 'עוגיות שוקולד', searchTerm: 'chocolate chip cookies', category: 'sweets' },
  { nameHe: 'בראוניז', searchTerm: 'brownies', category: 'sweets' },
  { nameHe: 'דונאטס', searchTerm: 'donuts', category: 'sweets' },

  // Beverages
  { nameHe: 'קפה', searchTerm: 'coffee', category: 'beverages' },
  { nameHe: 'תה', searchTerm: 'tea', category: 'beverages' },
  { nameHe: 'מיץ תפוזים', searchTerm: 'orange juice', category: 'beverages' },
  { nameHe: 'מיץ תפוחים', searchTerm: 'apple juice', category: 'beverages' },
  { nameHe: 'מיץ גזר', searchTerm: 'carrot juice', category: 'beverages' },
  { nameHe: 'מיץ ענבים', searchTerm: 'grape juice', category: 'beverages' },
  { nameHe: 'משקה אנרגיה', searchTerm: 'energy drink', category: 'beverages' },
  { nameHe: 'סודה', searchTerm: 'soda', category: 'beverages' },
  { nameHe: 'קולה', searchTerm: 'cola', category: 'beverages' },

  // Condiments & Sauces
  { nameHe: 'קטשופ', searchTerm: 'ketchup', category: 'condiments' },
  { nameHe: 'חרדל', searchTerm: 'mustard', category: 'condiments' },
  { nameHe: 'רוטב סויה', searchTerm: 'soy sauce', category: 'condiments' },
  { nameHe: 'רוטב טריאקי', searchTerm: 'teriyaki sauce', category: 'condiments' },
  { nameHe: 'רוטב ברביקיו', searchTerm: 'bbq sauce', category: 'condiments' },
  { nameHe: 'רוטב עגבניות', searchTerm: 'tomato sauce', category: 'condiments' },
  { nameHe: 'רוטב פסטו', searchTerm: 'pesto', category: 'condiments' },
  { nameHe: 'ויניגרט', searchTerm: 'vinaigrette', category: 'condiments' },
  { nameHe: 'חומץ', searchTerm: 'vinegar', category: 'condiments' },
  { nameHe: 'חומץ בלסמי', searchTerm: 'balsamic vinegar', category: 'condiments' },

  // Processed & Prepared Foods
  { nameHe: 'פיצה', searchTerm: 'pizza', category: 'processed' },
  { nameHe: 'המבורגר מוכן', searchTerm: 'burger prepared', category: 'processed' },
  { nameHe: 'סושי', searchTerm: 'sushi', category: 'processed' },
  { nameHe: 'פלאפל', searchTerm: 'falafel', category: 'processed' },
  { nameHe: 'שווארמה', searchTerm: 'shawarma', category: 'processed' },
  { nameHe: 'צ\'יפס', searchTerm: 'french fries', category: 'processed' },
  { nameHe: 'צ\'יפס תפוצ\'יפס', searchTerm: 'potato chips', category: 'processed' },
  { nameHe: 'פופקורן', searchTerm: 'popcorn', category: 'processed' },
  { nameHe: 'פרצל', searchTerm: 'pretzel', category: 'processed' },
  { nameHe: 'טאקו', searchTerm: 'taco', category: 'processed' },
  { nameHe: 'בוריטו', searchTerm: 'burrito', category: 'processed' },

  // Tofu & Meat Alternatives
  { nameHe: 'טופו', searchTerm: 'tofu', category: 'protein' },
  { nameHe: 'טמפה', searchTerm: 'tempeh', category: 'protein' },
  { nameHe: 'סיטן', searchTerm: 'seitan', category: 'protein' },
  { nameHe: 'בשר טבעוני', searchTerm: 'plant based meat', category: 'protein' },

  // Herbs & Spices
  { nameHe: 'בזיליקום', searchTerm: 'basil', category: 'herbs' },
  { nameHe: 'פטרוזיליה', searchTerm: 'parsley', category: 'herbs' },
  { nameHe: 'כוסברה', searchTerm: 'cilantro', category: 'herbs' },
  { nameHe: 'נענע', searchTerm: 'mint', category: 'herbs' },
  { nameHe: 'רוזמרין', searchTerm: 'rosemary', category: 'herbs' },
  { nameHe: 'טימין', searchTerm: 'thyme', category: 'herbs' },
  { nameHe: 'אורגנו', searchTerm: 'oregano', category: 'herbs' },
  { nameHe: 'זעתר', searchTerm: 'za\'atar', category: 'herbs' },
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
