# 🚀 Nutrition Track - Setup Guide

Complete guide to get the application up and running.

## 📋 Prerequisites

- Node.js 18+ installed
- NeonDB account (free tier works great!)
- At least one AI provider API key (Gemini recommended - it's free!)

## 🛠️ Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Required variables:
```env
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host/database

# AI Provider (at least ONE required)
GOOGLE_API_KEY=xxx  # FREE! Get at: https://makersuite.google.com/app/apikey
# OR
OPENAI_API_KEY=xxx  # https://platform.openai.com/api-keys
# OR
ANTHROPIC_API_KEY=xxx  # https://console.anthropic.com/

# USDA (Optional but recommended for seeding)
USDA_API_KEY=xxx  # FREE! Get at: https://fdc.nal.usda.gov/api-key-signup.html
```

### 3. Setup Database

```bash
# Push the database schema to NeonDB
npm run db:push
```

This creates all the necessary tables:
- ✅ users
- ✅ foods
- ✅ meals
- ✅ meal_items
- ✅ recipes
- ✅ recipe_ingredients
- ✅ favorites

### 4. Seed the Database

```bash
# Create mock user (ID: 1)
npm run seed:user

# Import common foods from USDA (50+ foods)
npm run seed
```

**What gets seeded:**
- **User:** Demo user (דני כהן) with default nutrition goals
- **Foods:** 50+ common foods with full nutrition data
  - Proteins (chicken, beef, fish, eggs)
  - Dairy (milk, yogurt, cheese)
  - Grains (rice, bread, pasta)
  - Vegetables (tomato, cucumber, broccoli, etc.)
  - Fruits (banana, apple, berries, etc.)
  - Nuts & Seeds (almonds, peanut butter, etc.)
  - Legumes (chickpeas, lentils, beans)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Quick Start Guide

### First Time User Flow

1. **Open the app** → http://localhost:3000
2. **Click "התחל עכשיו"** → Goes to Dashboard
3. **Dashboard** → See nutrition stats (empty initially)
4. **Click "+ הוסף ארוחה"** → Goes to Meals page
5. **Type what you ate** in natural language:
   ```
   "2 ביצים וטוסט עם אבוקדו"
   ```
6. **Click "פרסר עם AI והוסף"** → AI parses and creates meal
7. **Go back to Dashboard** → See your updated stats!

---

## 📚 API Endpoints

### Foods

```bash
# Search foods
GET /api/foods/search?q=ביצה&limit=20
```

### Meals

```bash
# Get all meals
GET /api/meals

# Get meals for specific date
GET /api/meals?date=2025-11-14

# Create meal
POST /api/meals
{
  "name": "ארוחת בוקר",
  "mealType": "breakfast",
  "items": [
    { "foodId": "xxx", "quantity": 100, "unit": "g" }
  ]
}

# Delete meal
DELETE /api/meals?id=xxx

# Parse natural language with AI
POST /api/meals/parse
{
  "text": "2 ביצים וטוסט",
  "provider": "gemini"  // optional
}
```

### Stats

```bash
# Get daily stats
GET /api/stats/daily

# Get stats for specific date
GET /api/stats/daily?date=2025-11-14
```

---

## 🧪 Testing the API

Use the built-in API client:

```typescript
import api from '@/lib/api-client';

// Search foods
const { foods } = await api.foods.search('ביצה');

// Parse meal with AI
const result = await api.meals.parse('2 ביצים וטוסט');

// Create meal
const { meal } = await api.meals.create({
  name: 'ארוחת בוקר',
  mealType: 'breakfast',
  items: result.mealData.items,
});

// Get daily stats
const stats = await api.stats.getDaily();
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio (visual DB editor)
npm run db:generate      # Generate migrations

# Seeding
npm run seed:user        # Create/update mock user
npm run seed             # Import USDA foods

# Code Quality
npm run lint             # Run ESLint
```

---

## 🎨 Project Structure

```
nutrition-track/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── foods/
│   │   │   ├── meals/
│   │   │   └── stats/
│   │   ├── dashboard/        # Dashboard page
│   │   ├── meals/            # Food logging page
│   │   ├── recipes/          # Recipes page
│   │   └── profile/          # Settings page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   ├── nutrition/        # Nutrition widgets
│   │   ├── meals/            # Meal components
│   │   └── recipes/          # Recipe components
│   ├── lib/
│   │   ├── ai/               # AI integration
│   │   ├── db/               # Database config & schema
│   │   ├── toon/             # TOON utilities
│   │   ├── usda/             # USDA API integration
│   │   ├── recipes/          # Recipe functions
│   │   ├── api-client.ts     # Frontend API client
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript types
├── scripts/
│   ├── seed-usda.ts          # USDA food seeding
│   └── seed-user.ts          # User seeding
└── .env.local                # Your environment variables
```

---

## ❓ Troubleshooting

### Database connection fails

```bash
# Make sure DATABASE_URL is correct in .env.local
# Test the connection:
npm run db:studio
```

### AI parsing doesn't work

```bash
# Make sure you have an AI provider key in .env.local
# Gemini is free and recommended:
GOOGLE_API_KEY=xxx
```

### Foods not found when logging

```bash
# Make sure you ran the seeding:
npm run seed
```

### Build fails

```bash
# Clear cache and rebuild:
rm -rf .next
npm run build
```

---

## 🌟 Next Steps

After setup, you can:

1. **Test the food logging** with AI
2. **Add more foods** via the USDA API
3. **Create recipes** with AI
4. **Setup authentication** (NextAuth.js)
5. **Deploy to Vercel**

Enjoy tracking your nutrition! 🥗
