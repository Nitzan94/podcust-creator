/**
 * Create mock user for development
 * Usage: tsx scripts/seed-user.ts
 */

import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

async function seedUser() {
  console.log('🌱 Seeding mock user...\n');

  const mockUser = {
    id: '1',
    email: 'demo@nutrition-track.com',
    name: 'דני כהן',
    dailyCalorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 70,
    fiberGoal: 30,
  };

  try {
    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.id, mockUser.id),
    });

    if (existing) {
      console.log('⏭️  User already exists, updating...');
      await db.update(users)
        .set(mockUser)
        .where(eq(users.id, mockUser.id));
      console.log('✅ User updated successfully!\n');
    } else {
      console.log('➕ Creating new user...');
      await db.insert(users).values(mockUser);
      console.log('✅ User created successfully!\n');
    }

    console.log('📊 User details:');
    console.log(`   ID: ${mockUser.id}`);
    console.log(`   Email: ${mockUser.email}`);
    console.log(`   Name: ${mockUser.name}`);
    console.log(`   Daily Calories: ${mockUser.dailyCalorieGoal} kcal`);
    console.log(`   Protein Goal: ${mockUser.proteinGoal}g`);
    console.log(`   Carbs Goal: ${mockUser.carbsGoal}g`);
    console.log(`   Fat Goal: ${mockUser.fatGoal}g`);
    console.log(`   Fiber Goal: ${mockUser.fiberGoal}g\n`);

    console.log('🎉 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    process.exit(1);
  }
}

seedUser();
