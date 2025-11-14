# 🥗 Nutrition Track - מעקב תזונה

AI-powered nutrition tracking app with natural language food logging in Hebrew.

## ✨ Features

- 🗣️ **Natural Language Food Logging** - Just say what you ate: "אכלתי 2 ביצים וטוסט"
- 🤖 **Multi-AI Support** - Works with Gemini, OpenAI, or Claude
- 💾 **Own Food Database** - Seeded from USDA, customizable with Israeli foods
- 📊 **Nutrition Facts** - Per food, per meal, and daily totals
- 🎯 **Goal Setting** - Track calories, macros (protein, carbs, fats), and fiber
- 📖 **Personal Recipe Collection** - Create, search, and save custom recipes
- 🤖 **AI Recipe Generator** - Generate personalized recipes based on ingredients and preferences
- ⭐ **Favorites** - Save your common meals, foods, and recipes
- 🇮🇱 **Hebrew RTL Support** - Full right-to-left interface

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS 4
- **Database:** NeonDB (PostgreSQL) + Drizzle ORM
- **AI:** Vercel AI SDK (Gemini/OpenAI/Claude)
- **Token Optimization:** TOON Format (saves 30-60% on AI costs!)
- **Language:** TypeScript 5
- **Nutrition Data:** USDA FoodData Central API

## 💰 Why TOON?

TOON format dramatically reduces tokens when sending food data to AI:

```typescript
// JSON (verbose, expensive)
[
  {"id": 1, "name": "ביצה", "calories": 70, "protein": 6},
  {"id": 2, "name": "לחם", "calories": 80, "protein": 4}
]

// TOON (compact, cheap!)
foods[2]{id,name,calories,protein}:
 1,ביצה,70,6
 2,לחם,80,4
```

**Result:** 30-60% fewer tokens = 30-60% lower AI costs! 💸

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nutrition-track.git
cd nutrition-track

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

## 🔑 Required Environment Variables

```env
# Database (required)
DATABASE_URL=postgresql://user:password@host/database

# AI Provider (at least one required)
GOOGLE_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# USDA API (optional but recommended)
USDA_API_KEY=your_usda_api_key_here
```

### Get API Keys

- **NeonDB:** https://neon.tech (free tier available)
- **Gemini:** https://makersuite.google.com/app/apikey (free!)
- **OpenAI:** https://platform.openai.com/api-keys
- **Anthropic:** https://console.anthropic.com/
- **USDA:** https://fdc.nal.usda.gov/api-key-signup.html (free!)

## 📚 Project Structure

```
nutrition-track/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/
│       ├── ai/          # AI integration & food parser
│       ├── db/          # Database schema & client
│       ├── toon/        # TOON format utilities
│       └── usda/        # USDA API integration
├── drizzle/             # Database migrations
└── public/              # Static assets
```

## 🗄️ Database Schema

- **users** - User accounts with nutrition goals
- **foods** - Food database (USDA + custom + Israeli foods)
- **meals** - User meal logs with AI-parsed text
- **meal_items** - Foods in each meal
- **recipes** - Personal recipe collection with AI-generated options
- **recipe_ingredients** - Recipe ingredients with quantities
- **favorites** - Saved meals, foods, and recipes

## 🎯 Usage Example

```typescript
import { parseFoodInput } from '@/lib/ai/food-parser';

// User types in natural language (Hebrew)
const input = "ארוחת בוקר: 2 ביצים, טוסט עם חמאת בוטנים";

// AI + TOON parses it automatically
const result = await parseFoodInput(input);

// Result:
// {
//   foods: [
//     { name: "ביצה", quantity: 2, unit: "unit" },
//     { name: "טוסט", quantity: 1, unit: "unit" },
//     { name: "חמאת בוטנים", quantity: 1, unit: "tbsp" }
//   ],
//   mealType: "breakfast"
// }
```

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Database commands
npm run db:generate    # Generate migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio

# Build for production
npm run build
npm start
```

## 🌱 Seeding the Database

```typescript
import { importCommonFoods, COMMON_FOODS_QUERIES } from '@/lib/usda';

// Import common foods from USDA
await importCommonFoods(COMMON_FOODS_QUERIES);
```

## 🤝 Contributing

Contributions are welcome! Especially:

- 🇮🇱 Adding Israeli food products
- 🌍 Translation to other languages
- 🎨 UI/UX improvements
- 🐛 Bug fixes

## 📝 License

MIT

## 🙏 Credits

- **TOON Format:** https://github.com/toon-format/toon
- **USDA FoodData Central:** https://fdc.nal.usda.gov/
- **Vercel AI SDK:** https://sdk.vercel.ai/
