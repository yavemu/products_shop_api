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
import { Order } from '../../../core/domain/orders/entities/order.entity';
import {
  CreateOrderSwaggerDecorator,
  FindAllOrdersSwaggerDecorator,
  GetOrderByIdSwaggerDecorator,
} from '../../../commons/decorators';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly getOrders: GetOrdersUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrderById: GetOrderByIdUseCase,
  ) {}

  @Get()
  @FindAllOrdersSwaggerDecorator()
  async getAll(): Promise<Order[]> {
    return this.getOrders.execute();
  }

  @Get(':id')
  @GetOrderByIdSwaggerDecorator()
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Order | null> {
    return this.getOrderById.execute(id);
  }

  @Post()
  @CreateOrderSwaggerDecorator()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.createOrder.execute(createOrderDto);
  }
}
