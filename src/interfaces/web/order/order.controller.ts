import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  GetOrdersUseCase,
} from '../../../core/application/orders/use-cases';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly getOrders: GetOrdersUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrderById: GetOrderByIdUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.getOrders.execute();
  }

  @Get('id')
  async getById(@Param('id') id: number) {
    return this.getOrderById.execute(id);
  }
}
