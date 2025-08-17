import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from '../database/entities/order.orm-entity';
import { OrderRepositoryAdapter } from '../database/repositories/order.repository.adapter';
import { ORDER_REPOSITORY } from '../../core/domain/orders/ports/order-repository.port';
import {
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  GetOrdersUseCase,
} from '../../core/application/orders/use-cases';
import { OrderController } from '../../interfaces/web/order/order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderOrmEntity])],
  exports: [],
  controllers: [OrderController],
  providers: [
    OrderRepositoryAdapter,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersUseCase,
    {
      provide: ORDER_REPOSITORY,
      useExisting: OrderRepositoryAdapter,
    },
  ],
})
export class OrderModule {}
