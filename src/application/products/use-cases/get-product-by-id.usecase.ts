import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/products/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../../domain/products/ports/product-repository.port';
import type { ProductRepositoryPort } from '../../../domain/products/ports/product-repository.port';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
