import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function seedDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if data already exists
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Database already has users. Skipping seed...');
      return;
    }

    // Example users data
    const exampleUsers = [
      {
        email: 'user1@example.com',
        password: 'password123',
      },
      {
        email: 'user2@example.com',
        password: 'password456',
      },
      {
        email: 'admin@example.com',
        password: 'adminpass123',
      },
    ];

    // Hash passwords and create users
    for (const userData of exampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        email: userData.email,
        password: hashedPassword,
      });
      await userRepository.save(user);
      console.log(`✅ Created user: ${userData.email}`);
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run seed if this file is executed directly
const isDirectExecution = require.main === module;
if (isDirectExecution) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
