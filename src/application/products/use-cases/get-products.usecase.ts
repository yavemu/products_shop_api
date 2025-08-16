import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/products/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../../domain/products/ports/product-repository.port';
import type { ProductRepositoryPort } from '../../../domain/products/ports/product-repository.port';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
