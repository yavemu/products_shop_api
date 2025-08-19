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
import { Order } from 'src/core/domain/orders/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly getOrders: GetOrdersUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrderById: GetOrderByIdUseCase,
  ) {}

  @Get()
  async getAll(): Promise<Order[]> {
    return this.getOrders.execute();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Order | null> {
    return this.getOrderById.execute(id);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order | null> {
    return this.createOrder.execute(createOrderDto);
  }
}
