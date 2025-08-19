import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../../domain/products/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../../domain/products/ports/product-repository.port';
import type { ProductRepositoryPort } from '../../../domain/products/ports/product-repository.port';
import { IProductFilter } from './interfaces/product-filder.interface';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(filters?: IProductFilter): Promise<Product[]> {
    return this.repository.findAll(filters);
  }
}
