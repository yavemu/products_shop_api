import { Controller, Get, Param } from '@nestjs/common';
import {
  GetProductByIdUseCase,
  GetProductsUseCase,
} from '../../../core/application/products/use-cases';
import {
  FindAllProductsSwaggerDecorator,
  GetProductByIdSwaggerDecorator,
} from '../../../commons/decorators';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProducts: GetProductsUseCase,
    private readonly getProductById: GetProductByIdUseCase,
  ) {}

  @Get()
  @FindAllProductsSwaggerDecorator()
  async getAll() {
    return this.getProducts.execute();
  }

  @Get('id')
  @GetProductByIdSwaggerDecorator()
  async getById(@Param('id') id: number) {
    return this.getProductById.execute(id);
  }
}
