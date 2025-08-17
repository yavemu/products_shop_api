import { Controller, Get, Param } from '@nestjs/common';
import {
  GetProductByIdUseCase,
  GetProductsUseCase,
} from '../../../core/application/products/use-cases';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProducts: GetProductsUseCase,
    private readonly getProductById: GetProductByIdUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.getProducts.execute();
  }

  @Get('id')
  async getById(@Param('id') id: number) {
    return this.getProductById.execute(id);
  }
}
