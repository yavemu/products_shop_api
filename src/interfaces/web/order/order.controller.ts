import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  GetOrdersUseCase,
} from '../../../core/application/orders/use-cases';
import { CreateOrderDto } from './dto/create-order.dto';

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

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderById.execute(id);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.createOrder.execute(createOrderDto);
  }
}
