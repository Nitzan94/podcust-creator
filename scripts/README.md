# Scripts Documentation

## Database Seeding

### `seed-usda.ts` - USDA Food Database Seeding

Seeds the database with common foods from USDA FoodData Central.

**Prerequisites:**
1. DATABASE_URL configured in `.env.local`
2. USDA_API_KEY (optional but recommended) - Get free key at https://fdc.nal.usda.gov/api-key-signup.html
3. Database schema pushed: `npm run db:push`

**Usage:**
```bash
npm run seed
```

**What it does:**
- Imports 50+ common foods from USDA
- Adds Hebrew names
- Includes full nutrition data (calories, protein, carbs, fats, fiber)
- Skips duplicates
- Rate-limited to respect USDA API limits

**Categories included:**
- Proteins (chicken, beef, fish, eggs)
- Dairy (milk, yogurt, cheese)
- Grains (rice, bread, pasta, oats)
- Vegetables (tomato, cucumber, broccoli, etc.)
- Fruits (banana, apple, berries, etc.)
- Nuts & Seeds (almonds, walnuts, peanut butter)
- Fats (avocado, olive oil, butter)
- Legumes (chickpeas, lentils, beans)

**Output:**
- Success/failure statistics
- Detailed logs for each food
- Error reporting

**Example:**
```bash
$ npm run seed

🌱 Starting USDA food seeding...
📊 Total foods to import: 53

🔍 Searching for: ביצה (egg whole raw)...
   ✅ Added: ביצה
      Calories: 143 | Protein: 12.6g

...

📊 Statistics:
   Total:    53
   ✅ Success: 48
   ⏭️  Skipped: 3
   ❌ Failed:  2
   ⏱️  Duration: 8.5s

🎉 Database seeded successfully!
```

**Notes:**
- The script is idempotent - safe to run multiple times
- Existing foods are skipped automatically
- Rate limited to 100ms between requests
- Full error handling and reporting
