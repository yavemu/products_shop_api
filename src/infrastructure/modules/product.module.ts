import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../database/entities/product.orm-entity';
import { ProductRepositoryAdapter } from '../database/repositories/product.repository.adapter';
import { PRODUCT_REPOSITORY } from '../../domain/products/ports/product-repository.port';
import {
  CreateProductUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  SeedProductsUseCase,
} from '../../application/products/use-cases';
import { ProductController } from '../../interfaces/rest/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  exports: [SeedProductsUseCase],
  controllers: [ProductController],
  providers: [
    ProductRepositoryAdapter,
    SeedProductsUseCase,
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductByIdUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: ProductRepositoryAdapter,
    },
  ],
})
export class ProductModule {}
