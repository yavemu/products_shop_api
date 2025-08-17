import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../../domain/products/ports/product-repository.port';
import type { ProductRepositoryPort } from '../../../domain/products/ports/product-repository.port';

@Injectable()
export class SeedProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(productsData: any): Promise<void> {
    const existingCount = await this.repository.count();
    if (existingCount > 0) {
      throw new Error('Products already exist in database');
    }

    for (const productData of productsData) {
      await this.repository.save(productData);
    }
  }
}
