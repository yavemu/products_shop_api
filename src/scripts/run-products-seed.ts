import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedProductsUseCase } from '../application/products/use-cases/seed-products.usecase';
import * as productsData from '../seeds/products.seed.json';

async function runProductSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedUseCase = app.get(SeedProductsUseCase);
    const dataArray = Object.values(productsData);

    await seedUseCase.execute(dataArray);
    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await app.close();
  }
}

runProductSeed();
